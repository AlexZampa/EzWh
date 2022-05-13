'use strict';
const sqlite = require('sqlite3');
const SKUItem = require('../Model/SkuItem');
const SKU = require('../Model/Sku');
const ConnectionDB = require('./ConnectionDB');

class SKUItemDAO {
    constructor(db) {
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "SKUitem" ("rfid" TEXT NOT NULL UNIQUE, "SKUid" INTEGER NOT NULL, "available" INTEGER NOT NULL, "dateOfStock" TEXT, "restockOrderID" INTEGER, PRIMARY KEY("rfid"));');
    }

    newSKUItem = async (RFID, sku, available, dateOfStock, restockOrder=null) => {
        let sql = "SELECT COUNT(*) AS num FROM SKUItem WHERE rfid = ?";        // check if exists
        let res = await this.connectionDB.DBget(sql, [RFID]);
        if(res.num != 0)
            throw {err : 422, msg : "SKUItem not unique"};
        sql = 'INSERT INTO SKUItem(rfid, SKUid, available, dateOfStock, restockOrderID) VALUES(?, ?, ?, ?, ?)';
        res = await this.connectionDB.DBexecuteQuery(sql, [RFID, sku, available, dateOfStock, restockOrder]);
        return res;
    };

    getSKUItem = async (rfid) => {
        try {
            let sql = "SELECT * FROM SKUItem WHERE rfid = ?";
            const res = await this.connectionDB.DBget(sql, [rfid]);
            if(res === undefined)
                throw {err : 404, msg : "SKUItem not found"};
            const skuItem = new SKUItem(res.rfid, res.SKUid, res.available, res.dateOfStock ? res.dateOfStock : undefined, res.restockOrderID ? res.restockOrderID : undefined );
            return skuItem;
        }
        catch (err) {
            throw err;
        }
    };

    getAllSKUItems = async () => {
        try{
            let sql = "SELECT * FROM SKUItem";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const skuItemList = result.map(r => new SKUItem(r.rfid, r.SKUid, r.available, r.dateOfStock ? r.dateOfStock : undefined, r.restockOrderID ? r.restockOrderID : undefined ));
            return skuItemList;
        }
        catch (err) {
            throw err;
        }
    };

    updateSKUItem = async (oldRFID, newRFID, newAvailable, newDate, restockOrderID) => {
        try{
            if(oldRFID !== newRFID){
                let sql = "SELECT COUNT(*) AS num FROM SKUItem WHERE rfid = ?";
                let res = await this.connectionDB.DBget(sql, [newRFID]);
                if(res.num > 0)
                    throw {err : 422, msg : "RFID not unique"};
            }
            let sql = "UPDATE SKUItem SET rfid = ?, available = ?, dateOfStock = ?, restockOrderID = ? WHERE rfid = ?";
            let res = await this.connectionDB.DBexecuteQuery(sql, [newRFID, newAvailable, newDate, restockOrderID, oldRFID]);
            return res.lastID;      
        } catch (err) {
            throw err;
        }
    };

    deleteSKUItem = async (rfid) => {
        try {
            const sql = "DELETE FROM SKUItem WHERE rfid = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [rfid]);     // delete SKUItem
            if (res.changes === 0)
                throw { err: 404, msg: "SKUItem not found" };
            return res.changes;
        }
        catch (err) {
            throw err;
        }
    };

}

module.exports = SKUItemDAO;