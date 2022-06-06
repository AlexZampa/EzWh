'use strict';
const sqlite = require('sqlite3');
const {RestockOrder} = require('../Model/RestockOrder');
const ConnectionDB = require('./ConnectionDB');


class RestockOrderDAO {
    constructor(db) {
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "RestockOrder" ("id" INTEGER NOT NULL UNIQUE, "supplierID" INTEGER NOT NULL, "state" TEXT NOT NULL, "issueDate" TEXT NOT NULL,"transportNote" TEXT, PRIMARY KEY("id"));');
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "RestockOrderProduct" ("restockOrderID" INTEGER NOT NULL, "SKUId" INTEGER NOT NULL, "description" TEXT NOT NULL, "price"	NUMERIC NOT NULL, "quantity" INTEGER NOT NULL, PRIMARY KEY("restockOrderID","SKUId"));');
    }

    newRestockOrder = async (products, state, supplierID, issueDate, transportNote) => {
        try {
            let sql = 'INSERT INTO RestockOrder(supplierID, state, issueDate, transportNote) VALUES(?, ?, ?, ?)';
            let result = await this.connectionDB.DBexecuteQuery(sql, [supplierID, state, issueDate, transportNote]);
            sql = "INSERT INTO RestockOrderProduct(restockOrderID, SKUId, description, price, quantity) VALUES(?, ?, ?, ?, ?)";
            for(const prod of products) {
                // result.lastID = RestockOrderID
                let res = this.connectionDB.DBexecuteQuery(sql, [result.lastID, prod.SKUId, prod.description, prod.price, prod.qty]);
            }
            return result.lastID;
        } catch(err){
            throw err;
        }
        
    };

    getRestockOrder = async (restockOrderID) => {
        try{
            let sql = "SELECT * FROM RestockOrder WHERE id = ?";
            const res = await this.connectionDB.DBget(sql, [restockOrderID]);
            if(res === undefined)
                throw {err : 404, msg : "RestockOrder not found"};
            const restockOrder = new RestockOrder(res.id, res.issueDate, res.supplierID, res.state, res.transportNote ? res.transportNote : undefined);
            sql = "SELECT * FROM RestockOrderProduct WHERE restockOrderID = ?";
            const products = await this.connectionDB.DBgetAll(sql, [restockOrderID]);
            products.forEach(p => restockOrder.addProduct(p.SKUId, p.description, p.price, p.quantity));
            return restockOrder;
        }
        catch (err) {
            throw err;
        }
    };

    getAllRestockOrders = async () => {
        try {
            let sql = "SELECT * FROM RestockOrder";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const restockOrderList = result.map(r => new RestockOrder(r.id, r.issueDate, r.supplierID, r.state ,r.transportNote ? r.transportNote : undefined));
            sql = "SELECT * FROM RestockOrderProduct WHERE restockOrderID = ?";
            for(const ro of restockOrderList){
                const products = await this.connectionDB.DBgetAll(sql, [ro.getID()]);
                products.forEach(p => ro.addProduct(p.SKUId, p.description, p.price, p.quantity));
            }
            return restockOrderList;
        }
        catch (err) {
            throw err;
        }
    };

    updateRestockOrder = async (restockOrderID, newState, transportNote) => {
        try{
            let sql = "UPDATE RestockOrder SET state = ?, transportNote = ? WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newState, transportNote, restockOrderID]);
            return true;
        } catch(err) {
            throw err;
        }
    };

    deleteRestockOrder = async (restockOrderID) => {
        try {
            let sql = "DELETE FROM RestockOrderProduct WHERE restockOrderID = ?";     // delete product
            let res = await this.connectionDB.DBexecuteQuery(sql, [restockOrderID]);
            
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

    resetTable = async () => {
        try {
            let res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS RestockOrder');
            res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS RestockOrderProduct');
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "RestockOrder" ("id" INTEGER NOT NULL UNIQUE, "supplierID" INTEGER NOT NULL, "state" TEXT NOT NULL, "issueDate" TEXT NOT NULL,"transportNote" TEXT, PRIMARY KEY("id"));');
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "RestockOrderProduct" ("restockOrderID" INTEGER NOT NULL, "SKUId" INTEGER NOT NULL, "description" TEXT NOT NULL, "price"	NUMERIC NOT NULL, "quantity" INTEGER NOT NULL, PRIMARY KEY("restockOrderID","SKUId"));');
        } catch (err) {
            throw err;
        }
    };

}

module.exports = RestockOrderDAO;