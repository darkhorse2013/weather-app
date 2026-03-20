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
  const [weatherData, setWeatherData] = useState("");

  //derived data , not stored in state but calculated each render
  let fakeData = {
    city: "London",
    temperature: 18,
    condition: "Cloudy",
  };

  //event handler for input box

  function onSearchChange(event) {
    console.log(event.target.value);

    //reset error message
    setSearchError("");
    //we want to store this in state for button to reference
    setCity(event.target.value);
  }

  //event handler for the button
  function onSearchClick() {
    //if no City has been entered, display error message
    if (cityEntered.trim().length === 0) {
      //      showSearchError = "please enter a city";
      setSearchError("Please enter a city!");
    } else {
      //display weather details based on details within WeatherData object
      setWeatherData(fakeData);
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
