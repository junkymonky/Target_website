const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = 3000;

// Trust proxy (important for real IP detection)
app.set('trust proxy', true);
const wafRoutes = require("./waf_analyzer/routes/wafRoutes");
app.use("/api/waf", wafRoutes);
app.use(cors())
// Middleware FIRST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// 🔴 REQUEST LOGGER (CRUCIAL FOR WAF VISIBILITY)
app.use((req, res, next) => {
  console.log({
    ip: req.headers['x-forwarded-for'] || req.ip,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    time: new Date()
  });
  next();
});

// ✅ WAF AFTER bodyParser
const waf = require('./waf_analyzer/waf');
app.use(waf);

// SQLite DB
const db = new sqlite3.Database('./database.db');

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`);

// Insert test user
db.run(`
  INSERT OR IGNORE INTO users (id, username, password)
  VALUES (1, 'admin', 'admin123')
`);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.use((req, res, next) => {
  res.locals.loginFailed = false
  next()
})


// 🔥 INTENTIONALLY VULNERABLE LOGIN (for SQLi testing)
app.post('/login', (req, res) => {
  const { username, password } = req.body

  const query = `
    SELECT * FROM users
    WHERE username = '${username}'
    AND password = '${password}'
  `

  console.log("Executing Query:", query)

  db.get(query, (err, row) => {
    if (row) {
      res.send('<h2>Login Successful</h2>')
    } else {
      res.locals.loginFailed = true   // 🔴 IMPORTANT
      res.status(401).send('<h2>Login Failed</h2>')
    }
  })
})


app.listen(PORT, () => {
  console.log(`Target website running at http://localhost:${PORT}`);
});

app.get('/waf/logs', (req, res) => {
  const db = new (require('sqlite3').verbose()).Database('./waf_analyzer/waf.db');

  db.all('SELECT * FROM waf_logs ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});
