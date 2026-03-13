const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// This creates the POST endpoint
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;