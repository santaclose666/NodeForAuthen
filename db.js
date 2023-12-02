// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "AuthenTest",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3333,
});

module.exports = pool;
