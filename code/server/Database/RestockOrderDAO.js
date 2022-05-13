'use strict';
const sqlite = require('sqlite3');
const {RestockOrder} = require('../Model/RestockOrder');
const SKUItem = require('../Model/SKUItem');
const SKU = require('../Model/SKU');
const TestDescriptor = require('../Model/TestDescriptor');
const TestResult = require('../Model/TestResult');
const ConnectionDB = require('./ConnectionDB');


class RestockOrderDAO {
    constructor(db) {
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "RestockOrder" ("id" INTEGER NOT NULL UNIQUE, "supplierID" INTEGER NOT NULL, "state" TEXT NOT NULL, "issueDate" TEXT NOT NULL,"transportNote" TEXT, PRIMARY KEY("id"));');
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "RestockOrderProduct" ("restockOrderID" INTEGER NOT NULL, "skuID" INTEGER NOT NULL, "description" TEXT NOT NULL, "price"	NUMERIC NOT NULL, "quantity" INTEGER NOT NULL, PRIMARY KEY("restockOrderID","skuID"));');
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
            console.log(restockOrderList);
            return restockOrderList;
        }
        catch (err) {
            throw err;
        }
    };

    updateRestockOrder = async (restockOrderID, newState, transportNote=undefined) => {
        try{
            let sql = "UPDATE RestockOrder SET state = ?, transportNote = ? WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newState, transportNote ? transportNote : null, restockOrderID]);
            return true;
        } catch(err) {
            throw err;
        }
    };

    deleteRestockOrder = async (restockOrderID) => {
        try {
            // check consistency of the DB 
            let sql = "SELECT COUNT(*) AS num FROM SKUItem WHERE restockOrderID = ?";     // check SKUItems   
            let res = await this.connectionDB.DBget(sql, [restockOrderID]);
            if (res.num !== 0)
                throw { err: 422, msg: "Cannot delete Restock Order" };
            
            sql = "DELETE FROM RestockOrderProduct WHERE restockOrderID = ?";     // delete product
            res = await this.connectionDB.DBexecuteQuery(sql, [restockOrderID]);
            
            sql = "DELETE FROM RestockOrder WHERE id = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [restockOrderID]);    // delete Restock Order
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