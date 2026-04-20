// Example using mysql2/promise
const mysql = require('mysql2/promise');

const pool = mysql.createPool(process.env.MYSQL_URL || {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306
}); 
