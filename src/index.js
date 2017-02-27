
import * as _ from 'lodash';
import $ from 'jquery';
import React from 'react';

import Autosuggest from 'react-autosuggest';

import '../styles/index.scss';


export class ReactAutosuggestGeocoder extends React.Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    apiKey: React.PropTypes.string.isRequired,
    fetchDelay: React.PropTypes.number.isRequired,
    reverseGeocode: React.PropTypes.bool.isRequired,
    onSuggestionSelected: React.PropTypes.func.isRequired,
    onReverseSelected: React.PropTypes.func.isRequired,
    getSuggestionValue: React.PropTypes.func.isRequired,
    renderSuggestion: React.PropTypes.func.isRequired,

    center: React.PropTypes.shape({
      latitude: React.PropTypes.number.isRequired,
      longitude: React.PropTypes.number.isRequired
    })
  };

  static defaultProps = {
    url: "https://search.mapzen.com/v1",
    apiKey: null,
    fetchDelay: 150,
    reverseGeocode: false,
    onReverseSelected: () => {},
    getSuggestionValue: suggestion => suggestion.properties.label,
    renderSuggestion: suggestion => (
      <div className="autosuggest-item">
        {suggestion.properties.label}
      </div>
    ),

    center: null
  };

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      selected: false
    };

    this._onSuggestionsFetchRequested = _.debounce(this.onSuggestionsFetchRequested, this.props.fetchDelay);
  }

  componentDidMount() {
    if (this.props.center) {
      return this.reverse(this.props.center).then((data) => {
        if (data.features.length > 0) {
          if (this.props.reverseGeocode) {
            this.setState({
              selected: true,
              value: data.features[0].properties.label
            })
          }
          return this.props.onReverseSelected({ search: data })
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.center && !_.isEqual(this.props.center, nextProps.center)) {
      return this.reverse(nextProps.center).then((data) => {
        if (data.features.length > 0) {
          if (this.props.reverseGeocode) {
            this.setState({
              selected: true,
              value: data.features[0].properties.label
            });
          }
          return this.props.onReverseSelected({ search: data })
        }
      });
    }
  }

  reverse(center) {
    const url = this.props.url + "/reverse";
    return $.ajax({
      type: 'GET',
      url: url,
      data: {
        api_key: this.props.apiKey,
        layers: "address",
        size: 1,
        "point.lat": center.latitude,
        "point.lon": center.longitude
      }
    })
    
  }

  search(text) {
    const url = this.props.url + "/search";
    return $.ajax({
      type: 'GET',
      url: url,
      data: {
        api_key: this.props.apiKey,
        sources: "openaddresses",
        text: text
      }
    })
  }

  autocomplete(text) {
    const url = this.props.url + "/autocomplete";
    const data = {
      api_key: this.props.apiKey,
      sources: "openaddresses",
      text: text
    }
    if (this.props.center) {
      data['focus.point.lat'] = this.props.center.latitude
      data['focus.point.lon'] = this.props.center.longitude
    }
    return $.ajax({
      type: 'GET',
      url: url,
      data: data
    })
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      selected: false
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    return this.autocomplete(value).then((data) => {
      this.setState({
        suggestions: _.uniqBy(data.features, (feature) => {
          return feature.properties.label;
        })
      });
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    return this.search(suggestionValue).then((data) => {
      this.setState({
        selected: true,
        value: suggestionValue
      });
      return this.props.onSuggestionSelected(event, { search: data, suggestion, suggestionValue, suggestionIndex, sectionIndex, method })
    });
  };

  render() {
    const { suggestions, value } = this.state;
    const {
      inputProps,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      onSuggestionSelected,
      fetchDelay,
      ...props
    } = this.props;

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this._onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={_.defaults(inputProps || {}, {
          value: value,
          onChange: this.onChange
        })}
        {...props}
      />
    );
  }
}
