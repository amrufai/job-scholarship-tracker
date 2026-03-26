import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load the current user's name when the page opens
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (storedName) {
      setUserName(storedName);
    }
  }, [navigate]);

  const handleSave = (e) => {
    e.preventDefault();
    // Save the new name to local storage
    localStorage.setItem("userName", userName);
    setMessage("Profile updated successfully!");
    
    // Quick trick to refresh the page so the Sidebar catches the new name instantly
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <h2 style={{ marginBottom: "20px", color: "#1a1a2e" }}>Account Settings</h2>
      
      {message && <p style={{ color: "#155724", backgroundColor: "#d4edda", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontWeight: "bold" }}>{message}</p>}
      
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={{ fontSize: "0.85em", fontWeight: "bold", marginBottom: "5px", display: "block", color: "#555" }}>Display Name</label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }} 
          />
        </div>
        
        <button type="submit" style={{ padding: "12px", backgroundColor: "#1a1a2e", color: "white", borderRadius: "5px", cursor: "pointer", border: "none", fontWeight: "bold", marginTop: "10px" }}>
          Save Changes
        </button>
      </form>
      
      {/* The Classic SaaS "Danger Zone" */}
      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
        <h3 style={{ color: "#d9534f", fontSize: "1.2em", marginBottom: "10px" }}>Danger Zone</h3>
        <p style={{ fontSize: "0.9em", color: "#555", marginBottom: "15px" }}>Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={() => alert("Backend delete route not wired up yet, but this is where it goes!")} style={{ padding: "10px 15px", backgroundColor: "transparent", color: "#d9534f", border: "1px solid #d9534f", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;