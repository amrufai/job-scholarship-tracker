const db = require("../config/db");

// @desc    Create a new application
// @route   POST /api/applications
const createApplication = (req, res) => {
    const { title, organization, type, status, deadline, link, notes } = req.body;
    
    // This comes directly from our authMiddleware!
    const userId = req.user.id; 

    if (!title || !organization) {
        return res.status(400).json({ message: "Please provide at least a title and organization" });
    }

    const sql = `INSERT INTO applications 
        (user_id, title, organization, type, status, deadline, link, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [userId, title, organization, type, status, deadline, link, notes],
        (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to add application", error: err.message });
        }
        res.status(201).json({ 
            message: "Application saved successfully!", 
            applicationId: result.insertId 
        });
        }
    );
};

// @desc    Get all applications for a user
// @route   GET /api/applications
const getApplications = (req, res) => {
    const userId = req.user.id;

    db.query(
        "SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC",
        [userId],
        (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(200).json(results);
        }
    );
};

// @desc    Update an application (e.g., changing status from 'Applied' to 'Interview')
// @route   PUT /api/applications/:id
const updateApplication = (req, res) => {
  const { id } = req.params; // The ID of the application in the URL
  const userId = req.user.id; // The logged-in user
  const { status, notes } = req.body; // What we want to update

  // We check user_id so someone can't update another person's app!
    db.query(
        "UPDATE applications SET status = ?, notes = ? WHERE id = ? AND user_id = ?",
        [status, notes, id, userId],
        (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating application" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Application not found" });
        
        res.status(200).json({ message: "Application updated successfully" });
        }
    );
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
const deleteApplication = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    db.query(
        "DELETE FROM applications WHERE id = ? AND user_id = ?",
        [id, userId],
        (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting application" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Application not found" });
        
        res.status(200).json({ message: "Application deleted successfully" });
        }
    );
};

module.exports = { 
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication
};