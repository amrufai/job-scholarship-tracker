const mysql = require("mysql2");
require("dotenv").config(); // Force it to load the .env variables right here!

// This will print to the terminal so we can prove it's reading your .env file
console.log("-> Trying to connect to Aiven Host:", process.env.DB_HOST);
console.log("-> Using Port:", process.env.DB_PORT);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 30000 // Give it 30 seconds instead of the default 10
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to the Cloud Database!");
});

module.exports = db;