import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // State to hold what the user types
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Tool to redirect the user to another page after logging in
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you hit submit
    setError(""); // Clear any previous errors

    try {
      // 1. Send the email and password to your Node backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // 2. If successful, save the token and name to the browser's local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.name); // ADD THIS LINE!
      
      // 3. Redirect the user back to the Dashboard
      navigate("/");
      
    } catch (err) {
      // If the backend sends an error (like "Invalid credentials"), display it
      setError(err.response?.data?.message || "Something went wrong.");
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
        <button type="submit" style={{ padding: "10px", backgroundColor: "#1a1a2e", color: "white", borderRadius: "5px", cursor: "pointer", border: "none" }}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;