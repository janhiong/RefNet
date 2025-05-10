import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationBar.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <h2 className="navbar-title">Main Dashboard</h2>
      <nav className="nav-links">
        <NavLink to="/opportunity" className="nav-item">
          <span></span> Opportunities List
        </NavLink>
        <NavLink to="/friend-requests" className="nav-item">
          <span></span> Connections List
        </NavLink>
        <NavLink to="/friend-recommendeds" className="nav-item">
          <span></span> Rec. Connections
        </NavLink>
        <NavLink to="/upload-resume" className="nav-item">
          <span></span> Your Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default NavBar;
