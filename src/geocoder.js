import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { stringify } from 'qs';
import fetch from 'node-fetch';
import Autosuggest from 'react-autosuggest';

export class ReactAutosuggestGeocoder extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    sources: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
    fetchDelay: PropTypes.number.isRequired,
    center: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired
    }),
    bounds: PropTypes.array,

    onSearchSelected: PropTypes.func,
    onSuggestionSelected: PropTypes.func,
    onReverseSelected: PropTypes.func,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,

    fetch: PropTypes.func
  };

  static defaultProps = {
    url: 'https://api.geocode.earth/v1',
    sources: 'openaddresses',
    apiKey: null,
    fetchDelay: 150,
    center: null,
    bounds: null,

    onReverseSelected: () => {},
    getSuggestionValue: suggestion => suggestion.properties.label,
    renderSuggestion: suggestion => (
      <div className='autosuggest-item'>
        {suggestion.properties.label}
      </div>
    ),

    fetch: fetch
  };

  constructor (props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      selected: false
    };

    this.fetch_request_number = 0;

    this._onSuggestionsFetchRequested = _.debounce(this.onSuggestionsFetchRequested, this.props.fetchDelay);
  }

  componentDidMount () {
    this.input = this.autosuggest.input;
  }

  queryParameters ({ apiKey, sources, focus, center, bounds }, extra = {}) {
    const data = {
      api_key: apiKey,
      sources: sources
    };
    if (focus) {
      data['focus.point.lat'] = focus.latitude;
      data['focus.point.lon'] = focus.longitude;
    }
    if (center) {
      data['point.lat'] = center.latitude;
      data['point.lon'] = center.longitude;
    }
    if (bounds) {
      data['boundary.rect.min_lon'] = bounds[0];
      data['boundary.rect.min_lat'] = bounds[1];
      data['boundary.rect.max_lon'] = bounds[2];
      data['boundary.rect.max_lat'] = bounds[3];
    }
    return _.assign({}, data, extra);
  }

  reverse (center, bounds) {
    const url = this.props.url + '/reverse';
    const { apiKey } = this.props;
    const data = this.queryParameters({
      apiKey,
      center,
      bounds
    }, {
      layers: 'address',
      size: 1
    });
    return this.props.fetch(url + '?' + stringify(data), {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => response.json());
  }

  search (text) {
    const url = this.props.url + '/search';
    const { apiKey, sources, center, bounds } = this.props;
    const data = this.queryParameters({
      apiKey,
      sources,
      focus: center,
      bounds
    }, {
      text: text
    });
    return this.props.fetch(url + '?' + stringify(data), {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => response.json());
  }

  autocomplete (text) {
    const url = this.props.url + '/autocomplete';
    const { apiKey, sources, center, bounds } = this.props;
    const data = this.queryParameters({
      apiKey,
      sources,
      focus: center,
      bounds
    }, {
      text: text
    });
    return this.props.fetch(url + '?' + stringify(data), {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => response.json());
  }

  reverseGeocode = (point) => {
    let { latitude, longitude } = point || this.props.center || {};

    return this.reverse({ latitude, longitude }).then((data) => {
      if (data.features.length > 0) {
        this.setState({
          selected: true,
          value: data.features[0].properties.label
        });

        if (this.props.onReverseSelected) {
          return this.props.onReverseSelected({ search: data });
        }
      }
    });
  }

  blur = () => {
    this.input.blur();
  }

  focus = () => {
    this.input.focus();
  }

  update = (newValue) => {
    this.setState({
      value: newValue,
      selected: false
    });
  }

  clear = () => {
    this.setState({
      value: '',
      selected: false
    });
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
      selected: false
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    let request_number = this.fetch_request_number = (this.fetch_request_number + 1) % 10;

    return this.autocomplete(value).then((data) => {
      if (request_number === this.fetch_request_number) {
        this.setState({
          suggestions: _.uniqBy(data.features, (feature) => {
            return feature.properties.label;
          })
        });
      }
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    if (this.props.onSuggestionSelected) {
      return this.props.onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method });
    }
  };

  onEnterCapture = (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    if (!this.autosuggest) {
      return;
    }

    if (this.autosuggest.getHighlightedSuggestion() !== null) {
      return;
    }

    return this.onEnterWithoutHighlight(event);
  };

  onEnterWithoutHighlight = (event) => {
    let { value } = this.state;
    let suggestionValue = value;

    return this.search(suggestionValue).then((data) => {
      if (!data) {
        return;
      }

      if (!data.features) {
        return;
      }

      if (!data.features.length) {
        return;
      }

      let suggestion = data.features[0];
      this.setState({
        selected: true,
        value: suggestion.properties.label
      });

      if (this.props.onSearchSelected) {
        return this.props.onSearchSelected(event, { search: data, suggestion, suggestionValue, method: 'enter' });
      }
    });
  };

  render () {
    const { suggestions, value } = this.state;
    const {
      inputProps,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      onSuggestionSelected,
      fetchDelay,
      ...props
    } = this.props;
    const { onFocus, onBlur, onKeyDownCapture, ...restOfInputProps } = (inputProps || {});

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this._onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={_.defaults(restOfInputProps || {}, {
          value: value,
          onChange: this.onChange,
          onFocus: e => _.isFunction(onFocus) ? onFocus(e) : undefined,
          onBlur: e => _.isFunction(onBlur) ? onBlur(e) : undefined,
          onKeyDownCapture: this.onEnterCapture
        })}
        ref={(autosuggestRef) => {
          if (autosuggestRef !== null) {
            this.autosuggest = autosuggestRef;
          }
        }}
        {...props}
      />
    );
  }
}
