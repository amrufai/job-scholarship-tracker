import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Almansur's Tracker</h2>
      {/* These links will control what shows on the right side */}
      <Link to="/">Dashboard</Link>
      <Link to="/jobs">Jobs</Link>
      <Link to="/scholarships">Scholarships</Link>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/login" style={{ backgroundColor: "#1a1a2e", color: "white", display: "block", textAlign: "center" }}>
          Login
        </Link>
        <Link to="/signup" style={{ backgroundColor: "transparent", color: "#1a1a2e", border: "1px solid #1a1a2e", display: "block", textAlign: "center" }}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;