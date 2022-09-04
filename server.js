
const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck =require('./utils/inputCheck');
const { query } = require('express');

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

// Get all candidates
app.get('/api/candidates',(req,res)=>{
  const sql = `SELECT candidates.*,parties.name
          AS party_name
          FROM candidates
          LEFT JOIN parties
          ON candidates.party_id = parties.id`;
  // this query method allow to write sql command in node.js application

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Get a single candidate
app.get('/api/candidate/:id',(req,res)=>{
    const sql = `SELECT candidates.*,parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id =?
    `;
  
    const params = [req.params.id];

    db.query(sql,params,(err,row)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        }
        res.json({
            message:'success',
            data:row
        });
    });
});


// update a candidate's party
app.put('/api/candidate/:id',(req,res)=>{
const errors = inputCheck(req.body,'party_id');
if(errors){
    res.status(400).json({error:errors});
    return;
}
  const sql =`UPDATE candidates SET party_id =?
  WHERE id =?`;
  const params =[req.body.party_id,req.params.id];

  db.query(sql,params,(err,result)=>{
    if (err){
        res.status(400).json({error:err.message});
        // check if a record was found
    }else if(!result.affectedRows){
      res.json({
        message:'Candidate not found'
      });
    }else {
        res.json({
            message:'success',
            data:req.body,
            changes:result.affectedRows
        });
    }
  });

});

// Create API Routs for parties
app.get('/api/parties',(req,res)=>{
const sql = `SELECT * FROM parties`;
db.query(sql,(err,rows)=>{
    if(err){
        res.status(500).json({error:err.message});
        return;
    }
    res.json({
        message:'success',
        data:rows
    });
});
});

// create the endpoint with id parameter
app.get('/api/party/:id',(req,res)=>{
    const sql = `SELECT * FROM parties WHERE id=?`;
    const params = [req.params.id];

    // writing sql query
    db.query(sql,params,(err,row)=>{
        if(err){
            res.status(400).json({erro:err.message});
            return;
        }
        res.json({
            message:'success',
            dat:row
        });
    });
});
// create the endpoint that will delete a candidate from the database.

app.delete('/api/candidate/:id',(req,res)=>{
 const sql = `DELETE FROM candidates WHERE id=?`;
 const params = [req.params.id];

 db.query(sql,params,(err,result)=>{
    if(err){
        res.statusMessage(400).json({error:res.message});
        // check if anything was deleted
    }else if(!result.affectedRows){
        res.json({
            message:'candidate not found'
        });
    }else{
        res.json({
            message :'deleted',
            changes:result.affectedRows,
            id:req.params.id
        });
    }
 });
});

// create the end point to delete party from database

app.delete('/api/party/:id',(req,res)=>{
    const sql = `DELETE FROM parties WHERE id=?`;
    const params =[req.params.id];

    db.query(sql,params,(err,result)=>{

    if (err){
        res.status(400).json({error:res.message});
    }
    else if(!result.affectedRows){
      res.json({
        message:'party not found'
      })
    }
    else{
        res.json({
            message:'deleted',
            changes:result.affectedRows,
            id:req.params.id
        });
    }

    });
});
// create the post route to create a candidate

app.post('/api/candidate',({body},res)=>{
 const errors = inputCheck(body,'first_name','last_name','industry_connected');

 if(errors){
    res.status(404).json({error:errors});
   return;
 }
 const sql =`INSERT INTO candidates(first_name,last_name,industry_connected)
            VALUES(?,?,?)`;
 const params = [body.first_name, body.last_name, body.industry_connected];
// using query we can execute the prepared Sql statement

 db.query(sql,params,(err,result)=>{

    if(err){
        res.status(400).json({error:err.message});
        return;
    }
    res.json({
        message:'success',
        data:body
    });
 });

});


app.use((req, res) => {
  res.status(404).end();
});




app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});