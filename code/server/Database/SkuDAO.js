'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');

class SkuDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
    }

    newSKU = async (description, weight, volume, notes, price, availableQty) => {
        this.connectionDB.DBstartConnection();
        const sql = 'INSERT INTO SKU(description, weight, volume, notes, position, quantity, price) VALUES(?, ?, ?, ?, ?, ?, ?)';
        const result = await this.connectionDB.DBexecuteQuery(sql, [description, weight, volume, notes, null, availableQty, price]);
        this.connectionDB.DBendConnection();
        return result;
    };

}

module.exports = SkuDAO;