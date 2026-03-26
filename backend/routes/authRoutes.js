const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Use the exact names here too
router.post("/register", register);
router.post("/login", login);

module.exports = router;