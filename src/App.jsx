import { useState } from "react";
import "./App.css";

//components, will be put into own files later on
function SearchInput({
  searchError,
  cityEntered,
  onChangeSearch,
  keyboardPress,
}) {
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
        onKeyDown={keyboardPress}
      ></input>
    </>
  );
}

//search button component, will be put into it's own file later on
function SearchButton({ onSearchButtonClick, isLoading }) {
  let buttonText;

  if (isLoading === true) {
    buttonText = "Loading...";
  } else {
    buttonText = "Search";
  }

  return (
    <>
      <button
        id="searchButton"
        onClick={onSearchButtonClick}
        disabled={isLoading}
      >
        {buttonText}
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

  //check for keyboard strokes
  function onKeyDown(e) {
    if (e.key === "Enter") {
      searchWeather();
    }
  }

  //event handler for the button
  function onSearchClick() {
    searchWeather();
  }

  //async - this function will deal with something that takes time
  //does not block other api calls on page, when it finishes, come back here and continue
  async function searchWeather() {
    //clear old errors
    setSearchError("");
    //if no City has been entered, display error message
    if (cityEntered.trim().length === 0) {
      setSearchError("Please enter a city!");
      return;
    }

    //set loading state
    setIsLoading(true);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityEntered}&count=1&language=en&format=json`,
      );

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

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`,
      );

      const weatherApiData = await weatherResponse.json();
      console.log("weather data", weatherApiData);

      let forecastDays = [];
      let dailyWeather;
      let checkCondition;
      let weatherSymbol;
      let todaysDate;

      //cycle through weather api data, let's stick daily into an array
      for (let i = 0; i < weatherApiData.daily.time.length; i++) {
        checkCondition = returnCondition(weatherApiData.daily.weathercode[i]);
        weatherSymbol = getWeatherIcon(weatherApiData.daily.weathercode[i]);
        todaysDate = checkDate(weatherApiData.daily.time[i]);

        dailyWeather = {
          city: cityName,
          date: weatherApiData.daily.time[i],
          temperature_max: weatherApiData.daily.temperature_2m_max[i],
          temperature_min: weatherApiData.daily.temperature_2m_min[i],
          condition: checkCondition,
          weatherIcon: weatherSymbol,
          isTodaysDate: todaysDate,
        };

        forecastDays.push(dailyWeather);
      }

      console.log(forecastDays);
      setWeatherData(forecastDays);
    } catch (error) {
      console.log(error);
      setSearchError("Something went wrong. Please try again.");
      setWeatherData(null);
    } finally {
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

  //get icons
  function getWeatherIcon(weatherCode) {
    // Clear / clouds
    if (weatherCode === 0) return "\u2600\uFE0F";
    if (weatherCode === 1) return "\u{1F324}\uFE0F";
    if (weatherCode === 2) return "\u26C5";
    if (weatherCode === 3) return "\u2601\uFE0F";

    // Fog
    if (weatherCode === 45) return "\u{1F32B}\uFE0F";
    if (weatherCode === 48) return "\u{1F32B}\uFE0F";

    // Drizzle
    if (weatherCode === 51) return "\u{1F326}\uFE0F";
    if (weatherCode === 53) return "\u{1F326}\uFE0F";
    if (weatherCode === 55) return "\u{1F327}\uFE0F";

    // Freezing drizzle
    if (weatherCode === 56) return "\u{1F327}\uFE0F \u2744\uFE0F";
    if (weatherCode === 57) return "\u{1F327}\uFE0F \u2744\uFE0F";

    // Rain
    if (weatherCode === 61) return "\u{1F327}\uFE0F";
    if (weatherCode === 63) return "\u{1F327}\uFE0F";
    if (weatherCode === 65) return "\u{1F327}\uFE0F";

    // Freezing rain
    if (weatherCode === 66) return "\u{1F327}\uFE0F \u2744\uFE0F";
    if (weatherCode === 67) return "\u{1F327}\uFE0F \u2744\uFE0F";

    // Snow
    if (weatherCode === 71) return "\u2744\uFE0F";
    if (weatherCode === 73) return "\u2744\uFE0F";
    if (weatherCode === 75) return "\u2744\uFE0F";

    if (weatherCode === 77) return "\u{1F328}\uFE0F";

    // Rain showers
    if (weatherCode === 80) return "\u{1F326}\uFE0F";
    if (weatherCode === 81) return "\u{1F327}\uFE0F";
    if (weatherCode === 82) return "\u{1F327}\uFE0F";

    // Snow showers
    if (weatherCode === 85) return "\u{1F328}\uFE0F";
    if (weatherCode === 86) return "\u2744\uFE0F";

    // Thunderstorm
    if (weatherCode === 95) return "\u26C8\uFE0F";

    if (weatherCode === 96) return "\u26C8\uFE0F \u{1F9CA}";
    if (weatherCode === 99) return "\u26C8\uFE0F \u{1F9CA}";

    return "\u{1F324}\uFE0F";
  }

  //check date, get today's date
  function checkDate(apiDate) {
    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    let formatted = year + "-" + month + "-" + day;

    console.log("date today " + formatted);

    return formatted === apiDate;
  }

  let weatherBlock;
  if (isLoading) {
    weatherBlock = <div>Loading weather data...</div>;
  } else if (weatherData) {
    weatherBlock = (
      <div className="weather-container">
        <div className="weather-title">Weather for {weatherData[0].city}</div>

        <div className="weather-grid">
          {weatherData.map((dailyWeather) => (
            <div key={dailyWeather.date} className="weather-card">
              <div className="weather-line">
                <span className="weatherIcon">{dailyWeather.weatherIcon}</span>
              </div>

              <div className="weather-line">
                <span
                  className={
                    dailyWeather.isTodaysDate ? "highlightDate" : "weatherDate"
                  }
                >
                  Date: {dailyWeather.date}
                </span>
              </div>
              <div className="weather-line">
                Max: {dailyWeather.temperature_max}{"\u00B0C"}
              </div>
              <div className="weather-line">
                Min: {dailyWeather.temperature_min}{"\u00B0C"}
              </div>
              <div className="weather-line">{dailyWeather.condition}</div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    weatherBlock = <div>No Weather Data Yet</div>;
  }

  return (
    <>
      <section id="center">
        <div>
          <h1>Daily weather app</h1>
          <p>Welcome to the daily weather app!</p>
        </div>
        <div>
          <SearchInput
            searchError={showSearchError}
            cityEntered={cityEntered}
            onChangeSearch={onSearchChange}
            keyboardPress={onKeyDown}
          ></SearchInput>
          <SearchButton
            onSearchButtonClick={onSearchClick}
            isLoading={isLoading}
          ></SearchButton>
          {weatherBlock}
        </div>
      </section>
    </>
  );
}

export default App;
