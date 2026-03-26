const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const register = async (req, res) => {
  // NEW: Grab displayName from the frontend
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).json({ message: "Please provide a name, email, and password." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // NEW: Insert display_name into the database
    db.query(
      "INSERT INTO users (display_name, email, password) VALUES (?, ?, ?)",
      [displayName, email, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already in use." });
          }
          return res.status(500).json({ message: "Database error during registration." });
        }
        res.status(201).json({ message: "User registered successfully." });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password." });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials." });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // NEW: Send the display_name back to the frontend so it shows in the sidebar!
    res.json({ 
      token, 
      userName: user.display_name || "My Account" 
    });
  });
};

module.exports = { register, login };