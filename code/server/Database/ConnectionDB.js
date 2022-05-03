'use strict';
const sqlite = require('sqlite3');

const DBname = './Database/EzWhDatabase.db';

class ConnectionDB{
    dbName;
    db;

    constructor(){
        this.dbName = DBname;
    }

    DBstartConnection() {
        this.db = new sqlite.Database(this.dbName, (err) => { if (err) throw err; }); 
    };

    DBendConnection(){  
        this.db.close((err) => { if (err) throw err; });
    };

    // execute query for retrieving data (SELECT ...)
    DBget(query, params) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err)
                    reject(err);
                else{
                    if(rows.length === 1)
                        resolve(rows[0]);
                    else
                        resolve(rows);
                }
            })
        });
    }

    // execute query for INSERT DELETE or UPDATE data
    DBexecuteQuery(query, params) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err)
                    reject(err);
                else
                    resolve(this.lastID);
            });
        });
    }

}



module.exports = ConnectionDB;