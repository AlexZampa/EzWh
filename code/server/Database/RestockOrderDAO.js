'use strict';
const sqlite = require('sqlite3');
const {RestockOrder} = require('../Model/RestockOrder');
const SKUItem = require('../Model/SKUItem');
const SKU = require('../Model/SKU');
const TestDescriptor = require('../Model/TestDescriptor');
const TestResult = require('../Model/TestResult');
const ConnectionDB = require('./ConnectionDB');

/**
 * TABLE (possible solution)
 * RestockOrder (id, supplierID, issueDate, state, transportNote)  id with AUTOINCREMENT
 * RestockOrderProduct (restockOrderID, skuID, description, price, quantity)  -->  primary key are restockOrderID e skuID
 * SKUitem (....., restockOrderID)  NULL when not needed
 */

class RestockOrderDAO {
    constructor(db) {
        this.connectionDB = new ConnectionDB();
    }

    newRestockOrder = async (products, supplierID, issueDate) => {
        try{
            let sql = 'INSERT INTO RestockOrder(supplierID, state, issueDate) VALUES(?, "ISSUED", ?)';
            const result = await this.connectionDB.DBexecuteQuery(sql, [supplierID, issueDate]);
            sql = "INSERT INTO RestockOrderProduct(RestockOrderID, skuID, description, price, quantity) VALUES(?, ?, ?, ?, ?)";
            for(const prod of products) {
                // result.lastID = RestockOrderID
                this.connectionDB.DBexecuteQuery(sql, [result.lastID, prod.SKUId, prod.description, prod.price, prod.qty]);
            }
            return result;
        } catch(err){
            throw err;
        }
        
    };

    getRestockOrder = async (restockOrderID) => {
        try{
            let sql = "SELECT * FROM RestockOrder WHERE id = ?";
            const res = await this.connectionDB.DBget(sql, [restockOrderID]);
            if(res === undefined)
                throw {err : 404, msg : "Restock Order not found"};
            const restockOrder = new RestockOrder(res.id, res.issueDate, res.supplierID, res.state, res.transportNote ? res.transportNote : undefined);
            sql = "SELECT * FROM RestockOrderProduct WHERE restockOrderID = ?";
            const products = await this.connectionDB.DBgetAll(sql, [restockOrder.getID()]);
            products.forEach(p => restockOrder.addProduct(p.skuID, p.description, p.price, p.quantity));
            return restockOrder;
        }
        catch (err) {
            throw err;
        }
    };

    getRestockOrders = async () => {
        try {
            let sql = "SELECT * FROM RestockOrder";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const restockOrderList = result.map(r => new RestockOrder(r.id, r.issueDate, r.supplierID, r.state ,r.transportNote ? r.transportNote : undefined));
            sql = "SELECT * FROM RestockOrderProduct WHERE restockOrderID = ?";
            for(const ro of restockOrderList){
                const products = await this.connectionDB.DBgetAll(sql, [ro.getID()]);
                products.forEach(p => ro.addProduct(p.skuID, p.description, p.price, p.quantity));
            }
            return restockOrderList;
        }
        catch (err) {
            throw err;
        }
    };

    updateRestockOrder = async (restockOrderID, newState, transportNote=undefined) => {
        let sql = "UPDATE RestockOrder SET state = ?, transportNote = ? WHERE id = ?";
        const res = await this.connectionDB.DBexecuteQuery(sql, [newState, transportNote ? transportNote : null, restockOrderID]);
        return true;
    };

    addSKUItems = async (restockOrderID, SKUItemIdList) => {
        try {
           // TODO in skuItemDAO
        } catch (err) {
            throw err;
        }
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