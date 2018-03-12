import React from 'react';
import { render } from 'react-dom';
import { ReactAutosuggestGeocoder } from 'react-autosuggest-geocoder';

if (typeof document !== 'undefined') {
  render((
    <ReactAutosuggestGeocoder
      center={{
        latitude: 37.7701981,
        longitude: -122.4522257
      }}
      bounds={[-122.5257357, 37.668316, -122.3581937, 37.836074]}
      url='https://api.geocode.earth/v1'
      apiKey='ge-f6217273880f432b'
      onSuggestionSelected={(event, { search, suggestion }) => {
        console.log(search);
        console.log(suggestion);
      }}
      ref={(c) => {
        window.c = c;
      }} />
  ), document.getElementById('basic'));
}
