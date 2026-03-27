const express = require("express");
const cors = require("cors");

require("dotenv").config();
const { assertRequiredEnv } = require("./utils/validateEnv");
const { getAllowedOrigins } = require("./utils/corsOrigins");

assertRequiredEnv();
const db = require("./config/db");

const app = express();

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.send("Your Scholarship Tracker API is running!");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const applicationRoutes = require("./routes/applicationRoutes");
app.use("/api/applications", applicationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});
