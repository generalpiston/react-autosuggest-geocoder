# react-autosuggest-geocoder

[react-autosuggest](https://github.com/moroshko/react-autosuggest) with suggestions from [pelias](https://github.com/pelias/pelias) services. Check out the [demo](http://abec.github.io/react-autosuggest-geocoder)

![react autosuggest example](https://abec.github.io/react-autosuggest-geocoder/images/basic.gif)

## Setup / Usage

### 1. Install react-autosuggest-geocoder

Through NPM:

```
npm install --save react-autosuggest-geocoder
```

Through Yarn:

```
yarn add react-autosuggest-geocoder
```

### 2. Create a react component that wraps react-autosuggest-geocoder

```
import { ReactAutosuggestGeocoder } from 'react-autosuggest-geocoder'

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      latitude: Infinity,
      longitude: Infinity
    };
  }

  render() {
    return (
      <div>
        <ReactAutosuggestGeocoder
          url='https://search.mapzen.com/v1'
          apiKey='...'
          onSuggestionSelected={(event, { search, suggestion, method }) => {
            this.setState({
              location: suggestion.properties.label,
              latitude: suggestion.geometry.coordinates[1],
              longitude: suggestion.geometry.coordinates[0]
            })
          }} />
      </div>
    );
  }
}
```

## Props

| Prop | Type | Required | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| url | string | ✓ | https://search.mapzen.com/v1 | |
| apiKey | string | ✓ | | Pelias service API key. Most useful with MapZen. See https://mapzen.com/developers to get a mapzen API key. |
| sources | string | | openaddresses | Filter data by data source. See https://mapzen.com/documentation/search/search/#filter-by-data-source for more information. |
| fetchDelay | number | ✓ | 150 | Debounce API requests with this delay (in milliseconds). |
| reverseGeocode | boolean | | false | Reverse geocode based on the provided center. |
| center | object | | | Orient search results towards the provided center. See https://mapzen.com/documentation/search/search/#prioritize-results-by-proximity for more detail. |
| bounds | array | | | Bounding box to limit search results. See https://mapzen.com/documentation/search/search/#search-within-a-rectangular-region for more detail. |
| onSuggestionSelected | function | | | See https://github.com/moroshko/react-autosuggest#onSuggestionSelectedProp for details. |
| onReverseSelected | function | | | Invoked after reverse geocoding is performed. |
| getSuggestionValue | function | | | See https://github.com/moroshko/react-autosuggest#getsuggestionvalue-required for details. |
| renderSuggestion | function | | | See https://github.com/moroshko/react-autosuggest#rendersuggestion-required for details. |

## Ref Methods

### update(newValue)

Update the autocomplete input text field.

### clear()

Clear the autocomplete input text field and deselect any previously selected values.

### focus()

Bring browser focus to the autocomplete input text field.

### blur()

Unfocus browser from the autocomplete input text field.

## License

BSD-3

