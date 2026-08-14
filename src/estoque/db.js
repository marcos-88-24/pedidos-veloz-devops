const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-service',
  user: process.env.DB_USER || 'marcos',
  password: process.env.DB_PASSWORD || '123456878',
  database: process.env.DB_NAME || 'db_sistema',
  port: 3306
});

module.exports = pool;
