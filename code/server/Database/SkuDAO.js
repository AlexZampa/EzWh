'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const SKU = require('../Model/Sku');
const TestDescriptor = require('../Model/TestDescriptor');
const Position = require('../Model/Position')

class SkuDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
    }

    newSKU = async (description, weight, volume, notes, price, availableQty) => {
        const sql = "INSERT INTO SKU(description, weight, volume, notes, position, availableQuantity, price) VALUES(?, ?, ?, ?, ?, ?, ?)";
        const result = await this.connectionDB.DBexecuteQuery(sql, [description, weight, volume, notes, null, availableQty, price]);
        return result;
    };

    getAllSKU = async () => {
        let sql = "SELECT * FROM SKU";
        const result = await this.connectionDB.DBgetAll(sql, []);
        const skuList = result.map(r => new SKU(r.id, r.description, r.weight, r.volume, r.notes, r.price, r.availableQuantity, r.position ? r.position : ""));
        for(const s of skuList){
            sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
            let skuTests = await this.connectionDB.DBgetAll(sql, [s.getID()]);
            skuTests.forEach(t => {s.addTestDescriptor(new TestDescriptor(t.id)); });
            if(s.getPosition() !== ""){
                sql = "SELECT * FROM Position WHERE positionID = ?";
                const skuPosition = await this.connectionDB.DBget(sql, [s.getPosition()]);
                s.setPosition(new Position(skuPosition.positionID, skuPosition.aisle, skuPosition.row, skuPosition.col, skuPosition.maxWeight, skuPosition.maxVolume));
            }
        }
        return skuList;
    };

    getSKU = async (skuID) => {
        let sql = "SELECT * FROM SKU WHERE id = ?";
        const res = await this.connectionDB.DBget(sql, [skuID]);
        if(res === undefined)
            return undefined;
        sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
        const skuTests = await this.connectionDB.DBgetAll(sql, [skuID]);
        let position = "";
        if(res.position !== null){
            sql = "SELECT * FROM Position WHERE positionID = ?";
            const skuPosition = await this.connectionDB.DBget(sql, [res.position]);
            position = new Position(skuPosition.positionID, skuPosition.aisle, skuPosition.row, skuPosition.col, 
                skuPosition.maxWeight, skuPosition.maxVolume);
        }
        const sku = new SKU(res.id, res.description, res.weight, res.volume, res.notes, res.price, res.availableQuantity, position);
        // modify new TestDescriptor when class completed
        skuTests.forEach(t => { sku.addTestDescriptor(new TestDescriptor(t.id)); });
        return sku;
    };

    deleteSKU = async (skuID) => {
        // consistency of the DB should be checked
        const sql = "DELETE FROM SKU WHERE id = ?";
        const res = await this.connectionDB.DBexecuteQuery(sql, [skuID]);
        return res;
    };
    
}

module.exports = SkuDAO;