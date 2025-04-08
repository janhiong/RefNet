import { useState } from "react";
import "./App.css";
import AdvancedSearch from "./assets/components/AdvancedSearch";

const AppContainer = () => {
  const [results, setResults] = useState([]);

  return (
    <div className="App">
      <button onClick={() => (window.location.href = "/login")} className="logout-button">
        Logout
      </button>

      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
      </div>

      <AdvancedSearch onSearch={() => {}} />

      <div className="results-container">
        {results.length > 0 && <SearchResultsList results={results} />}
      </div>
    </div>
  );
};

export default AppContainer;
