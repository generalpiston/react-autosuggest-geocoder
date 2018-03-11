# react-autosuggest-geocoder

[react-autosuggest](https://github.com/moroshko/react-autosuggest) with suggestions from [pelias](https://github.com/pelias/pelias) services. Click [here](http://abec.github.io/react-autosuggest-geocoder) to try it out.

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
          url='https://api.geocode.earth/v1'
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
| url | string | ✓ | https://api.geocode.earth/v1 | |
| apiKey | string | ✓ | | Pelias service API key. Most useful with geocode.earth. See https://geocode.earth/ to get an API key. |
| sources | string | ✓ | openaddresses | Filter data by data source. |
| fetchDelay | number | ✓ | 150 | Debounce API requests with this delay (in milliseconds). |
| center | object | | | Orient search results towards the provided center. |
| bounds | array | | | Bounding box to limit search results. |
| onSuggestionSelected | function | | | See https://github.com/moroshko/react-autosuggest#onSuggestionSelectedProp for details. |
| onReverseSelected | function | | | Invoked after reverse geocoding is performed. |
| getSuggestionValue | function | ✓ | Identity Function | See https://github.com/moroshko/react-autosuggest#getsuggestionvalue-required for details. |
| renderSuggestion | function | ✓ | Div Wrapper Function | See https://github.com/moroshko/react-autosuggest#rendersuggestion-required for details. |

## Ref Methods

### reverseGeocode({ latitude, longitude })

Reverse geocode the given point into the component input text field.

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

