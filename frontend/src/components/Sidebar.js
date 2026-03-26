import React from "react";
// NEW: Import useLocation
import { Link, useNavigate, useLocation } from "react-router-dom";

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
            <Link to="/settings" style={{ color: "#333", textAlign: "center", textDecoration: "none", fontSize: "0.9em" }}>
              ⚙️ Settings
            </Link>
            <button onClick={handleLogout} style={{ padding: "10px", backgroundColor: "#ff4d4d", color: "white", borderRadius: "5px", cursor: "pointer", border: "none", fontWeight: "bold" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ backgroundColor: "#1a1a2e", color: "white", display: "block", textAlign: "center", padding: "10px", borderRadius: "5px", textDecoration: "none" }}>Login</Link>
            <Link to="/signup" style={{ backgroundColor: "transparent", color: "#1a1a2e", border: "1px solid #1a1a2e", display: "block", textAlign: "center", padding: "10px", borderRadius: "5px", textDecoration: "none" }}>Sign Up</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;