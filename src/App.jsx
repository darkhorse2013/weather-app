import { useState } from "react";
import "./App.css";

//components, will be put into own files later on
function SearchInput({ searchError, onChangeSearch }) {
  return (
    <>
      <div>Type in a city</div>
      <div>
        <span className="incorrectValue">{searchError}</span>
      </div>
      <input id="searchCity" onChange={onChangeSearch}></input>
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

  //derived data , not stored in state but calculated each render

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
    if (cityEntered.trim().length == 0) {
      //      showSearchError = "please enter a city";
      setSearchError("Please enter a city!");
    } else {
      //get whatever is from state

      console.log("you have entered: " + cityEntered);
    }
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
            onChangeSearch={onSearchChange}
          ></SearchInput>
          <SearchButton onSearchButtonClick={onSearchClick}></SearchButton>
        </div>
      </section>
    </>
  );
}

export default App;
