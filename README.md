# react-autosuggest-geocoder

[react-autosuggest](https://github.com/moroshko/react-autosuggest) with suggestions from [pelias](https://github.com/pelias/pelias) services.

## Demo

Check out the [demo](http://abec.github.io/react-autosuggest-geocoder)

## Installation

Through Yarn:

```
yarn add https://github.com/abec/react-autosuggest-geocoder
```

Through NPM:

```
npm install --save https://github.com/abec/react-autosuggest-geocoder
```

## Example

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
          endpoint='https://search.mapzen.com/v1'
          apiKey='...'
          center={...}
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
