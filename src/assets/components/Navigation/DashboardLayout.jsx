import React from "react";
import { Outlet } from "react-router-dom"; // ✅ Required
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet /> {/* ✅ This renders nested route content */}
      </div>
    </div>
  );
};

export default DashboardLayout;
