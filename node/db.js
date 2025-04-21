// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// NOTE: In production, you might want to load credentials from env variables
const DB_PATH = path.join(__dirname, 'data.db');

// Initialize connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite:', err.message);
  } else {
    console.log('✅ Connected to SQLite DB');
  }
});

// Create `logs` table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
