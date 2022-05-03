'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');

class UserDAO{

    constructor(){
        this.connectionDB = new ConnectionDB();
    };

    loginUser = async (username, password) => {
        this.connectionDB.DBstartConnection();
        const sql = "SELECT * FROM User WHERE email = ?";
        const row = await this.connectionDB.DBget(sql, [username]);
        this.connectionDB.DBendConnection();
           
        if(row == undefined)       // user does not exists
            return({});
            
        // user exists
        if(password === row.password){
            const user = {"id": row.userID, "name": row.name, "surname": row.surname, "email": row.email};
            return(user);
        }
        return({});
    };

}



module.exports = UserDAO;