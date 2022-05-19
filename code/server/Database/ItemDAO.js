'use strict'
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const Item = require('../Model/Item');

class ItemDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "Item" ("id" INTEGER NOT NULL UNIQUE, "description" TEXT NOT NULL, "price" NUMERIC NOT NULL, "associatedSKU" INTEGER NOT NULL, "supplier" INTEGER NOT NULL, PRIMARY KEY("id"));');
    }

    getAllItem = async () => {
        try{
            let sql = "SELECT * FROM ITEM";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const itemList = result.map(r => new Item(r.id, r.description, r.price, r.associatedSKU, r.supplier));
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
            const item = new Item(res.id, res.description, res.price, res.associatedSKU, res.supplier);
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
            let sql = "DELETE FROM ITEM WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [id]);
            return res.changes;
        }
        catch(err){
            throw err;
        }
    }

}

module.exports = ItemDAO;