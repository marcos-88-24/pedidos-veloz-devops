const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql-service',   // nome do service no Kubernetes
  user: 'admin',           // usuário definido no Secret
  password: 'password',    // senha definida no Secret
  database: 'db_sistema',  // nome do banco
  port: 3306
});

module.exports = pool;
