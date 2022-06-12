'use strict'
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const Item = require('../Model/Item');

class ItemDAO {

    constructor(db) {
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "Item" ("id" INTEGER NOT NULL UNIQUE, "description" TEXT NOT NULL, "price" NUMERIC NOT NULL, "associatedSKU" INTEGER NOT NULL, "supplier" INTEGER NOT NULL, PRIMARY KEY("id"));');
    }

    getAllItem = async () => {
        try {
            let sql = "SELECT * FROM ITEM";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const itemList = result.map(r => new Item(r.id, r.description, r.price, r.associatedSKU, r.supplier));
            return itemList;
        } catch (err) {
            throw err;
        }
    }

    getItem = async (id) => {
        try {
            let sql = "SELECT * FROM Item WHERE id = ?";
            const res = await this.connectionDB.DBget(sql, [id]);
            if (res === undefined)
                throw { err: 404, msg: "Item not found" };
            const item = new Item(res.id, res.description, res.price, res.associatedSKU, res.supplier);
            return item;
        }
        catch (err) {
            throw err;
        }
    }

    // CHECK
    getItemsBySkuId = async (skuId) => {
        try {
            let sql = "SELECT * FROM Item WHERE associatedSKU = ?";
            const res = await this.connectionDB.DBgetAll(sql, [skuId]);
            const item = new Item(res.id, res.description, res.price, res.associatedSKU, res.supplier);
            return item;
        }
        catch (err) {
            throw err;
        }
    }

    getItemsBySupplier = async (supplierId) => {
        try {
            let sql = "SELECT * FROM Item WHERE supplier = ?";
            const result = await this.connectionDB.DBgetAll(sql, [supplierId]);
            const itemList = result.map(r => new Item(r.id, r.description, r.price, r.associatedSKU, r.supplier));
            return itemList;
        }
        catch (err) {
            throw err;
        }
    }

    newItem = async (id, description, price, SKUId, supplierId) => {
        try {
            let sql = "SELECT COUNT(*) AS num FROM Item WHERE id = ?";        // check if exists
            let res = await this.connectionDB.DBget(sql, [id]);
            if (res.num != 0)
                throw { err: 422, msg: "id not unique" };
            sql = "SELECT COUNT(*) AS num FROM Item WHERE associatedSKU = ? AND supplier = ?";
            res = await this.connectionDB.DBget(sql, [SKUId, supplierId]);
            if (res.num != 0)
                throw { err: 422, msg: "this supplier already sells an item with the same SKUId" };
            sql = "INSERT INTO ITEM(id, description, price, associatedSKU, supplier) VALUES(?, ?, ?, ?, ?)";
            res = await this.connectionDB.DBexecuteQuery(sql, [id, description, price, SKUId, supplierId]);
            return res.lastID;
        }
        catch (err) {
            throw err;
        }
    };

    updateItem = async (id, newDescription, newPrice, associatedSKU, supplier) => {
        try {
            let sql = "UPDATE ITEM SET description = ?, price = ?, associatedSKU = ?, supplier = ? WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newDescription, newPrice, associatedSKU, supplier, id]);
            return res.lastID;
        }
        catch (err) {
            throw err;
        }
    };

    deleteItem = async (id) => {
        try {
            let sql = "DELETE FROM ITEM WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [id]);
            return res.changes;
        }
        catch (err) {
            throw err;
        }
    }

    resetTable = async () => {
        try {
            let res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS Item');
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "Item" ("id" INTEGER NOT NULL UNIQUE, "description" TEXT, "price" NUMERIC NOT NULL, "associatedSKU" INTEGER NOT NULL, "supplier" INTEGER NOT NULL, PRIMARY KEY("id"));');
        } catch (err) {
            throw err;    
        }
    };
}

module.exports = ItemDAO;