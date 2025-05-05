import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "←" : "→"}
      </button>

      {isOpen && (
        <>
          <h2 className="sidebar-title">Main Dashboard</h2>
          <nav className="nav-links">
            <NavLink to="/opportunity" className="nav-item">Opportunities List</NavLink>
            <NavLink to="/friend-requests" className="nav-item">Connections List</NavLink>
            <NavLink to="/friend-recommendeds" className="nav-item">Rec. Connections</NavLink>
            <NavLink to="/progress" className="nav-item">Your Progress</NavLink>
            <NavLink to="/upload-resume" className="nav-item">Your Profile</NavLink>
          </nav>
        </>
      )}
    </div>
  );
};

export default Sidebar;
