const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rutu@123",          
  database: "pdf_form_app"
});

module.exports = db.promise();  