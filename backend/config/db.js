const mysql = require("mysql2");
require("dotenv").config(); 

// UPGRADE: We are using createPool instead of createConnection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Allows up to 10 simultaneous connections
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed: ", err.message);
  } else {
    console.log("MySQL successfully connected using a Connection Pool!");
    connection.release(); // Puts the connection back in the pool for others to use
  }
});

module.exports = db;