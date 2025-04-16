import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import "./App.css";
import { SearchBar } from "./assets/components/SearchBar";
import JobListingDashboard from "./assets/components/JobListingDashboard";
import AdvancedSearch from "./assets/components/AdvancedSearch";
import UploadResume from "./assets/components/UploadResume";
import Login from "./assets/components/Login";
import Logout from "./assets/components/Logout"
import Signup from "./assets/components/Signup";
import FriendRequest from "./assets/components/FriendRequest";
import Resume from './assets/components/Resume'

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [filter, setFilter] = useState({});
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null)
  const param = useParams()



  useEffect(() => {
    const userLoggedin = window.localStorage.getItem('token')
    if (userLoggedin) {
      setUser(userLoggedin)
    }
  }, [])

  const handleSearch = (filterData) => {
    setFilter(filterData);
    setSidebarVisible(false);
  };
  
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/">Job Listing</Link>
          <Link to="/friend-requests">Friend Requests</Link>
          <Link to="/upload-resume">Upload Resume</Link>
          {user ? <Link to='/logout'>Logout</Link> : <Link to='/login'>Login</Link>}
        </nav>

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
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/logout" element={user ? <Logout /> : <Navigate to="/login" />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/friend-requests" element={<FriendRequest />} />
          <Route path="/resumes/:id" element={<Resume />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;