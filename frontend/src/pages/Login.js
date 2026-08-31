import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.userName || "My Account");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setIsResetting(true);

    try {
      const targetEmail = forgotEmail || email;
      const response = await api.post("/api/auth/forgot-password", {
        email: targetEmail,
      });

      setResetMessage(
        response.data.resetToken
          ? `${response.data.message} Reset code: ${response.data.resetToken}`
          : response.data.message
      );
      if (response.data.resetToken) {
        setResetCode(response.data.resetToken);
      }
    } catch (err) {
      setResetError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");

    if (!newPassword || !confirmPassword) {
      setResetError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("The new passwords do not match.");
      return;
    }

    setIsResetting(true);

    try {
      const targetEmail = forgotEmail || email;
      const response = await api.post("/api/auth/reset-password", {
        email: targetEmail,
        token: resetCode,
        newPassword,
      });

      setResetMessage(response.data.message);
      setNewPassword("");
      setConfirmPassword("");
      setResetCode("");
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (err) {
      setResetError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "24px auto" }}>
      <div className="card">
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>Log In to Your Tracker</h2>
        {error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>}

        {!showForgotPassword ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              className="input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setResetError("");
                  setResetMessage("");
                  setForgotEmail(email);
                }}
                style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: 0 }}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-accent">
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ margin: 0 }}>Reset Your Password</h3>
            {resetMessage && <p style={{ color: "var(--success)", margin: 0 }}>{resetMessage}</p>}
            {resetError && <p style={{ color: "#ff6b6b", margin: 0 }}>{resetError}</p>}

            <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                className="input"
                type="email"
                placeholder="Email Address"
                value={forgotEmail || email}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-accent" disabled={isResetting}>{isResetting ? "Sending..." : "Send reset code"}</button>
            </form>

            <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input className="input" type="text" placeholder="Reset code" value={resetCode} onChange={(e) => setResetCode(e.target.value)} required />
              <input className="input" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <input className="input" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="submit" className="btn-accent" disabled={isResetting}>{isResetting ? "Resetting..." : "Reset password"}</button>
            </form>

            <button type="button" onClick={() => {
              setShowForgotPassword(false);
              setForgotEmail("");
              setResetCode("");
              setNewPassword("");
              setConfirmPassword("");
              setResetMessage("");
              setResetError("");
            }} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", textAlign: "left", padding: 0 }}>
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
