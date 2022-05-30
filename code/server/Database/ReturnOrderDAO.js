'use strict';
const sqlite = require('sqlite3');
const ReturnOrder = require('../Model/ReturnOrder');
const RestockOrderDAO = require('../Database/RestockOrderDAO');
const ConnectionDB = require('./ConnectionDB');
const dayjs = require('dayjs');

const buildReturnOrder = async (res, connectionDB) => {

    //Retrieve products
    const sql = "SELECT * FROM ReturnOrderProduct WHERE returnOrder =?";
    let products = await connectionDB.DBgetAll(sql, [res.id]);
    products = await products.map(p => {
        return{
            SKUId : p.SKUId,
            description : p.description,
            price : p.price,
            RFID : p.SKUItem
        }
    });

    let result = new ReturnOrder(res.id, res.restockOrderId, dayjs(res.returnDate), products);
    return result;
}

class ReturnOrderDAO {
    constructor() {
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "ReturnOrder" ("id" INTEGER NOT NULL UNIQUE, "returnDate" DATETIME NOT NULL, "restockOrderId" INTEGER NOT NULL, PRIMARY KEY("id")) ', []);
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "ReturnOrderProduct" ( "returnOrder" INTEGER NOT NULL, "SKUItem" TEXT NOT NULL, "SKUId" INTEGER NOT NULL, "description" VARCHAR(100), "price" DOUBLE, PRIMARY KEY ("returnOrder", "SKUItem"))', []);
    }

    newReturnOrder = async (products, restockOrderId, returnDate) => {
        let sql = 'INSERT INTO ReturnOrder(restockOrderId, returnDate, restockOrderId) VALUES(?, ?, ?)';
        const result = await this.connectionDB.DBexecuteQuery(sql, [restockOrderId, returnDate, restockOrderId]);
        sql = "INSERT INTO ReturnOrderProduct(returnOrder, SKUItem, SKUId, description, price) VALUES(?, ?, ?, ?, ?)"
        products.forEach(async p => {
            const res = await this.connectionDB.DBexecuteQuery(sql, [result.lastID, p.RFID, p.SKUId, p.description, p.price]);
        });
        
        return result;
    };

    getReturnOrderById = async (returnOrderID) => {

        try {
            let sql = "SELECT * FROM ReturnOrder WHERE id = ?";
            const res = await this.connectionDB.DBget(sql, [returnOrderID]);
            if (res === undefined)
                throw { err: 404, msg: "ReturnOrder not found" };
            
            let result = buildReturnOrder(res, this.connectionDB);
            return result;
        }
        catch (err) {
            throw err;
        }
    };

    getAllReturnOrders = async () => {
        
        try {
            let sql = "SELECT * FROM ReturnOrder";
            const res = await this.connectionDB.DBgetAll(sql, []);
            
            const returnOrderList = [];
            for(const ro of res){
                returnOrderList.push(await buildReturnOrder(ro, this.connectionDB));
            }
            return returnOrderList;
            
        }
        catch (err) {
            throw err;
        }
    };

    deleteReturnOrder = async (returnOrderID) => {
        try {
            let sql = "DELETE FROM ReturnOrderProduct WHERE returnOrder = ?";     
            let res = await this.connectionDB.DBget(sql, [returnOrderID]);
            
            sql = "DELETE FROM ReturnOrder WHERE id = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [returnOrderID]);    
            if (res.changes === 0)     
                throw { err: 404, msg: "ReturnOrder not found" };
            return res.changes;
        }
        catch (err) {
            throw err;
        }
    };

    resetTable = async () => {
        try {
            let res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS ReturnOrder');
            res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS ReturnOrderProduct');
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "ReturnOrder" ("id" INTEGER PRIMARY KEY, "returnDate" DATETIME NOT NULL, "restockOrderId" INTEGER NOT NULL) ', []);
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "ReturnOrderProduct" ( "returnOrder" INTEGER NOT NULL, "SKUItem" TEXT NOT NULL, "SKUId" INTEGER NOT NULL, "description" VARCHAR(100), "price" DOUBLE, PRIMARY KEY ("returnOrder", "SKUItem"))', []);
            res = await this.connectionDB.DBexecuteQuery('INSERT INTO RestockOrder(supplierID, state, issueDate) VALUES(?, ?, ?)', [1, "ISSUED", "2022/04/25"]);
        } 
            catch (err) {
            throw err;    
        }
    };

}

module.exports = ReturnOrderDAO;