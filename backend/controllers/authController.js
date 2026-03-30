const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
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

module.exports = { register, login };