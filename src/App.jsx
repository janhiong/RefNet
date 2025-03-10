import { useState } from "react";
import "./App.css";
import { SearchBar } from "./assets/components/SearchBar";
import { SearchResultsList } from "./assets/components/SearchResultsList";
import AdvancedSearch from "./assets/components/AdvancedSearch";

function App() {
  const [results, setResults] = useState([]); // Initialize results as empty

  return (
    <div className="App">
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
      </div>

      {/* Advanced Search positioned first */}
      
      <>
        <AdvancedSearch onSearch={() => {}} />
      </>

      {/* Results Container - moved BELOW Advanced Search */}
      <div className="results-container">
        {results.length > 0 && <SearchResultsList results={results} />}
      </div>
    </div>
  );
}

export default App;
