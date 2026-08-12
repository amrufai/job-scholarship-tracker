import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../api/client";

const Settings = () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "This will permanently delete your account and every application you've saved. This cannot be undone. Continue?"
    );
    if (!confirmed) return;

    setError("");
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      await api.delete("/api/users/me", {
        headers: authHeaders(token),
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <h2 style={{ marginBottom: "20px", color: "#1a1a2e" }}>Account Settings</h2>
      
      {message && <p style={{ color: "#155724", backgroundColor: "#d4edda", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontWeight: "bold" }}>{message}</p>}
      {error && <p style={{ color: "#721c24", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontWeight: "bold" }}>{error}</p>}
      
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
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          style={{
            padding: "10px 15px",
            backgroundColor: isDeleting ? "#f5c6cb" : "transparent",
            color: "#d9534f",
            border: "1px solid #d9534f",
            borderRadius: "5px",
            cursor: isDeleting ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
