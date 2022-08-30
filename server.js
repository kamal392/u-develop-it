
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
// db.query(`SELECT * FROM candidates`,(err,rows)=>{
//     console.log(rows);
// });

// Get a single candidate
// db.query(`SELECT * FROM candidates WHERE id =1`,(err,row)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(row);
// });

// Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`,1,(err,result)=>{
//     if(err){
//      console.log(err);
//     }
//     console.log(result);
// });

// create a candidate
// const sql = `INSERT INTO candidates(id,first_name,last_name,industry_connected)
//     VALUES (?,?,?,?)`;
// const params = [1,'Ronland','Firbank',1];

// db.query(sql,params,(err,result)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// });






app.use((req, res) => {
  res.status(404).end();
});




app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});