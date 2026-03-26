import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  
  // Check if the user is logged in by looking for the token
  const token = localStorage.getItem("token");
  // Grab the name, or default to "My Account" if it's missing
  const userName = localStorage.getItem("userName") || "My Account";

  const handleLogout = () => {
    // Clear the ID card and name from the browser
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    // Send them back to the login page
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2>SS Tracker</h2>

      <Link to="/add-application" style={{ backgroundColor: "#1a1a2e", color: "white", textAlign: "center", marginBottom: "20px", borderRadius: "8px", fontWeight: "bold" }}>
        + Add New
      </Link>
      
      <Link to="/">Dashboard</Link>
      <Link to="/jobs">Jobs</Link>
      <Link to="/scholarships">Scholarships</Link>
      
      {/* Bottom Section */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        
        {/* IF TOKEN EXISTS: Show User Info & Logout */}
        {token ? (
          <>
            <div style={{ padding: "10px", backgroundColor: "#e0e0e0", borderRadius: "8px", textAlign: "center", fontWeight: "bold" }}>
              👤 {userName}
            </div>
            <Link to="/settings" style={{ color: "#333", textAlign: "center", textDecoration: "none", fontSize: "0.9em" }}>
              ⚙️ Settings
            </Link>
            <button onClick={handleLogout} style={{ padding: "10px", backgroundColor: "#ff4d4d", color: "white", borderRadius: "5px", cursor: "pointer", border: "none" }}>
              Logout
            </button>
          </>
        ) : (
          /* IF NO TOKEN: Show Login & Sign Up */
          <>
            <Link to="/login" style={{ backgroundColor: "#1a1a2e", color: "white", display: "block", textAlign: "center", padding: "10px", borderRadius: "5px", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/signup" style={{ backgroundColor: "transparent", color: "#1a1a2e", border: "1px solid #1a1a2e", display: "block", textAlign: "center", padding: "10px", borderRadius: "5px", textDecoration: "none" }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;