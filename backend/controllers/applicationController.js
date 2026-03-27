const db = require("../config/db");

function parseApplicationId(raw) {
  const id = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(id) || id < 1) return null;
  return id;
}

// @desc    Create a new application
// @route   POST /api/applications
const createApplication = (req, res) => {
  // 1. Add date_applied here
    const { title, organization, type, status, date_applied, deadline, link, notes } = req.body;
    const userId = req.user.id; 

    if (!title || !organization) {
        return res.status(400).json({ message: "Please provide at least a title and organization" });
    }

    // 2. Add date_applied to the SQL query
    const sql = `INSERT INTO applications 
        (user_id, title, organization, type, status, date_applied, deadline, link, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [userId, title, organization, type, status, date_applied, deadline, link, notes],
        (err, result) => {
        if (err) {
          console.error("createApplication:", err.message);
          return res.status(500).json({ message: "Failed to add application" });
        }
        res.status(201).json({ message: "Application saved successfully!", applicationId: result.insertId });
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
        if (err) {
          console.error("getApplications:", err.message);
          return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json(results);
        }
    );
};

// @desc    Update an application (e.g., changing status from 'Applied' to 'Interview')
// @route   PUT /api/applications/:id
const updateApplication = (req, res) => {
    const id = parseApplicationId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid application id" });
    }
    const userId = req.user.id;
    // 3. Add date_applied here
    const { title, organization, type, status, date_applied, deadline, link, notes } = req.body; 

    // 4. Add date_applied to the UPDATE query
    db.query(
        "UPDATE applications SET title=?, organization=?, type=?, status=?, date_applied=?, deadline=?, link=?, notes=? WHERE id=? AND user_id=?",
        [title, organization, type, status, date_applied, deadline, link, notes, id, userId],
        (err, result) => {
        if (err) {
          console.error("updateApplication:", err.message);
          return res.status(500).json({ message: "Error updating application" });
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: "Application not found" });
        res.status(200).json({ message: "Application updated successfully" });
        }
    );
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
const deleteApplication = (req, res) => {
    const id = parseApplicationId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid application id" });
    }
    const userId = req.user.id;

    db.query(
        "DELETE FROM applications WHERE id = ? AND user_id = ?",
        [id, userId],
        (err, result) => {
        if (err) {
          console.error("deleteApplication:", err.message);
          return res.status(500).json({ message: "Error deleting application" });
        }
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