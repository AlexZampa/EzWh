'use strict';
const sqlite = require('sqlite3');
const ReturnOrder = require('../Model/ReturnOrder');
const RestockOrderDAO = require('../Database/RestockOrderDAO');

buildReturnOrder = (res, connectionDB) => {
    const restockOrderDAO = new RestockOrderDAO;

    //Retrieve RestockOrder
    restockOrder = restockOrderDAO.getRestockOrder(res.restockOrderId);

    //Retrieve products
    const sql = "SELECT * FROM ReturnOrderProduct WHERE returnOrder =?";
    const products = await connectionDB.DBgetAll(sql, [res.id]);
    products = products.map(p => {
        return{
            SKUId : p.SKUId,
            description : p.description,
            price : p.price,
            RFID : p.SKUItem
        }
    });

    result = new ReturnOrder(res.id, restockOrder, res.returnDate, products);
    return result;
}

class ReturnOrderDAO {
    constructor(db) {
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery("CREATE TABLE IF NOT EXISTS ReturnOrder (id NUMBER PRIMARY KEY, returnDate DATETIME, restockOrderId NUMBER), FOREIGN KEY (restockOrderId) REFERENCES RestockOrder.id) ", []);
        this.connectionDB.DBexecuteQuery("CREATE TABLE IF NOT EXISTS ReturnOrderProduct ( returnOrder NUMBER, SKUItem NUMBER, SKUId NUMBER, description VARCHAR(100), price DOUBLE, PRIMARY KEY (returnOrder, SKUItem), FOREIGN KEY (returnOrder) REFERENCES ReturnOrder.id, FOREIGN KEY (SKUItem) REFERENCES SKUItem.RFID, FOREIGN KEY (SKUId) REFERENCES SKU.id)", []);
    }

    newReturnOrder = async (products, restockOrderId, returnDate) => {
        const sql = 'INSERT INTO ReturnOrder(restockOrderId, returnDate) VALUES(?, ?)';
        const result = await this.connectionDB.DBexecuteQuery(sql, [restockOrderId, returnDate]);
        sql = "INSERT INTO ReturnOrderProduct(returnOrder, SKUItem, SKUId, description, price) VALUES(?, ?, ?, ?)"
        for (const prod of products) {
            this.connectionDB.DBexecuteQuery(sql, [result.lastId, prod.RFID, prod.SKUId, prod.description, prod.price]);
        }
        return result;
    };

    getReturnOrderById = async (returnOrderID) => {

        try {
            let sql = "SELECT * FROM ReturnOrder WHERE id = ?";
            const res = await this.connectionDB.DBget(sql, [returnOrderID]);
            if (res === undefined)
                throw { err: 404, msg: "ReturnOrder not found" };
            
            result = buildReturnOrder(res, this.connectionDB);
            return result;
        }
        catch (err) {
            throw err;
        }
    };

    getAllReturnOrders = async () => {
        const restockOrderDAO = new RestockOrderDAO;
        try {
            let sql = "SELECT * FROM ReturnOrder";
            const res = await this.connectionDB.DBgetAll(sql, []);
            if (res === undefined)
                 throw { err: 404, msg: "RestockOrder not found" };
            
            const returnOrderList = res.map(r => buildReturnOrder(r, this.connectionDB));
            return returnOrderList;
        }
        catch (err) {
            throw err;
        }
    };

    deleteReturnOrder = async (returnOrderID) => {
        try {
            sql = "DELETE FROM ReturnOrderProduct WHERE ID = ?";     
            res = await this.connectionDB.DBget(sql, [returnOrderID]);
            
            sql = "DELETE FROM ReturnOrder WHERE id = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [returnOrderID]);    
            if (res.changes === 0)     
                throw { err: 404, msg: "RestockOrder not found" };
            return res.changes;
        }
        catch (err) {
            throw err;
        }
    };

}

module.exports = ReturnOrderDAO;