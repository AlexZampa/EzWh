'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');

class SkuDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
    }

    newSKU = async (description, weight, volume, notes, price, availableQty) => {
        const sql = 'INSERT INTO SKU(description, weight, volume, notes, position, quantity, price) VALUES(?, ?, ?, ?, ?, ?, ?)';
        const result = await this.connectionDB.DBexecuteQuery(sql, [description, weight, volume, notes, null, availableQty, price]);
        return result;
    };

    getAllSKU = async () => {
        const sql = 'SELECT * FROM SKU';
        const result = await this.connectionDB.DBgetAll(sql, []);
        return result.map(r => new SKU(r.id, r.description, r.weight, r.volume, r.notes, r.price, r.quantity, r.position));
    };
    
}

module.exports = SkuDAO;