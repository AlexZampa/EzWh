'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const User = require('../Model/User');

class UserDAO{

    constructor(){
        this.connectionDB = new ConnectionDB();
    };

    getAllUsers = async () => {
        try{
            const sql = "SELECT * FROM User";
            const res = await this.connectionDB.DBgetAll(sql, []);
            return res.map(u => new User(u.userID, u.name, u.surname, u.email, u.password, u.type));
        }
        catch(err){
            throw err;
        }
    };

    newUser = async (username, name, surname, password, type) => {
        try{
            const sql = "INSERT INTO User(name, surname, email, password, type) VALUES(?, ?, ?, ?, ?)";
            const res = await this.connectionDB.DBexecuteQuery(sql, [name, surname, username, password, type]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    };


    loginUser = async (username, password) => {
        const sql = "SELECT * FROM User WHERE email = ?";
        const row = await this.connectionDB.DBget(sql, [username]);
        
        if(row !== undefined && password === row.password){       // user exists
            return(new User(row.userID, row.name, row.surname, row.email));
        }
        // user does not exists or wrong password
        return(undefined);
    };

}



module.exports = UserDAO;