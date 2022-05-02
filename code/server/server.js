'use strict';
const express = require('express');
const sqlite = require('sqlite3');
const ControllerUser = require('./Controller/ControllerUser')

// init express
const app = new express();
const port = 3001;

app.use(express.json());

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


app.post('/api/managerSessions', async function(req, res){
  //return ControllerUser.login(req, res);
  let username = req.body.username;
    let password = req.body.password;
    const user = await getUserFromDB(username, password);
    console.log(user);
    return res.status(200).json(user);
});

async function getUserFromDB (username, password){
  const db = new sqlite.Database('./database/EzWhDatabase.db', err => {if(err) throw err;});
  const user = await getUser(db, username, password);
  db.close();
  return user;
}

async function getUser(db, username, password) {
  return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM User WHERE email = ? AND password = ?";
      db.get(sql, [username, password], (err, row) => {
          if(err)
              reject(err);
          else{
              const user = {"id": row.UserID, "name": row.name, "surname": row.surname, "email": row.email, "password": row.password};
              resolve(user);
          }
      })
  })
};

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;