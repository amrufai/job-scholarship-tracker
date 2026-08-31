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

  // Helper to return nav-link class with active marker
  const getLinkClass = (path) => (location.pathname === path ? "nav-link active" : "nav-link");

  return (
    <div className="sidebar" style={{ display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      <h2 style={{ marginBottom: "20px" }}>SS Tracker</h2>
      
      <Link to="/add-application" className="btn-accent" style={{ display: "block", textAlign: "center", padding: "10px", marginBottom: "20px", borderRadius: "8px", fontWeight: "bold", textDecoration: "none" }}>
        + Add New
      </Link>

      {/* Use nav-link classes for clearer contrast */}
      <Link to="/" className={getLinkClass("/")}>Dashboard</Link>
      <Link to="/jobs" className={getLinkClass("/jobs")}>Jobs</Link>
      <Link to="/scholarships" className={getLinkClass("/scholarships")}>Scholarships</Link>
      
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