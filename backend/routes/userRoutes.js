const express = require("express");
const router = express.Router();
const { deleteAccount } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// DELETE /api/users/me — delete the logged-in user's own account
router.delete("/me", protect, deleteAccount);

module.exports = router;
