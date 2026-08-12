const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sistema-mysql',   // nome do serviço no docker-compose
  user: 'marcos',          // usuário que você configurou
  password: '123456878',   // senha que você configurou
  database: 'db_sistema',  // nome do banco
  port: 3306
});

module.exports = pool;