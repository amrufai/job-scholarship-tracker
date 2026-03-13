const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

  // 1. Check if the user provided all required fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

  // 2. Check if the email is already in the database
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
        return res.status(500).json({ message: "Database error" });
    }
    
    if (results.length > 0) {
        return res.status(400).json({ message: "User already exists with this email" });
    }

    // 3. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save the new user to the database
    db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
            if (err) {
            return res.status(500).json({ message: "Error registering user" });
            }
            res.status(201).json({ 
            message: "User registered successfully!", 
            userId: result.insertId 
            });
        }
        );
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide an email and password" });
  }

  // 2. Find the user in the database by email
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    
    // If no user is found with that email
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = results[0]; // Grab the specific user from the results array

    // 3. Compare the typed password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Generate the JWT (Digital ID Card) valid for 30 days
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // 5. Send back the success message and the token
    res.status(200).json({
      message: "Login successful!",
      userId: user.id,
      name: user.name,
      token: token,
    });
  });
};

module.exports = { registerUser, loginUser };