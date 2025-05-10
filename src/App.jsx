import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

// Layouts and Components
import DashboardLayout from "./assets/components/Navigation/DashboardLayout";
import Login from "./assets/components/Credentials/Login";
import Signup from "./assets/components/Credentials/Signup";
import FriendRequest from "./assets/components/Connections/FriendRequest";
import UploadResume from "./assets/components/Profiles/UploadResume.jsx";
import UserList from "./assets/components/Connections/UserList.jsx";
import JobListingPage from "./assets/components/Opportunities/JobListingPage.jsx";


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
                <h1>ReffNet</h1>
                <p>Subscribe to receive all internships posted within the last 24 hours.</p>
                <div className="buttons">
                  <Link to="/login"><button className="signin-btn">Sign In</button></Link>
                  <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
                </div>
              </header>

              <section className="features">
                <div className="feature-card"><div className="emoji">🌐</div><h3>Listing Loop</h3><p>Receive the latest jobs posted within the last 24 hours</p></div>
                <div className="feature-card"><div className="emoji">📅</div><h3>Credidble Connections</h3><p>Connect with professionals and leverage their networks</p></div>
                <div className="feature-card"><div className="emoji">🔍</div><h3>Profile Power</h3><p>Boost your credibility by uploading your resume and profile</p></div>
              </section>
            </div>
          }
        />

        {/* Credentials */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard layout wrapper */}
        <Route element={<DashboardLayout />}>
          <Route path="/opportunity" element={<JobListingPage />} />
          <Route path="/friend-requests" element={<FriendRequest />} />
          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/friend-recommendeds" element={<UserList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
