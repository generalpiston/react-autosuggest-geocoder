import React from 'react';
import ReactAutosuggestGeocoder from '../src/index.js';
import renderer from 'react-test-renderer';

var API_KEY = process.env.API_KEY;

test('instance methods', () => {
  const component = renderer.create(
    <ReactAutosuggestGeocoder
      endpoint='https://search.mapzen.com/v1'
      apiKey={API_KEY}
      onSuggestionSelected={(event, { search, suggestion, method }) => {
        this.setState({
          location: suggestion.properties.label,
          latitude: suggestion.geometry.coordinates[1],
          longitude: suggestion.geometry.coordinates[0]
        });
      }} />
  );
  component.update('865 market st., san francisco, ca');
  expect(component.input.value).toBe('865 market st., san francisco, ca');
});
