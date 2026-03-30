const db = require("../config/db");

function parseApplicationId(raw) {
  const id = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(id) || id < 1) return null;
  return id;
}

const createApplication = async (req, res) => {
  const { title, organization, type, status, date_applied, deadline, link, notes } = req.body;
  const userId = req.user.id;

  if (!title || !organization) {
    return res.status(400).json({ message: "Please provide at least a title and organization" });
  }

  const sql = `INSERT INTO applications 
     (user_id, title, organization, type, status, date_applied, deadline, link, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    // FIX: Using || null converts undefined or "" (empty strings) into safe SQL NULLs
    const [result] = await db.query(sql, [
      userId, 
      title, 
      organization, 
      type, 
      status, 
      date_applied || null, 
      deadline || null, 
      link || null, 
      notes || null
    ]);
    
    res.status(201).json({ message: "Application saved successfully!", applicationId: result.insertId });
  } catch (err) {
    console.error("createApplication:", err.message);
    res.status(500).json({ message: "Failed to add application" });
  }
};

const getApplications = async (req, res) => {
  const userId = req.user.id;
  try {
    const [results] = await db.query(
      "SELECT * FROM applications WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("getApplications:", err.message);
    res.status(500).json({ message: "Database error" });
  }
};

const updateApplication = async (req, res) => {
  const id = parseApplicationId(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid application id" });
  const userId = req.user.id;
  const { title, organization, type, status, date_applied, deadline, link, notes } = req.body;

  try {
    // FIX: Applied the same null fallback here
    const [result] = await db.query(
      "UPDATE applications SET title=?, organization=?, type=?, status=?, date_applied=?, deadline=?, link=?, notes=? WHERE id=? AND user_id=?",
      [
        title, 
        organization, 
        type, 
        status, 
        date_applied || null, 
        deadline || null, 
        link || null, 
        notes || null, 
        id, 
        userId
      ]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Application not found" });
    res.status(200).json({ message: "Application updated successfully" });
  } catch (err) {
    console.error("updateApplication:", err.message);
    res.status(500).json({ message: "Error updating application" });
  }
};

const deleteApplication = async (req, res) => {
  const id = parseApplicationId(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid application id" });
  const userId = req.user.id;
  
  try {
    const [result] = await db.query(
      "DELETE FROM applications WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Application not found" });
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("deleteApplication:", err.message);
    res.status(500).json({ message: "Error deleting application" });
  }
};

module.exports = { createApplication, getApplications, updateApplication, deleteApplication };