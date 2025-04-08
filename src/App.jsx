import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import AdvancedSearch from "./assets/components/AdvancedSearch";  // Filter Component
import UploadResume from "./assets/components/UploadResume";
import Login from "./assets/components/Login";
import Logout from "./assets/components/Logout";
import Signup from "./assets/components/Signup";
import AppContainer from "./AppContainer"; // Import AppContainer
import FriendRequest from "./assets/components/FriendRequest";

function App() {
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);  // Manage sidebar visibility

  useEffect(() => {
    setUser(localStorage.getItem('user'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);  // Update user state after logout
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <Link to="/">Job Listing</Link>
          <Link to="/friend-requests">Connections</Link>
          <Link to="/upload-resume">Upload Resume</Link>
          {user ? (
            <>
              <Link to='/logout' onClick={handleLogout}>Logout</Link>
            </>
          ) : (
            <>
              <Link to='/login'>Login</Link>
            </>
          )}
        </nav>

        <Routes>
          {/* Home Page */}
          <Route path="/" element={
            <>
              {/* Filter Button centered on the page */}
              <button className="filter-button" onClick={() => setSidebarVisible(!sidebarVisible)}>
                Filter
              </button>

              {/* Sidebar for filters */}
              {sidebarVisible && (
                <div className="sidebar">
                  <div className="filter-content">
                    <h2>Filters</h2>
                    {/* Place all your filter components here */}
                    <AdvancedSearch onSearch={() => {}} />
                  </div>
                </div>
              )}
            </>
          } />

          {/* Other Routes */}
          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/logout" element={user ? <Logout /> : <Navigate to="/login" />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/friend-requests" element={<FriendRequest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
