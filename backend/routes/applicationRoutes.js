const express = require("express");
const router = express.Router();
const { createApplication,
    getApplications,
    updateApplication,
    deleteApplication
    } = require("../controllers/applicationController");


const { protect } = require("../middleware/authMiddleware");

// When someone posts here, run 'protect' first. If it passes, run 'createApplication'.
router.post("/", protect, createApplication);
router.get("/", protect, getApplications);
router.put("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

module.exports = router;