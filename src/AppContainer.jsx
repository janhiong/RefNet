import { useState } from "react";
import "./App.css";
import { SearchBar } from "./assets/components/SearchBar";
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

    </div>
  );
};

export default AppContainer;