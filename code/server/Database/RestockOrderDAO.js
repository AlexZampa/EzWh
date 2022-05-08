'use strict';
const sqlite = require('sqlite3');
const RestockOrder = require('../Model/RestockOrder');
const SKUItem = require('../Model/SKUItem');
const SKU = require('../Model/SKU');
const TestDescriptor = require('../Model/TestDescriptor');
const TestResult = require('../Model/TestResult');
const ConnectionDB = require('./ConnectionDB');

let id = 0;

class RestockOrderDAO {
    constructor(db) {
        this.connectionDB = new ConnectionDB();
    }

    newRestockOrder = async (products, supplierID, issueDate) => {
        const sql = 'INSERT INTO RestockOrder(ID, SupplierID, IssueDate) VALUES(?, ?, ?, ?)';
        const result = await this.connectionDB.DBexecuteQuery(sql, [id, supplierID, issueDate]);
        sql = "INSERT INTO RestockOrderProduct(RestockOrder, SKUID, description, price, qty) VALUES(?, ?, ?)"
        for (const prod of products) {
            this.connectionDB.DBexecuteQuery(sql, [id, prod.SKUId, prod.description, prod.price, prod.qty]);
        }
        id += 1;
        return result;
    };

    getRestockOrder = async (restockOrderID) => {
        try {
            let sql = "SELECT * FROM RestockOrder WHERE ID = ?";
            const res = await this.connectionDB.DBget(sql, [restockOrderID]);
            if (res === undefined)
                throw { err: 404, msg: "RestockOrder not found" };
            // move to class SKUItem
            sql = "SELECT * FROM SKUItem WHERE ID = ?";
            const result = await this.connectionDB.DBgetAll(sql, [restockOrderID]);

            /* Create new SKUItem */
            const skuItemList = result.map(r => new SKUItem(r.rfid, 0));
            let skuItems = [];
            for (const s of skuItemList) {
                // move to class TestResultDAO
                sql = "SELECT * FROM TestResult WHERE RFID = ?";
                const testResults = await this.connectionDB.DBgetAll(sql, [s.rfid]);

                /* Create new SKU */

                sql = "SELECT * FROM SKU WHERE RFID = ?";
                const result = await this.connectionDB.DBgetAll(sql, [s.rfid]);
                sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
                const skuTests = await this.connectionDB.DBgetAll(sql, [result.id]);
                const sku = new SKU(result.id, result.description, result.weight, result.volume, result.notes, result.price, result.availableQuantity, result.position ? result.position : undefined);
                // modify new TestDescriptor when class completed
                skuTests.forEach(t => { sku.addTestDescriptor(new TestDescriptor(t.id)); });

                /* Create new SKUItem */
                const skuItem = new SKUItem(res.RFID, sku);
                skuItem.setAvailable(res.available);
                testResults.forEach(t => { skuItem.addTestResult(new TestResult(t.id, t.testDescriptor, t.date, t.result)); });

                skuItems.append(skuItem);
            }

            sql = "SELECT * FROM TransportNote WHERE ID = ?";
            const tn = await this.connectionDB.DBgetAll(sql, [restockOrderID]);
            const transportNote = new TransportNote(tn.Date);

            sql = "SELECT * FROM RestockOrderProducts WHERE ID = ?";
            const products = await this.connectionDB.DBgetAll(sql, [restockOrderID]);
            
            const restockOrder = new RestockOrder(res.ID, res.supplierID, [], res.IssueDate);
            products.forEach(t => { restockOrder.addProduct(t.SKUId,t.description, t.price, t.qty); });
            restockOrder.addSKUItems(skuItems);
            restockOrder.addTransportNote(transportNote);
            restockOrder.modifyState(res.State);

            return restockOrder;
        }
        catch (err) {
            throw err;
        }
    };

    getRestockOrders = async () => {
        try {
            let sql = "SELECT * FROM RestockOrder";
            const res = await this.connectionDB.DBget(sql, []);
            if (res === undefined)
                throw { err: 404, msg: "RestockOrder not found" };

            const restockOrderList = result.map(r => new RestockOrder(r.ID, 0, 0, r.IssueDate));
            let restockOrders = [];
            for (const ro of restockOrderList) {
                // move to class SKUItem
                sql = "SELECT * FROM SKUItem WHERE ID = ?";
                const result = await this.connectionDB.DBgetAll(sql, [ro.ID]);

                /* Create new SKUItem */
                const skuItemList = result.map(r => new SKUItem(r.rfid, 0));
                let skuItems = [];
                for (const s of skuItemList) {
                    // move to class TestResultDAO
                    sql = "SELECT * FROM TestResult WHERE RFID = ?";
                    const testResults = await this.connectionDB.DBgetAll(sql, [s.rfid]);

                    /* Create new SKU */

                    sql = "SELECT * FROM SKU WHERE RFID = ?";
                    const result = await this.connectionDB.DBgetAll(sql, [s.rfid]);
                    sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
                    const skuTests = await this.connectionDB.DBgetAll(sql, [result.id]);
                    const sku = new SKU(result.id, result.description, result.weight, result.volume, result.notes, result.price, result.availableQuantity, result.position ? result.position : undefined);
                    // modify new TestDescriptor when class completed
                    skuTests.forEach(t => { sku.addTestDescriptor(new TestDescriptor(t.id)); });

                    /* Create new SKUItem */

                    const skuItem = new SKUItem(res.RFID, sku);
                    skuItem.setAvailable(res.available);
                    testResults.forEach(t => { skuItem.addTestResult(new TestResult(t.id, t.testDescriptor, t.date, t.result)); });

                    skuItems.append(skuItem);
                }

                sql = "SELECT * FROM TransportNote WHERE ID = ?";
                const tn = await this.connectionDB.DBgetAll(sql, [ro.ID]);
                const transportNote = new TransportNote(tn.Date);

                sql = "SELECT * FROM RestockOrderProducts WHERE ID = ?";
                const products = await this.connectionDB.DBgetAll(sql, [restockOrderID]);

                const restockOrder = new RestockOrder(res.ID, res.supplierID, [], res.IssueDate);
                products.forEach(t => { restockOrder.addProduct(t.SKUId, t.description, t.price, t.qty); });
                restockOrder.addSKUItems(skuItems);
                restockOrder.addTransportNote(transportNote);
                restockOrder.modifyState(ro.State);
                restockOrders.append(restockOrder);
            }
            return restockOrders;
        }
        catch (err) {
            throw err;
        }
    };

    getRestockOrdersIssued = async () => {
        try {
            let sql = "SELECT * FROM RestockOrder";
            const res = await this.connectionDB.DBget(sql, []);
            if (res === undefined)
                throw { err: 404, msg: "RestockOrder not found" };

            const restockOrderList = result.map(r => new RestockOrder(r.ID, 0, 0, r.IssueDate));
            let restockOrders = [];
            for (const ro of restockOrderList) {
                if (ro.State !== "ISSUED") {
                    // move to class SKUItem
                    let skuItems = [];

                    sql = "SELECT * FROM RestockOrderProducts WHERE ID = ?";
                    const products = await this.connectionDB.DBgetAll(sql, [restockOrderID]);

                    const restockOrder = new RestockOrder(res.ID, res.supplierID, [], res.IssueDate);
                    products.forEach(t => { restockOrder.addProduct(t.SKUId, t.description, t.price, t.qty); });
                    restockOrder.addSKUItems(skuItems);
                    restockOrder.modifyState(ro.State);
                    restockOrders.append(restockOrder);
                }
            }
            return restockOrders;
        }
        catch (err) {
            throw err;
        }
    };

    addSKUItems = async (restockOrderID, SKUItemIdList) => {

    };

    addTransportNote = async (restockOrderID, date) => {
        let sql = 'INSERT INTO TransportNote(restockOrder, Date) VALUES(?, ?)';
        const result = await this.connectionDB.DBexecuteQuery(sql, [restockOrderID, date]);
        sql = "UPDATE RestockOrder SET TransportNote = ? WHERE ID = ?";
        const res = await this.connectionDB.DBexecuteQuery(sql, [result, restockOrderID]);
        return res.newRFID;
    };

    modifyState = async (restockOrderID, newState) => {
        let sql = "UPDATE RestockOrder SET State = ? WHERE ID = ?";
        const res = await this.connectionDB.DBexecuteQuery(sql, [newState, restockOrderID]);
        return true;
    };

    returnItems = async (restockOrderID, notPassed) => {
        try {
            let sql = "SELECT * FROM RestockOrder WHERE ID = ?";
            const res = await this.connectionDB.DBget(sql, [restockOrderID]);
            if (res === undefined)
                throw { err: 404, msg: "RestockOrder not found" };
            // move to class SKUItem
            sql = "SELECT * FROM SKUItem WHERE ID = ?";
            const result = await this.connectionDB.DBgetAll(sql, [restockOrderID]);

            /* Create new SKUItem */
            const skuItemList = result.map(r => new SKUItem(r.rfid, 0));
            let skuItems = [];
            for (const s of skuItemList) {
                // move to class TestResultDAO
                sql = "SELECT * FROM TestResult WHERE RFID = ?";
                const testResults = await this.connectionDB.DBgetAll(sql, [s.rfid]);

                /* Create new SKU */

                sql = "SELECT * FROM SKU WHERE RFID = ?";
                const result = await this.connectionDB.DBgetAll(sql, [s.rfid]);
                sql = "SELECT * FROM TestDescriptor WHERE SKUid = ?";
                const skuTests = await this.connectionDB.DBgetAll(sql, [result.id]);
                const sku = new SKU(res.id, res.description, res.weight, res.volume, res.notes, res.price, res.availableQuantity, res.position ? res.position : undefined);
                // modify new TestDescriptor when class completed
                skuTests.forEach(t => { sku.addTestDescriptor(new TestDescriptor(t.id)); });

                /* Create new SKUItem */

                const skuItem = new SKUItem(res.RFID, sku);
                skuItem.setAvailable(res.available);
                testResults.forEach(t => { skuItem.addTestResult(new TestResult(t.id)); });

                if ((skuItem.testResult.result === true && notPassed === true) || notPassed === false) {
                    skuItems.append(skuItem);
                }
            }
            return skuItems;
        }
        catch (err) {
            throw err;
        }
    };

    deleteRestockOrder = async (restockOrderID) => {
        try {
            // check consistency of the DB 
            let sql = "SELECT COUNT(*) AS num FROM SKUItem WHERE ID = ?";        
            let res = await this.connectionDB.DBget(sql, [restockOrderID]);
            if (res.num !== 0)
                throw { err: 422, msg: "Cannot delete SKUItem" };
            
            sql = "DELETE FROM TransportNote WHERE ID = ?";     
            res = await this.connectionDB.DBget(sql, [restockOrderID]);
            if (res.changes === 0)
                throw { err: 404, msg: "TransportNote not found" };
            
            sql = "DELETE FROM RestockOrderProduct WHERE ID = ?";     
            res = await this.connectionDB.DBget(sql, [restockOrderID]);
            if (res.changes === 0)
                throw { err: 404, msg: "RestockOrderProduct not found" };
            
            sql = "DELETE FROM RestockOrder WHERE id = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [restockOrderID]);    
            if (res.changes === 0)     
                throw { err: 404, msg: "RestockOrder not found" };
            return res.changes;
        }
        catch (err) {
            throw err;
        }
    };

}

module.exports = RestockOrderDAO;