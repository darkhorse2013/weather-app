import { useEffect, useRef, useState } from "react";
import "./App.css";

const SAVED_CITIES_KEY = "weather-app.saved-cities";

function formatTemperature(value) {
  return Math.round(value);
}

//components, will be put into own files later on
function SearchInput({
  searchError,
  cityEntered,
  onChangeSearch,
  keyboardPress,
}) {
  return (
    <>
      <div>
        <span className="incorrectValue">{searchError}</span>
      </div>
      <input
        id="searchCity"
        placeholder="Type in a city"
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

function ThemeToggleButton({ isCncTheme, onToggleTheme }) {
  return (
    <button
      type="button"
      className={
        isCncTheme
          ? "theme-toggle-button theme-toggle-button-active"
          : "theme-toggle-button"
      }
      onClick={onToggleTheme}
    >
      CNC
    </button>
  );
}

function getDisplayThemeClass(weatherTheme, isCncTheme) {
  if (isCncTheme) {
    return "theme-cnc";
  }

  return `theme-${weatherTheme}`;
}

function getDisplayForecastCardClass(isVisible, isCncTheme) {
  const visibilityClass = isVisible
    ? "weather-card weather-card-revealed"
    : "weather-card weather-card-hidden";

  if (isCncTheme) {
    return `${visibilityClass} weather-card-cnc`;
  }

  return visibilityClass;
}

function ForecastCard({ dailyWeather, isCncTheme }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setIsVisible(false);
  }, [dailyWeather.date]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const cardElement = cardRef.current;

    if (!cardElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          setIsVisible(true);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(cardElement);

    return () => observer.disconnect();
  }, [dailyWeather.date]);

  return (
    <div
      ref={cardRef}
      className={getDisplayForecastCardClass(isVisible, isCncTheme)}
    >
      <div className="forecast-card-icon-row">
        <span className="weatherIcon forecast-card-icon">{dailyWeather.weatherIcon}</span>
      </div>

      <div
        className={
          dailyWeather.isTodaysDate
            ? "forecast-card-date highlightDate"
            : "forecast-card-date"
        }
      >
        {dailyWeather.displayDate}
      </div>
      <div className="forecast-card-condition">{dailyWeather.condition}</div>
      <div className="forecast-card-range">
        High {formatTemperature(dailyWeather.temperature_max)}{"\u00B0C"} / Low{" "}
        {formatTemperature(dailyWeather.temperature_min)}{"\u00B0C"}
      </div>
    </div>
  );
}

function SavedCities({ savedCities, activeCity, onSelectCity, onRemoveCity }) {
  if (savedCities.length === 0) {
    return null;
  }

  return (
    <div className="saved-cities" aria-label="Saved cities">
      <div className="saved-cities-label">Saved cities</div>
      <div className="saved-cities-list">
        {savedCities.map((city) => (
          <div
            key={city}
            className={
              activeCity?.toLowerCase() === city.toLowerCase()
                ? "saved-city-chip saved-city-chip-active"
                : "saved-city-chip"
            }
          >
            <button
              type="button"
              className="saved-city-button"
              onClick={() => onSelectCity(city)}
            >
              {city}
            </button>
            <button
              type="button"
              className="saved-city-remove"
              aria-label={`Remove ${city}`}
              onClick={() => onRemoveCity(city)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemperatureTrend({ forecastDays }) {
  if (!forecastDays || forecastDays.length < 2) {
    return null;
  }

  const [isVisible, setIsVisible] = useState(false);
  const trendRef = useRef(null);

  const chartWidth = 620;
  const chartHeight = 180;
  const leftPadding = 24;
  const rightPadding = 24;
  const topPadding = 20;
  const bottomPadding = 36;
  const usableWidth = chartWidth - leftPadding - rightPadding;
  const usableHeight = chartHeight - topPadding - bottomPadding;
  const allTemperatures = forecastDays.flatMap((day) => [
    day.temperature_max,
    day.temperature_min,
  ]);
  const maxTemperature = Math.max(...allTemperatures);
  const minTemperature = Math.min(...allTemperatures);
  const temperatureRange = Math.max(maxTemperature - minTemperature, 1);

  const createPoint = (temperature, index) => {
    const x =
      leftPadding +
      (forecastDays.length === 1 ? 0 : (usableWidth / (forecastDays.length - 1)) * index);
    const y =
      topPadding +
      ((maxTemperature - temperature) / temperatureRange) * usableHeight;

    return { x, y };
  };

  const maxPoints = forecastDays.map((day, index) =>
    createPoint(day.temperature_max, index),
  );
  const minPoints = forecastDays.map((day, index) =>
    createPoint(day.temperature_min, index),
  );

  const toPolylinePoints = (points) =>
    points.map((point) => `${point.x},${point.y}`).join(" ");

  useEffect(() => {
    setIsVisible(false);
  }, [forecastDays]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const trendElement = trendRef.current;

    if (!trendElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          setIsVisible(true);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(trendElement);

    return () => observer.disconnect();
  }, [forecastDays]);

  return (
    <div
      ref={trendRef}
      className={isVisible ? "trend-card trend-card-visible" : "trend-card"}
    >
      <div className="trend-header">
        <div className="trend-title">Weekly temperature trend</div>
        <div className="trend-legend" aria-hidden="true">
          <span className="trend-legend-item trend-legend-max">Highs</span>
          <span className="trend-legend-item trend-legend-min">Lows</span>
        </div>
      </div>

      <svg
        className="trend-chart"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-label="Weekly temperature trend chart"
      >
        <polyline
          className={
            isVisible
              ? "trend-line trend-line-max trend-line-visible"
              : "trend-line trend-line-max"
          }
          fill="none"
          points={toPolylinePoints(maxPoints)}
        />
        <polyline
          className={
            isVisible
              ? "trend-line trend-line-min trend-line-visible"
              : "trend-line trend-line-min"
          }
          fill="none"
          points={toPolylinePoints(minPoints)}
        />

        {forecastDays.map((day, index) => (
          <g
            key={day.date}
            className={isVisible ? "trend-point-group trend-point-group-visible" : "trend-point-group"}
            style={{ transitionDelay: `${index * 90}ms` }}
          >
            <circle
              className="trend-point trend-point-max"
              cx={maxPoints[index].x}
              cy={maxPoints[index].y}
              r="4"
            />
            <circle
              className="trend-point trend-point-min"
              cx={minPoints[index].x}
              cy={minPoints[index].y}
              r="4"
            />
            <text
              className="trend-label"
              x={maxPoints[index].x}
              y={chartHeight - 12}
              textAnchor="middle"
            >
              {day.displayDate}
            </text>
          </g>
        ))}
      </svg>
    </div>
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
  const [savedCities, setSavedCities] = useState([]);
  const [activeSavedCity, setActiveSavedCity] = useState("");
  const [isCncTheme, setIsCncTheme] = useState(false);

  useEffect(() => {
    const storedCities = window.localStorage.getItem(SAVED_CITIES_KEY);

    if (!storedCities) {
      return;
    }

    try {
      const parsedCities = JSON.parse(storedCities);

      if (Array.isArray(parsedCities)) {
        setSavedCities(parsedCities);
      }
    } catch (error) {
      console.log("Could not parse saved cities", error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(savedCities));
  }, [savedCities]);

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

  function onSavedCityClick(city) {
    setCity(city);
    setActiveSavedCity(city);
    searchWeather(city);
  }

  function saveCity(cityName) {
    setSavedCities((currentCities) => {
      const normalizedCity = cityName.trim();

      if (normalizedCity.length === 0) {
        return currentCities;
      }

      const alreadySaved = currentCities.some(
        (savedCity) => savedCity.toLowerCase() === normalizedCity.toLowerCase(),
      );

      if (alreadySaved) {
        return currentCities;
      }

      return [normalizedCity, ...currentCities].slice(0, 5);
    });
  }

  function removeSavedCity(cityName) {
    if (activeSavedCity.toLowerCase() === cityName.toLowerCase()) {
      setActiveSavedCity("");
    }

    setSavedCities((currentCities) =>
      currentCities.filter(
        (savedCity) => savedCity.toLowerCase() !== cityName.toLowerCase(),
      ),
    );
  }

  //async - this function will deal with something that takes time
  //does not block other api calls on page, when it finishes, come back here and continue
  async function searchWeather(searchTerm = cityEntered) {
    const trimmedCity = searchTerm.trim();

    //clear old errors
    setSearchError("");
    //if no City has been entered, display error message
    if (trimmedCity.length === 0) {
      setSearchError("Please enter a city!");
      return;
    }

    //set loading state
    setIsLoading(true);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${trimmedCity}&count=1&language=en&format=json`,
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
      const locationLabel = formatLocationLabel(geoData.results[0]);
      saveCity(cityName);
      setActiveSavedCity(cityName);

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
      let formattedDate;

      //cycle through weather api data, let's stick daily into an array
      for (let i = 0; i < weatherApiData.daily.time.length; i++) {
        checkCondition = returnCondition(weatherApiData.daily.weathercode[i]);
        weatherSymbol = getWeatherIcon(weatherApiData.daily.weathercode[i]);
        todaysDate = checkDate(weatherApiData.daily.time[i]);
        formattedDate = formatForecastDate(weatherApiData.daily.time[i]);

        dailyWeather = {
          city: cityName,
          locationLabel,
          date: weatherApiData.daily.time[i],
          displayDate: formattedDate,
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
      setCity("");
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

  function formatForecastDate(apiDate) {
    if (checkDate(apiDate)) {
      return "Today";
    }

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let tomorrowYear = tomorrow.getFullYear();
    let tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
    let tomorrowDay = String(tomorrow.getDate()).padStart(2, "0");
    let formattedTomorrow =
      tomorrowYear + "-" + tomorrowMonth + "-" + tomorrowDay;

    if (formattedTomorrow === apiDate) {
      return "Tomorrow";
    }

    let parsedDate = new Date(apiDate + "T00:00:00");

    return parsedDate.toLocaleDateString("en-GB", { weekday: "long" });
  }

  function getThemeName(condition) {
    let conditionText = condition.toLowerCase();

    if (conditionText.includes("thunderstorm")) return "storm";
    if (
      conditionText.includes("snow") ||
      conditionText.includes("hail") ||
      conditionText.includes("freezing")
    ) {
      return "snow";
    }
    if (
      conditionText.includes("rain") ||
      conditionText.includes("drizzle") ||
      conditionText.includes("shower")
    ) {
      return "rain";
    }
    if (conditionText.includes("fog")) return "fog";
    if (conditionText.includes("clear")) return "sunny";
    if (conditionText.includes("cloud") || conditionText.includes("overcast")) {
      return "cloudy";
    }

    return "default";
  }

  function getIconMotionClass(themeName) {
    if (themeName === "storm") return "today-card-icon icon-motion-storm";
    if (themeName === "rain") return "today-card-icon icon-motion-rain";
    if (themeName === "snow") return "today-card-icon icon-motion-snow";
    if (themeName === "fog") return "today-card-icon icon-motion-fog";

    return "today-card-icon icon-motion-float";
  }

  function getWeatherSummary(todayWeather) {
    if (!todayWeather) {
      return "";
    }

    const conditionText = todayWeather.condition.toLowerCase();
    const maxTemp = todayWeather.temperature_max;
    const minTemp = todayWeather.temperature_min;

    if (conditionText.includes("thunderstorm")) {
      return "Stormy skies today, so it is a good day to stay flexible.";
    }

    if (
      conditionText.includes("rain") ||
      conditionText.includes("drizzle") ||
      conditionText.includes("shower")
    ) {
      return "Take an umbrella, there is a good chance you will need it.";
    }

    if (
      conditionText.includes("snow") ||
      conditionText.includes("freezing") ||
      conditionText.includes("hail")
    ) {
      return "Wrap up warm, it looks like a proper cold-weather day.";
    }

    if (conditionText.includes("fog")) {
      return "A misty start is on the cards, so give yourself a slower morning.";
    }

    if (maxTemp >= 24) {
      return "A bright, warm day is ahead, perfect for getting outside.";
    }

    if (minTemp <= 5) {
      return "A chilly start is coming, so layers will help.";
    }

    if (conditionText.includes("clear")) {
      return "Clear skies should make this a lovely day for a walk.";
    }

    return "Steady weather today, with nothing too dramatic in the forecast.";
  }

  function formatLocationLabel(locationResult) {
    const cityName = locationResult.name;
    const countryName = locationResult.country;
    const countryCode = locationResult.country_code?.toUpperCase();
    const regionName = locationResult.admin1;
    const shortCountryName = countryCode === "GB" ? "UK" : countryCode;

    if (cityName && shortCountryName) {
      return `${cityName}, ${shortCountryName}`;
    }

    if (cityName && countryName) {
      return `${cityName}, ${countryName}`;
    }

    if (cityName && regionName) {
      return `${cityName}, ${regionName}`;
    }

    return cityName;
  }

  let weatherBlock;
  let appThemeClass = "app-shell theme-default";
  if (isLoading) {
    weatherBlock = <div>Loading weather data...</div>;
  } else if (weatherData) {
    const featuredWeather =
      weatherData.find((dailyWeather) => dailyWeather.isTodaysDate) ??
      weatherData[0];
    const upcomingWeather = weatherData.filter(
      (dailyWeather) => dailyWeather.date !== featuredWeather.date,
    );
    const forecastTheme = getThemeName(featuredWeather.condition);
    const weatherSummary = isCncTheme
      ? "Command uplink stable. Field conditions uploaded and ready for briefing."
      : getWeatherSummary(featuredWeather);
    const iconMotionClass = isCncTheme
      ? "today-card-icon icon-motion-cnc"
      : getIconMotionClass(forecastTheme);
    const displayThemeName = isCncTheme ? "CNC" : featuredWeather.condition;

    appThemeClass = `app-shell ${getDisplayThemeClass(
      forecastTheme,
      isCncTheme,
    )}`;

    weatherBlock = (
      <div className="weather-container">
        <div className="weather-title">
          Weather for {weatherData[0].locationLabel ?? weatherData[0].city}
        </div>

        <div className="today-card">
          <div className="today-card-copy">
            <div className="today-card-date">{featuredWeather.displayDate}</div>
            <div className="today-card-condition">{displayThemeName}</div>
            <div className="today-card-range">
              High {formatTemperature(featuredWeather.temperature_max)}
              {"\u00B0C"} / Low {formatTemperature(featuredWeather.temperature_min)}
              {"\u00B0C"}
            </div>
            <p className="today-card-summary">{weatherSummary}</p>
          </div>
          <div className={iconMotionClass} aria-hidden="true">
            {featuredWeather.weatherIcon}
          </div>
        </div>

        <TemperatureTrend forecastDays={weatherData}></TemperatureTrend>

        {upcomingWeather.length > 0 && (
          <div className="weather-grid">
            {upcomingWeather.map((dailyWeather) => (
              <ForecastCard
                key={dailyWeather.date}
                dailyWeather={dailyWeather}
                isCncTheme={isCncTheme}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    appThemeClass = `app-shell ${getDisplayThemeClass("default", isCncTheme)}`;
    weatherBlock = <div>No Weather Data Yet</div>;
  }

  return (
    <>
      <section id="center" className={appThemeClass}>
        <div>
          <h1>Daily weather app</h1>
        </div>
        <div>
          <div className="search-row">
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
            <ThemeToggleButton
              isCncTheme={isCncTheme}
              onToggleTheme={() => setIsCncTheme((currentValue) => !currentValue)}
            ></ThemeToggleButton>
          </div>
          <SavedCities
            savedCities={savedCities}
            activeCity={activeSavedCity}
            onSelectCity={onSavedCityClick}
            onRemoveCity={removeSavedCity}
          ></SavedCities>
          {weatherBlock}
        </div>
      </section>
    </>
  );
}

export default App;
