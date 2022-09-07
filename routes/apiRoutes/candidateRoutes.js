
const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require("../../utils/inputCheck");
// Get all candidates
router.get('/candidates',(req,res)=>{
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
      data: rows
    });
  });
});

// Get a single candidate
router.get('/candidate/:id',(req,res)=>{
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

// create end point to add new candidate
router.post('/candidate', ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates(first_name,last_name,industry_connected)
            VALUES(?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];
  // using query we can execute the prepared Sql statement

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body
    });
  });
});

// create the endpoint that will delete a candidate from the database.
router.delete('/candidate/:id',(req,res)=>{
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



// update a candidate's party
router.put('/candidate/:id',(req,res)=>{
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

 module.exports = router;