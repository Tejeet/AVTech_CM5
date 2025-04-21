// db.js
const mysql = require('mysql2');

// Use environment variables or config file in production
const DB_CONFIG = {
  host: '94.136.185.134',
  port: 3306,
  user: 'root',
  password: 'myroot',
  database: 'amityfacecam'
};

// Create a connection pool for better performance
const pool = mysql.createPool(DB_CONFIG);

// Create `logs` table if not exists
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

pool.query(createTableSQL, (err, results) => {
  if (err) {
    console.error('❌ Failed to create or verify logs table:', err.message);
  } else {
    console.log('✅ MySQL logs table ready');
  }
});

module.exports = pool.promise(); // Use promise-based API
