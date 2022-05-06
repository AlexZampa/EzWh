'use strict';
const sqlite = require('sqlite3');


class ConnectionDB{
    dbName;
    db;

    constructor(){
        this.db = new sqlite.Database('./Database/EzWhDatabase.db', (err) => { if (err) throw err; }); 
    }

    /** 
     * Execute query for retrieving data (SELECT ...) 
     * @return only the first row of the result
    */ 
    DBget(query, params) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row);
            })
        });
    }

    /** 
     * Execute query for retrieving data (SELECT ...) 
     * @return all the rows as a list
    */ 
    DBgetAll(query, params){
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err)
                    reject(err);
                else{
                    resolve(rows);
                }
            })
        });
    }

    /** 
     * Execute query for INSERT, DELETE or UPDATE data
     * @return a js object with key "changes" as the number of changes in the DB and
     * key "lastID" as the last ID of the inserted row or deleted row
    */ 
    DBexecuteQuery(query, params) {
        try{
            return new Promise((resolve, reject) => {
                this.db.run(query, params, function(err) {
                    if (err)
                    reject(err);
                    else
                    resolve({changes: this.changes, lastID: this.lastID});
                });
            });
        } catch(err){
            throw(err);
        }
    }

}



module.exports = ConnectionDB;