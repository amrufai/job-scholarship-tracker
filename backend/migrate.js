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
  if (err) console.error("Error creating users table:", err);
  else console.log("✅ Users table created successfully!");

  db.query(createAppsTable, (err) => {
    if (err) console.error("Error creating applications table:", err);
    else console.log("✅ Applications table created successfully!");
    
    process.exit(); // Closes the script
  });
});