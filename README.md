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
          endpoint='https://search.mapzen.com/v1'
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

## License

BSD-3

