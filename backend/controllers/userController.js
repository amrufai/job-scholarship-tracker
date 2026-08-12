const db = require("../config/db");

// Deletes the currently authenticated user's account.
// The `applications` table has ON DELETE CASCADE on user_id (see migrate.js),
// so this also removes all of that user's applications.
const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("deleteAccount:", err.message);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

module.exports = { deleteAccount };
