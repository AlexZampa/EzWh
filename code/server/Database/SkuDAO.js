'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const SKU = require('../Model/Sku');
const TestDescriptor = require('../Model/TestDescriptor');
const { Position } = require('../Model/Position');

class SkuDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
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
            // move to class TestDescriptorDAO
            for(const s of skuList){
                sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
                let skuTests = await this.connectionDB.DBgetAll(sql, [s.getID()]);
                skuTests.forEach(t => {s.addTestDescriptor(new TestDescriptor(t.id)); });
            }
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
            if(res === undefined)
                throw {err : 404, msg : "SKU not found"};
            // move to class TestDescriptorDAO
            sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
            const skuTests = await this.connectionDB.DBgetAll(sql, [skuID]);
            const sku = new SKU(res.id, res.description, res.weight, res.volume, res.notes, res.price, res.availableQuantity, res.position ? res.position : undefined);
            // modify new TestDescriptor when class completed
            skuTests.forEach(t => { sku.addTestDescriptor(new TestDescriptor(t.id)); });
            return sku;
        }
        catch(err){
            throw err;
        }
    };

    updateSKU = async (skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, newPositionID=undefined) => {
        try{
            let sql = "UPDATE SKU SET description = ?, weight = ?, volume = ?, notes = ?, availableQuantity = ?, price = ?, position = ? WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newDescription, newWeight, newVolume, newNotes, newAvailableQuantity, newPrice, newPositionID ? newPositionID : null, skuID]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    };

    deleteSKU = async (skuID) => {
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

            sql = "DELETE FROM SKU WHERE id = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [skuID]);     // delete SKU
            if(res.changes === 0)      // skuID not found
                throw {err : 404, msg : "SKU not found"};
            return res.changes;
        }
        catch(err){
            throw err;
        }
    };
    
}

module.exports = SkuDAO;