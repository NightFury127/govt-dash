// Simple Express server for Seamless Gov Dashboard

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Set up SQLite database
const db = new sqlite3.Database("amendments.db", (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS friend_amendments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amendment_name TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const API_KEY = "sk-2b8e1e7c-4f7a-4e2a-9c1e-8d2e7b1a6f3c"; // Change this to your own strong key

// API key middleware for /api/ routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    const key = req.headers["x-api-key"];
    if (key !== API_KEY) {
      return res.status(401).json({ error: "Unauthorized: Invalid API key" });
    }
  }
  next();
});

// API endpoint to get amendment name by ID
app.get("/api/amendment/:id", (req, res) => {
  const amendmentId = req.params.id;

  db.get(
    "SELECT amendment_name FROM friend_amendments WHERE id = ?",
    [amendmentId],
    function (err, row) {
      if (err) {
        console.error("Failed to query DB:", err);
        return res.status(500).json({ error: "Failed to get amendment." });
      }

      if (!row) {
        return res.status(404).json({ error: "Amendment not found." });
      }

      res.json({
        amendmentName: row.amendment_name,
      });
    }
  );
});

// API endpoint to receive amendment name and store in DB
app.post("/api/send-amendment", (req, res) => {
  const { amendmentName } = req.body;
  if (!amendmentName) {
    return res.status(400).json({ error: "Amendment name is required." });
  }
  db.run(
    "INSERT INTO friend_amendments (amendment_name) VALUES (?)",
    [amendmentName],
    function (err) {
      if (err) {
        console.error("Failed to insert into DB:", err);
        return res.status(500).json({ error: "Failed to save amendment." });
      }
      console.log(`Amendment saved to DB: ${amendmentName}`);
      res.json({
        message: `Amendment '${amendmentName}' saved to your friend\'s database!`,
      });
    }
  );
});

// Serve static files (frontend)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
