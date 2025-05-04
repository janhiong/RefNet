import React from "react";
import { Outlet } from "react-router-dom"; // ✅ Required
import NavBar from "./NavigationBar";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
