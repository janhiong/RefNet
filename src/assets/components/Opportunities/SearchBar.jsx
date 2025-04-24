import { useState } from "react";
import { FaFilter } from "react-icons/fa"; // Using a filter icon instead of search
import "./SearchBar.css";

export const SearchBar = ({ setSidebarVisible }) => {
  // Toggle the sidebar visibility
  const handleFilterClick = () => {
    setSidebarVisible((prevState) => !prevState); // Toggle sidebar visibility
  };

  return (
    <div className="filter-button-container">
      <button className="filter-button" onClick={handleFilterClick}>
        <FaFilter id="filter-icon" />
        Filter
      </button>
    </div>
  );
};
