import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    if (!value) {
      setResults([]); // Clear results if input is empty
      return;
    }

    fetch(`http://localhost:4000/api/search-users?query=${value}`)
      .then((response) => response.json())
      .then((json) => {
        setResults(json); // Update search results
      })
      .catch((error) => console.error("Error fetching search results:", error));
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value); // Fetch search results
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Search for people..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
