// connect to database
const mysql = require("mysql2");
const db = mysql.createConnection(
  {
    host: "localhost",
    // your Mysql username,
    user: "root",
    // your Mysql password
    password: "Kishore@123",
    database: "election",
  },
  console.log("Connected to the election database.")
);

module.exports =db;