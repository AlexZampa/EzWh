'use strict'
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const Item = require('../Model/Item');

class ItemDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
    }

    getAllItem = async () => {
        try{
            let sql = "SELECT * FROM ITEM";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const itemList = result.map(r => new Item(r.id, r.description, r.price, r.SKUId, r.supplierId));
            return itemList;
        }catch(err){
            throw err;
        }
    }

    getItem = async (id) => {
        try{
            let sql = "SELECT * FROM ITEM WHERE id = ?";
            const res = await this.connectionDB.DBget(sql, [id]);
            if(res === undefined)
                throw {err : 404, msg : "ITEM not found"};
            const item = new Item(res.id, res.description, res.price, res.SKUId, res.supplierId);
            return item;
        }
        catch(err){
            throw err;
        }
    }

    newItem = async (description, price, SKUId, supplierId) => {
        try{
            const sql = "INSERT INTO ITEM(description, price, associatedSKU, supplier) VALUES(?, ?, ?, ?)";
            const res = await this.connectionDB.DBexecuteQuery(sql, [description, price, SKUId, supplierId]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    };

    updateItem = async (id, newDescription, newPrice, associatedSKU, supplier) => {
        try{
            let sql = "UPDATE ITEM SET description = ?, price = ?, associatedSKU = ?, supplier = ? WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newDescription, newPrice, associatedSKU, supplier, id]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    };

    deleteItem = async (id) => {
        try{
            // check consistency of the DB 
            let sql = "SELECT COUNT(*) AS num FROM SKUitem WHERE SKUid = ?";        // check SKUItem
            let res = await this.connectionDB.DBget(sql, [skuID]);
            if(res.num !== 0)
                throw {err : 422, msg : "Cannot delete SKU"};
            sql = "SELECT COUNT(*) AS num FROM TestDescriptor WHERE SKUid = ?";     // check TestDescriptor
            res = await this.connectionDB.DBget(sql, [skuID]);
            if(res.num !== 0)
                throw {err : 422, msg : "Cannot delete SKU"};

            sql = "DELETE FROM ITEM WHERE id = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [id]);
            return res.changes;
        }
        catch(err){
            throw err;
        }
    }

}

module.exports = ItemDAO;