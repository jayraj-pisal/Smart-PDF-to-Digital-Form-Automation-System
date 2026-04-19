const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "rutu@123",
  database: process.env.MYSQLDATABASE || "pdf_form_app"
});

module.exports = db.promise();  