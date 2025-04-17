import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import "./App.css";

// Components
import { SearchBar } from "./assets/components/SearchBar";
import JobListingDashboard from "./assets/components/JobListingDashboard";
import AdvancedSearch from "./assets/components/AdvancedSearch";
import UploadResume from "./assets/components/UploadResume";
import Login from "./assets/components/Login";
import Logout from "./assets/components/Logout";
import Signup from "./assets/components/Signup";
import FriendRequest from "./assets/components/FriendRequest";
import Resume from './assets/components/Resume'

function App() {
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null)
  const param = useParams()



  useEffect(() => {
    const userLoggedin = window.localStorage.getItem('token')
    if (userLoggedin) {
      setUser(userLoggedin)
    }
  }, [])

  const [sidebarVisible, setSidebarVisible] = useState(false); // toggle sidebar
  const [filter, setFilter] = useState({}); // active filter object

  // Handle advanced filter form submission
  const handleSearch = (filterData) => {
    setFilter(filterData);
    setSidebarVisible(false); // close sidebar after applying
  };

  return (
    <Router>
      <div className="App">
        {/* 🔗 Top Navigation */}
        <nav className="navbar">
          <Link to="/">Job Listing</Link>
          <Link to="/friend-requests">Friend Requests</Link>
          <Link to="/upload-resume">Upload Resume</Link>
          {user ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
        </nav>

        {/* 📍 Main Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* 🔍 Search Bar & Advanced Filter Toggle */}
                <div className="search-and-filters">
                  <SearchBar setSidebarVisible={setSidebarVisible} />

                  {sidebarVisible && (
                    <div className="filter-sidebar">
                      <AdvancedSearch onSearch={handleSearch} />
                    </div>
                  )}
                </div>

                {/* 🧠 Job List, filtered by user input */}
                <JobListingDashboard filter={filter} />
              </>
            }
          />

          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/friend-requests" element={<FriendRequest />} />

          {/* 🔐 Auth Routes */}
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
