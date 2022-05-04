'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const User = require('../Model/User');

class UserDAO{

    constructor(){
        this.connectionDB = new ConnectionDB();
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