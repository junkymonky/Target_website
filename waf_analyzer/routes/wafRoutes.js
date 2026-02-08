const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

/* Correct DB path */
const dbPath = path.join(__dirname, "../waf.db");

/* Open SQLite DB */
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect WAF DB", err);
  } else {
    console.log("✅ Dashboard connected to WAF DB");
  }
});

/* All logs */
router.get("/logs", (req, res) => {
  db.all(
    'SELECT id, ip, attack_type, severity, endpoint, payload, user_agent, created_at FROM waf_logs ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

/* Stats for dashboard */
router.get("/stats", (req, res) => {
  const stats = {};

  db.serialize(() => {
    db.get(
      "SELECT COUNT(*) as total FROM waf_logs",
      [],
      (err, row) => {
        stats.total = row.total;
      }
    );

    db.all(
      "SELECT attack_type, COUNT(*) as count FROM waf_logs GROUP BY attack_type",
      [],
      (err, rows) => {
        stats.attacks = rows;
      }
    );

    db.all(
      "SELECT severity, COUNT(*) as count FROM waf_logs GROUP BY severity",
      [],
      (err, rows) => {
        stats.severity = rows;
        res.json(stats);
      }
    );
  });
});

module.exports = router;
