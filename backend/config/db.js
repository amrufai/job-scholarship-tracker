const mysql = require("mysql2");
require("dotenv").config();

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.DB_SSL === "false" || process.env.DB_SSL === "0"
      ? undefined
      : { rejectUnauthorized: false },
  connectTimeout: 30000,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database pool connection failed:", err.message);
    return;
  }
  connection.release();
  if (process.env.NODE_ENV !== "production") {
    console.log("Database pool ready.");
  }
});

module.exports = pool.promise();