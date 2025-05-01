import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

// Layouts and Components
import DashboardLayout from "./assets/components/Navigation/DashboardLayout";
import Login from "./assets/components/Credentials/Login";
import Signup from "./assets/components/Credentials/Signup";
import FriendRequest from "./assets/components/Connections/FriendRequest";
import UploadResume from "./assets/components/Profiles/UploadResume.jsx";
import FriendRecommended from "./assets/components/Connections/FriendRecommended.jsx";


const Page = ({ title }) => <h1>{title}</h1>;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userLoggedin = window.localStorage.getItem("token");
    if (userLoggedin) {
      setUser(userLoggedin);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public homepage */}
        <Route
          path="/"
          element={
            <div className="App">
              <header className="header">
                <h1>JobsDreamer</h1>
                <p>Subscribe to receive all internships posted within the last 24 hours directly to your email.</p>
                <div className="buttons">
                  <Link to="/login"><button className="signin-btn">Sign In</button></Link>
                  <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
                </div>
              </header>

              <section className="features">
                <div className="feature-card"><div className="emoji">📅</div><h3>Daily Updates</h3><p>Receive the latest internships posted within the last 24 hours</p></div>
                <div className="feature-card"><div className="emoji">🌐</div><h3>Never Miss Out</h3><p>Get every internship posted online</p></div>
                <div className="feature-card"><div className="emoji">🔍</div><h3>Curated Listings</h3><p>Positions across all industries and fields tailored to your interests</p></div>
                <div className="feature-card"><div className="emoji">💸</div><h3>Free, Forever</h3><p>Completely free for all students</p></div>
              </section>
            </div>
          }
        />

        {/* Credentials */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard layout wrapper */}
        <Route element={<DashboardLayout />}>
          <Route path="/opportunity" element={<Page title="Dashboard" />} />
          <Route path="/friend-requests" element={<FriendRequest />} />
          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/friend-recommendeds" element={<FriendRecommended />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
