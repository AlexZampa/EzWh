'use strict';
const sqlite = require('sqlite3');

class UserDAO{

    constructor(db){
        this.db = db;
    };

    loginUser = (username, password) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM User WHERE email = ?";
            this.db.get(sql, [username], (err, row) => {
                if (err)
                    reject(err);
                else {
                    if(row !== undefined){
                        // user exists
                        if(password === row.password){
                            const user = {"id": row.userID, "name": row.name, "surname": row.surname, "email": row.email};
                            resolve(user);
                        }
                        else
                            resolve({});        // wrong password
                    }
                    resolve({});            // user does not exist
                }
            });
        });
    };

}



module.exports = UserDAO;