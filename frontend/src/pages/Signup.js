import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

const Signup = () => {
  // NEW: Add state for the display name
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // NEW: Include displayName in the payload
      await api.post("/api/auth/register", {
        displayName,
        email,
        password,
      });
      // Redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "30px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1a1a2e" }}>Create an Account</h2>
      
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* NEW: Display Name Input */}
        <input 
          type="text" 
          placeholder="Display Name (e.g., Almansur)" 
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)} 
          required 
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        
        <button type="submit" style={{ padding: "12px", backgroundColor: "#1a1a2e", color: "white", borderRadius: "5px", cursor: "pointer", border: "none", fontWeight: "bold" }}>
          Sign Up
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9em" }}>
        Already have an account? <Link to="/login" style={{ color: "#0066cc", textDecoration: "none", fontWeight: "bold" }}>Log in here</Link>.
      </p>
    </div>
  );
};

export default Signup;