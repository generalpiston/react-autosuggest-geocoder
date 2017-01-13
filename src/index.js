
import * as _ from 'lodash';
import $ from 'jquery';
import React from 'react';

import Autosuggest from 'react-autosuggest';

import '../styles/index.scss';


export class ReactAutosuggestGeocoder extends React.Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    apiKey: React.PropTypes.string.isRequired,
    onSuggestionSelected: React.PropTypes.func.isRequired,
    getSuggestionValue: React.PropTypes.func.isRequired,
    renderSuggestion: React.PropTypes.func.isRequired
  };

  static defaultProps = {
    url: "https://search.mapzen.com/v1",
    apiKey: null,
    getSuggestionValue: suggestion => suggestion.properties.label,
    renderSuggestion: suggestion => (
      <div className="autosuggest-item">
        {suggestion.properties.label}
      </div>
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      selected: false
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      selected: false
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const url = this.props.url + "/autocomplete";
    return $.ajax({
      type: 'GET',
      url: url,
      data: {
        api_key: this.props.apiKey,
        sources: "openaddresses",
        text: value
      }
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
    this.setState({ selected: true });
    return this.props.onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method })
  };

  render() {
    const { suggestions, value } = this.state;
    const {
      inputProps,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      onSuggestionSelected,
      ...props
    } = this.props;

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
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
