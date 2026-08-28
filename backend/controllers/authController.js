const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(toEmail, resetToken) {
  await resend.emails.send({
    from: process.env.RESET_EMAIL_FROM, // e.g. "TrackerHub <onboarding@resend.dev>"
    to: toEmail,
    subject: "Your TrackerHub password reset code",
    text: `Your password reset code is: ${resetToken}\n\nThis code expires in 15 minutes. If you didn't request this, you can ignore this email.`,
  });
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function buildResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

const register = async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).json({ message: "Please provide a name, email, and password." });
  }

  const emailNorm = normalizeEmail(email);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (display_name, email, password) VALUES (?, ?, ?)",
      [String(displayName).trim(), emailNorm, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already in use." });
    }
    console.error("register:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password." });
  }

  const emailNorm = normalizeEmail(email);

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE LOWER(TRIM(email)) = ?",
      [emailNorm]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      userName: user.display_name || "My Account",
    });
  } catch (err) {
    console.error("login:", err.message);
    res.status(500).json({ message: "Database error." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide your email address." });
  }

  const emailNorm = normalizeEmail(email);

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE LOWER(TRIM(email)) = ?",
      [emailNorm]
    );

    if (results.length === 0) {
      return res.json({
        message: "If that email is registered, a password reset link has been prepared.",
      });
    }

    const resetToken = buildResetToken();
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      "UPDATE users SET reset_token = ?, reset_expires_at = ? WHERE id = ?",
      [resetTokenHash, expiresAt, results[0].id]
    );

    try {
      await sendResetEmail(results[0].email, resetToken);
    } catch (emailErr) {
      console.error("sendResetEmail:", emailErr.message);
    }

    const response = {
      message: "If that email is registered, a reset code has been sent to it.",
    };

    if (process.env.NODE_ENV !== "production") {
      response.resetToken = resetToken;
    }

    return res.json(response);
  } catch (err) {
    console.error("forgotPassword:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: "Please provide your email, reset code, and a new password." });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long." });
  }

  const emailNorm = normalizeEmail(email);

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE LOWER(TRIM(email)) = ?",
      [emailNorm]
    );

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid reset request." });
    }

    const user = results[0];

    if (!user.reset_token || !user.reset_expires_at) {
      return res.status(400).json({ message: "No valid reset request was found for this account." });
    }

    const expiresAt = new Date(user.reset_expires_at);
    const isExpired = expiresAt <= new Date();

    if (isExpired) {
      await db.query(
        "UPDATE users SET reset_token = NULL, reset_expires_at = NULL WHERE id = ?",
        [user.id]
      );
      return res.status(400).json({ message: "This password reset code has expired. Please request a new one." });
    }

    const isValidToken = await bcrypt.compare(token, user.reset_token);

    if (!isValidToken) {
      return res.status(400).json({ message: "The reset code is invalid." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    return res.json({ message: "Your password has been reset successfully." });
  } catch (err) {
    console.error("resetPassword:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };