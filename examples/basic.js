
import React from 'react'
import { render } from 'react-dom'

import { ReactAutosuggestGeocoder } from '../lib/index.js'

if (typeof document !== 'undefined') {
  render((
    <ReactAutosuggestGeocoder
      center={{
        latitude: 37.7701981,
        longitude: -122.4522257
      }}
      endpoint='https://search.mapzen.com/v1'
      apiKey='mapzen-6DCM25F'
      onSuggestionSelected={(event, { search, suggestion }) => {
        console.log(search)
        console.log(suggestion)
      }} />
  ), document.getElementById('basic'))
}
