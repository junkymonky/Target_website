const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Explicit DB path (avoids silent DB creation bugs)
const dbPath = path.join(__dirname, 'waf.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ WAF DB Error:', err);
  else console.log('✅ WAF database connected');
});

// Create table ONCE
db.run(`
  CREATE TABLE IF NOT EXISTS waf_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    attack_type TEXT,
    severity TEXT,
    endpoint TEXT,
    payload TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error('❌ Table creation error:', err);
});

// Logger function
function logAttack({ ip, attackType, severity, endpoint, payload, userAgent }) {
  const query = `
    INSERT INTO waf_logs 
    (ip, attack_type, severity, endpoint, payload, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [ip, attackType, severity, endpoint, payload, userAgent],
    function (err) {
      if (err) {
        console.error('❌ Failed to save WAF log:', err);
      } else {
        console.log('🧾 WAF log saved | ID:', this.lastID);
      }
    }
  );
}

module.exports = { logAttack };
