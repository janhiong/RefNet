import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { SearchBar } from "./assets/components/SearchBar";
import { SearchResultsList } from "./assets/components/SearchResultsList";
import AdvancedSearch from "./assets/components/AdvancedSearch";
import UploadResume from "./assets/components/UploadResume";
import Login from "./assets/components/Login";
import Signup from "./assets/components/Signup";
import AppContainer from "./AppContainer"; // Import AppContainer
import FriendRequest from "./assets/components/FriendRequest";


function App() {
  const [results, setResults] = useState([]);

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/friend-requests">Friend Requests</Link>
          <Link to="/upload-resume">Upload Resume</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/friend-requests" element={<FriendRequest />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
