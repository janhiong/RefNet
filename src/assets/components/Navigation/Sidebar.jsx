import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Main Dashboard</h2>
      <nav className="nav-links">
        <NavLink to="/opportunity" className="nav-item">
          <span></span> Opportunities List
        </NavLink>
        <NavLink to="/friend-requests" className="nav-item">
          <span></span> Connections List
        </NavLink>
        <NavLink to="/progress" className="nav-item">
          <span></span> Your Progress
        </NavLink>
        <NavLink to="/upload-resume" className="nav-item">
          <span></span> Your Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
