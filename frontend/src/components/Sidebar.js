import React from "react";
// NEW: Import useLocation
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Gets the current URL path
  
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "My Account";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  // NEW: Helper function to apply active styles
  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      display: "block",
      padding: "10px",
      marginBottom: "5px",
      borderRadius: "5px",
      textDecoration: "none",
      color: isActive ? "white" : "#1a1a2e", // White text if active
      backgroundColor: isActive ? "#1a1a2e" : "transparent", // Dark bg if active
      fontWeight: isActive ? "bold" : "normal"
    };
  };

  return (
    <div className="sidebar" style={{ display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      <h2 style={{ marginBottom: "20px" }}>SS Tracker</h2>
      
      <Link to="/add-application" style={{ display: "block", backgroundColor: "#1a1a2e", color: "white", textAlign: "center", padding: "10px", marginBottom: "20px", borderRadius: "8px", fontWeight: "bold", textDecoration: "none" }}>
        + Add New
      </Link>

      {/* NEW: Apply the getLinkStyle function to our routes */}
      <Link to="/" style={getLinkStyle("/")}>Dashboard</Link>
      <Link to="/jobs" style={getLinkStyle("/jobs")}>Jobs</Link>
      <Link to="/scholarships" style={getLinkStyle("/scholarships")}>Scholarships</Link>
      
      {/* Bottom Section */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {token ? (
          <>
            <div style={{ padding: "10px", backgroundColor: "#e0e0e0", borderRadius: "8px", textAlign: "center", fontWeight: "bold" }}>
              👤 {userName}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
              <Link to="/settings" style={{ color: "var(--text)", textAlign: "center", textDecoration: "none", fontSize: "0.9em" }}>
                ⚙️ Settings
              </Link>
              <button onClick={handleLogout} style={{ padding: "8px 10px", backgroundColor: "#ff4d4d", color: "white", borderRadius: "6px", cursor: "pointer", border: "none", fontWeight: "600" }}>
                Logout
              </button>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
              <ThemeToggle />
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-accent" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>Login</Link>
            <Link to="/signup" style={{ backgroundColor: "transparent", color: "var(--text)", border: "1px solid var(--border)", display: "block", textAlign: "center", padding: "10px", borderRadius: "5px", textDecoration: "none" }}>Sign Up</Link>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
              <ThemeToggle />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;