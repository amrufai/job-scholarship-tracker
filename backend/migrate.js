require("dotenv").config();
const db = require("./config/db");

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255) NULL,
    reset_expires_at DATETIME NULL
)`;

const createAppsTable = `
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date_applied DATE,
    deadline DATE,
    link VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`;

async function addMissingUserColumns() {
  const columns = [
    { name: "reset_token", definition: "ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL" },
    { name: "reset_expires_at", definition: "ALTER TABLE users ADD COLUMN reset_expires_at DATETIME NULL" },
  ];

  for (const column of columns) {
    try {
      await db.query(column.definition);
    } catch (err) {
      if (err.code !== "ER_DUP_FIELDNAME") {
        throw err;
      }
    }
  }
}

async function migrate() {
  try {
    await db.query(createUsersTable);
    console.log("✅ Users table ready.");

    await addMissingUserColumns();
    console.log("✅ User reset fields ready.");

    await db.query(createAppsTable);
    console.log("✅ Applications table ready.");

    try {
      await db.query("CREATE INDEX idx_applications_user_id ON applications (user_id)");
      console.log("✅ Index idx_applications_user_id ready.");
    } catch (idxErr) {
      if (idxErr.code !== "ER_DUP_KEYNAME") {
        throw idxErr;
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err.message);
    process.exit(1);
  }
}

migrate();