
const mysql = require('mysql2');
const express = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended:false}));
app.use(express.json());

// connect to database
const db = mysql.createConnection({
    host : 'localhost',
    // your Mysql username,
    user:'root',
    // your Mysql password
    password:'Kishore@123',
    database :'election'
},
console.log('Connected to the election database.')
);

// Default response for any other request (Not Found)
// this query method allow to write sql command in node.js application
db.query(`SELECT * FROM candidates`,(err,rows)=>{
    console.log(rows);
});
app.use((req, res) => {
  res.status(404).end();
});




app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});