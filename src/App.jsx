import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { SearchBar } from "./assets/components/SearchBar";
import AdvancedSearch from "./assets/components/AdvancedSearch";
import UploadResume from "./assets/components/UploadResume";
import Login from "./assets/components/Login";
import Signup from "./assets/components/Signup";
import AppContainer from "./AppContainer"; 
import FriendRequest from "./assets/components/FriendRequest";
import JobListingDashboard from "./assets/components/JobListingDashboard";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [filter, setFilter] = useState({});

  // This function receives filter data from the AdvancedSearch component.
  const handleSearch = (filterData) => {
    setFilter(filterData);
    setSidebarVisible(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Global Navigation Bar */}
        <nav className="navbar">
          <Link to="/">Job Listing</Link>
          <Link to="/friend-requests">Friend Requests</Link>
          <Link to="/upload-resume">Upload Resume</Link>
          <Link to="/login">Login</Link>
        </nav>

        {/* Define routes for the application */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Container for search and filter components */}
                <div className="search-and-filters">
                  {/* Filter Button */}
                  <SearchBar setSidebarVisible={setSidebarVisible} />

                  {/* Conditionally render the filter sidebar */}
                  {sidebarVisible && (
                    <div className="filter-sidebar">
                      <AdvancedSearch onSearch={handleSearch} />
                    </div>
                  )}
                </div>

                {/* Job Listings */}
                <JobListingDashboard filter={filter} />
              </>
            }
          />
          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<AppContainer />} />
          <Route path="/friend-requests" element={<FriendRequest />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
