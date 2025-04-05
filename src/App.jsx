import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { SearchBar } from "./assets/components/SearchBar";
import { SearchResultsList } from "./assets/components/SearchResultsList";
import AdvancedSearch from "./assets/components/AdvancedSearch";
import UploadResume from "./assets/components/UploadResume";
import Login from "./assets/components/Login";
import Logout from "./assets/components/Logout"
import Signup from "./assets/components/Signup";
import AppContainer from "./AppContainer"; // Import AppContainer
import FriendRequest from "./assets/components/FriendRequest";


function App() {
  const [results, setResults] = useState([]);
  const [userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    setUserEmail(localStorage.getItem('email'))
  })
  
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/friend-requests">Connections</Link>
          <Link to="/upload-resume">Upload Resume</Link>
          {userEmail ? <Link to='/logout'>Logout</Link> : <Link to='/login'>Login</Link>}
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              <div className="search-bar-container">
                <SearchBar setResults={setResults} />
              </div>
              <AdvancedSearch onSearch={() => {}} />
              <div className="results-container">
                {results.length > 0 && <SearchResultsList results={results} />}
              </div>
            </>
          } />
          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/login" element={userEmail ? <Navigate to="/" /> : <Login />} />
          <Route path="/logout" element={userEmail ? <Logout /> : <Navigate to="/login" />} />
          <Route path="/signup" element={userEmail ? <Navigate to="/" /> : <Signup />} />
          <Route path="/friend-requests" element={<FriendRequest />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
