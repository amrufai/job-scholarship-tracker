import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

const Login = () => {
  // State to hold what the user types
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Tool to redirect the user to another page after logging in
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you hit submit
    setError(""); // Clear any previous errors
    setIsSubmitting(true);

    try {
      // 1. Send the email and password to your Node backend
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.userName || "My Account");
      
      // 3. Redirect the user back to the Dashboard
      navigate("/");
      
    } catch (err) {
      // If the backend sends an error (like "Invalid credentials"), display it
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", marginTop: "50px" }}>
      <h2>Log In to Your Tracker</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
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
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px",
            backgroundColor: isSubmitting ? "#4d4d6e" : "#1a1a2e",
            color: "white",
            borderRadius: "5px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            border: "none",
          }}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
