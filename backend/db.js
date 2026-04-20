const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rutu@123",
  database: process.env.DB_NAME || "pdf_form_app",
  port: process.env.DB_PORT || 3306,
});

module.exports = db.promise();  