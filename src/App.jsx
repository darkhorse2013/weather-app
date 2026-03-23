import { useState } from "react";
import "./App.css";

//components, will be put into own files later on
function SearchInput({ searchError, cityEntered, onChangeSearch }) {
  return (
    <>
      <div>Type in a city</div>
      <div>
        <span className="incorrectValue">{searchError}</span>
      </div>
      <input
        id="searchCity"
        value={cityEntered}
        onChange={onChangeSearch}
      ></input>
    </>
  );
}

//search button component, will be put into it's own file later on
function SearchButton({ onSearchButtonClick }) {
  return (
    <>
      <button id="searchButton" onClick={onSearchButtonClick}>
        Search
      </button>
    </>
  );
}

function App() {
  // React state management
  const [cityEntered, setCity] = useState("");
  const [showSearchError, setSearchError] = useState("");
  //Weather data object will be stored here
  const [weatherData, setWeatherData] = useState(null);

  //event handler for input box
  function onSearchChange(event) {
    console.log(event.target.value);

    //reset error message
    setSearchError("");
    //we want to store this in state for button to reference
    setCity(event.target.value);
  }

  //event handler for the button
  //async - this function will deal with something that takes time
  //does not block other api calls on page, when it finishes, come back here and continue
  async function onSearchClick() {
    //if no City has been entered, display error message
    if (cityEntered.trim().length === 0) {
      //      showSearchError = "please enter a city";
      setSearchError("Please enter a city!");
      //break out of function
      return;
    }

    try {
      //go call the API and wait (await) until the response comes back
      // await = pause here until this finishes, then continue
      //get coorindates
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityEntered}&count=1&language=en&format=json`,
      );

      //turn the API response into JavaScript data and wait for that too
      const geoData = await geoResponse.json();
      console.log("geocoding data", geoData);

      if (!geoData.results || geoData.results.length === 0) {
        setSearchError("City not found!");
        setWeatherData(null);
        return;
      }

      const latitude = geoData.results[0].latitude;
      const longitude = geoData.results[0].longitude;
      const cityName = geoData.results[0].name;

      //go call the API and wait (await) until the response comes back
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
      );

      const weatherApiData = await weatherResponse.json();
      console.log("weather data", weatherApiData);

      const finalWeatherData = {
        city: cityName,
        temperature: weatherApiData.current_weather.temperature,
        condition: weatherApiData.current_weather.weathercode,
      };

      //save into state, trigger a re-render
      setWeatherData(finalWeatherData);

      //if api call fails
    } catch (error) {
      console.log(error);
      setSearchError("Something went wrong. Please try again.");
      setWeatherData(null);
    }
  }

  let weatherBlock;

  if (weatherData) {
    weatherBlock = (
      <div>
        <div>Weather for {weatherData.city}</div>
        <div>Temperature: {weatherData.temperature}</div>
        <div>Condition: {weatherData.condition}</div>
      </div>
    );
  } else {
    weatherBlock = <div>No Weather Data Yet</div>;
  }

  return (
    <>
      <section id="center">
        <div>
          <h1>Weather app</h1>
          <p>Welcome to the Weather App!</p>
        </div>
        <div>
          <SearchInput
            searchError={showSearchError}
            cityEntered={cityEntered}
            onChangeSearch={onSearchChange}
          ></SearchInput>
          <SearchButton onSearchButtonClick={onSearchClick}></SearchButton>
          {weatherBlock}
        </div>
      </section>
    </>
  );
}

export default App;
