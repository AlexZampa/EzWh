'use strict';
const sqlite = require('sqlite3');
const SKU = require('../Model/Sku');
const ConnectionDB = require('./ConnectionDB');

class SKUItemDAO {
    constructor(db) {
        this.db = db;
    }

    newSKUItem = async (RFID, sku, dateOfStock) => {
        const sql = 'INSERT INTO SKUItem(RFID, SKU, DateOfStock) VALUES(?, ?)';
        const result = await this.connectionDB.DBexecuteQuery(sql, [RFID, sku, dateOfStock]);
        return result;
    };

    getSKUItem = async (rfid) => {
        try {
            let sql = "SELECT * FROM SKUItem WHERE RFID = ?";
            const res = await this.connectionDB.DBget(sql, [rfid]);
            if (res === undefined)
                throw { err: 404, msg: "SKUItem not found" };
            // move to class TestResultDAO
            sql = "SELECT * FROM TestResult WHERE RFID = ?";
            const testResults = await this.connectionDB.DBgetAll(sql, [rfid]);

            /* Create new SKU */
            sql = "SELECT * FROM SKU WHERE RFID = ?";
            const result = await this.connectionDB.DBgetAll(sql, [rfid]);
            sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
            const skuTests = await this.connectionDB.DBgetAll(sql, [result.id]);
            const sku = new SKU(res.id, res.description, res.weight, res.volume, res.notes, res.price, res.availableQuantity, res.position ? res.position : undefined);
            // modify new TestDescriptor when class completed
            skuTests.forEach(t => { sku.addTestDescriptor(new TestDescriptor(t.id)); });

            /* Create new SKUItem */
            const skuItem = new SKUItem(res.RFID, sku);
            testResults.forEach(t => { skuItem.addTestResult(new TestResult(t.id)); });
            return skuItem;
        }
        catch (err) {
            throw err;
        }
    };

    getAllSKUItems = async () => {
        try {
            let skuItems = [];
            let sql = "SELECT * FROM SKUItem";
            const res = await this.connectionDB.DBget(sql, []);
            if (res === undefined)
                throw { err: 404, msg: "SKUItem not found" };
            const skuItemList = result.map(r => new SKUItem(r.rfid, 0));
        /*  FOREACH NON FUNZIONA CON AWAIT E ASYNC DEVI FARE CLASSICO FOR
            skuItemList.forEach(s => {
                // move to class TestResultDAO
                sql = "SELECT * FROM TestResult WHERE RFID = ?";
                const testResults = await this.connectionDB.DBgetAll(sql, [s.rfid]);
        */       
                /* Create new SKU */
        /*
                sql = "SELECT * FROM SKU WHERE RFID = ?";
                const result = await this.connectionDB.DBgetAll(sql, [s.rfid]);
                sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
                const skuTests = await this.connectionDB.DBgetAll(sql, [result.id]);
                const sku = new SKU(res.id, res.description, res.weight, res.volume, res.notes, res.price, res.availableQuantity, res.position ? res.position : undefined);
                // modify new TestDescriptor when class completed
                skuTests.forEach(t => { sku.addTestDescriptor(new TestDescriptor(t.id)); });
        */
                /* Create new SKUItem */
        /*
                const skuItem = new SKUItem(res.RFID, sku);
                testResults.forEach(t => { skuItem.addTestResult(new TestResult(t.id)); });

                skuItems.append(skuItem);
            });
        */
            return skuItems;
        }
        catch (err) {
            throw err;
        }
    };

    modifySKUItem = async (rfid, newRFID, newDate, newAvilable) => {
        let sql = "UPDATE SKUItem SET RFID = ?, DateOfStock = ?, Available = ? WHERE RFID = ?";
        const res = await this.connectionDB.DBexecuteQuery(sql, [newRFID, newDate, newAvilable, rfid]);
        return res.newRFID;
    }

    deleteSKUItem = async (rfid) => {
        try {
            // check consistency of the DB 
            let sql = "SELECT COUNT(*) AS num FROM SKU WHERE RFID = ?";        // check SKU
            let res = await this.connectionDB.DBget(sql, [rfid]);
            if (res.num !== 0)
                throw { err: 422, msg: "Cannot delete SKUItem" };
            sql = "SELECT COUNT(*) AS num FROM TestResult WHERE RFID = ?";     // check TestResult
            res = await this.connectionDB.DBget(sql, [rfid]);
            if (res.num !== 0)
                throw { err: 422, msg: "Cannot delete SKUItem" };

            sql = "DELETE FROM SKUItem WHERE id = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [rfid]);     // delete SKUItem
            if (res.changes === 0)      // rfid not found
                throw { err: 404, msg: "SKUItem not found" };
            return res.changes;
        }
        catch (err) {
            throw err;
        }
    }

}

module.exports = SKUItemDAO;