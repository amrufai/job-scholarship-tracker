const express = require("express");
const cors = require("cors");

require("dotenv").config(); // Allows server.js to read the .env file
const db = require("./config/db"); // Runs the database connection

// Initialize the Express app
const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "https://job-scholarship-tracker.vercel.app"],
    credentials: true
})); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Allows your backend to understand JSON data

// A simple test route
app.get("/", (req, res) => {
    res.send("Your Scholarship Tracker API is running!");
});

// Import Routes
const authRoutes = require("./routes/authRoutes");

// Use Routes
app.use("/api/auth", authRoutes);

// Import the new application routes
const applicationRoutes = require("./routes/applicationRoutes");

// Use the routes
app.use("/api/applications", applicationRoutes);

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});