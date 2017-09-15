import React from 'react';
import { ReactAutosuggestGeocoder } from '../src/geocoder.js';
import renderer from 'react-test-renderer';

var API_KEY = process.env.API_KEY;

test('basic structure test', () => {
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
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
