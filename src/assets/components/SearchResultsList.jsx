import React from "react";
import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results }) => {
  return (
    <div className="results-list">
      {results.length === 0 ? (
        <p className="no-results">No users found</p>
      ) : (
        results.map((user) => <SearchResult result={user.name} key={user._id} />)
      )}
    </div>
  );
};
