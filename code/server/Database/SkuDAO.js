'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const SKU = require('../Model/Sku');
const { Position } = require('../Model/Position');

class SkuDAO{

    constructor(){
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "SKU" ("id" INTEGER NOT NULL UNIQUE, "description" TEXT, "weight" NUMERIC NOT NULL, "volume" NUMERIC NOT NULL, "notes" TEXT NOT NULL, "availableQuantity" INTEGER NOT NULL, "price" NUMERIC NOT NULL, "position" TEXT, PRIMARY KEY("id"));')
    }

    newSKU = async (description, weight, volume, notes, price, availableQty, position) => {
        try{
            const sql = "INSERT INTO SKU(description, weight, volume, notes, position, availableQuantity, price) VALUES(?, ?, ?, ?, ?, ?, ?)";
            const res = await this.connectionDB.DBexecuteQuery(sql, [description, weight, volume, notes, position, availableQty, price]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    };

    getAllSKU = async () => {
        try{
            let sql = "SELECT * FROM SKU";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const skuList = result.map(r => new SKU(r.id, r.description, r.weight, r.volume, r.notes, r.price, r.availableQuantity, r.position ? r.position : undefined));
            return skuList;
        }
        catch(err){
            throw err;
        }
    };

    getSKU = async (skuID) => {
        try{
            let sql = "SELECT * FROM SKU WHERE id = ?";
            const res = await this.connectionDB.DBget(sql, [skuID]);
            if(res === undefined){
                throw {err: 404, msg: "SKU not found"};
            }
            const sku = new SKU(res.id, res.description, res.weight, res.volume, res.notes, res.price, res.availableQuantity, res.position ? res.position : undefined);
            return sku;
        }
        catch(err){
            throw err;
        }
    };

    updateSKU = async (skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, newPositionID) => {
        try{
            let sql = "UPDATE SKU SET description = ?, weight = ?, volume = ?, notes = ?, availableQuantity = ?, price = ?, position = ? WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newDescription, newWeight, newVolume, newNotes, newAvailableQuantity, newPrice, newPositionID, skuID]);
            return res.changes;
        }
        catch(err){
            throw err;
        }
    };

    deleteSKU = async (skuID) => {
        try{
            const sql = "DELETE FROM SKU WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [skuID]);     // delete SKU
            return res.changes;
        }
        catch(err){
            throw err;
        }
    };
    
    resetTable = async () => {
        try {
            let res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS SKU');
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "SKU" ("id" INTEGER NOT NULL UNIQUE, "description" TEXT, "weight" NUMERIC NOT NULL, "volume" NUMERIC NOT NULL, "notes" TEXT NOT NULL, "availableQuantity" INTEGER NOT NULL, "price" NUMERIC NOT NULL, "position" TEXT, PRIMARY KEY("id"));')
        } catch (err) {
            throw err;    
        }
    };
    
}

module.exports = SkuDAO;