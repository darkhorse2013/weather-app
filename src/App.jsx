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
  //loading weather data
  const [isLoading, setIsLoading] = useState(false);

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

    //set loading state
    setIsLoading(true);

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

      let weatherCondition;

      weatherCondition = returnCondition(
        weatherApiData.current_weather.weathercode,
      );

      const finalWeatherData = {
        city: cityName,
        temperature: weatherApiData.current_weather.temperature,
        condition: weatherCondition,
      };
      //save into state, trigger a re-render
      setWeatherData(finalWeatherData);

      //if api call fails
    } catch (error) {
      console.log(error);
      setSearchError("Something went wrong. Please try again.");
      setWeatherData(null);
    } finally {
      //set loading state to false so it does no longer appears
      setIsLoading(false);
    }
  }

  /*
  Code	Description
0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86	Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail
*/

  //Helper function
  function returnCondition(weatherCode) {
    if (weatherCode === 0) return "Clear sky";

    if (weatherCode === 1) return "Mainly clear";
    if (weatherCode === 2) return "Partly cloudy";
    if (weatherCode === 3) return "Overcast";

    if (weatherCode === 45) return "Fog";
    if (weatherCode === 48) return "Depositing rime fog";

    if (weatherCode === 51) return "Drizzle (light)";
    if (weatherCode === 53) return "Drizzle (moderate)";
    if (weatherCode === 55) return "Drizzle (dense)";

    if (weatherCode === 56) return "Freezing drizzle (light)";
    if (weatherCode === 57) return "Freezing drizzle (dense)";

    if (weatherCode === 61) return "Rain (slight)";
    if (weatherCode === 63) return "Rain (moderate)";
    if (weatherCode === 65) return "Rain (heavy)";

    if (weatherCode === 66) return "Freezing rain (light)";
    if (weatherCode === 67) return "Freezing rain (heavy)";

    if (weatherCode === 71) return "Snow fall (slight)";
    if (weatherCode === 73) return "Snow fall (moderate)";
    if (weatherCode === 75) return "Snow fall (heavy)";

    if (weatherCode === 77) return "Snow grains";

    if (weatherCode === 80) return "Rain showers (slight)";
    if (weatherCode === 81) return "Rain showers (moderate)";
    if (weatherCode === 82) return "Rain showers (violent)";

    if (weatherCode === 85) return "Snow showers (slight)";
    if (weatherCode === 86) return "Snow showers (heavy)";

    if (weatherCode === 95) return "Thunderstorm";

    if (weatherCode === 96) return "Thunderstorm with slight hail";
    if (weatherCode === 99) return "Thunderstorm with heavy hail";

    return "Unknown weather";
  }

  let weatherBlock;
  if (isLoading) {
    //if is loading state has been triggered
    weatherBlock = <div>Loading weather data...</div>;
  } else if (weatherData) {
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
