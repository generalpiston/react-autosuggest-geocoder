
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
    onSuggestionSelected: React.PropTypes.func.isRequired,
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

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      selected: false
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const url = this.props.url + "/autocomplete";
    const data = {
      api_key: this.props.apiKey,
      sources: "openaddresses",
      text: value
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
    .then((data) => {
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
    const url = this.props.url + "/search";
    return $.ajax({
      type: 'GET',
      url: url,
      data: {
        api_key: this.props.apiKey,
        sources: "openaddresses",
        text: suggestionValue
      }
    })
    .then((data) => {
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
