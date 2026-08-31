import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

const Signup = () => {
  // NEW: Add state for the display name
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "36px auto" }}>
      <div className="card">
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>Create an Account</h2>

        {error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="input" type="text" placeholder="Display Name (e.g., John)" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />

          <input className="input" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" disabled={isSubmitting} className="btn-accent">{isSubmitting ? "Signing up..." : "Sign Up"}</button>
        </form>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.95rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "600" }}>Log in here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
