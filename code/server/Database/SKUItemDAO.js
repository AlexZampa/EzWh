'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');

class SKUItemDAO {
    constructor(db) {
        this.db = db;
    }

    newSKUItem = async (RFID, sku) => {
        this.connectionDB.DBstartConnection();
        const sql = 'INSERT INTO SKUItem(RFID, sku) VALUES(?, ?)';
        const result = await this.connectionDB.DBexecuteQuery(sql, [RFID, sku]);
        this.connectionDB.DBendConnection();
        return result;
    };

}