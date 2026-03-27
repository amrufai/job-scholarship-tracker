require("dotenv").config();
const db = require("./config/db");

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
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

db.query(createUsersTable, (err) => {
  if (err) {
    console.error("Error creating users table:", err);
    return process.exit(1);
  }
  console.log("✅ Users table created successfully!");

  db.query(createAppsTable, (err2) => {
    if (err2) {
      console.error("Error creating applications table:", err2);
      return process.exit(1);
    }
    console.log("✅ Applications table created successfully!");

    db.query(
      "CREATE INDEX idx_applications_user_id ON applications (user_id)",
      (idxErr) => {
        if (idxErr && idxErr.code !== "ER_DUP_KEYNAME") {
          console.error("Error creating index:", idxErr);
          return process.exit(1);
        }
        if (!idxErr) console.log("✅ Index idx_applications_user_id ready.");
        process.exit(0);
      }
    );
  });
});
