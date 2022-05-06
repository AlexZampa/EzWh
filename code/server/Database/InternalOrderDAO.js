'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const SkuDAO = require('./SkuDAO');
const SKUItemDAO = require('./SKUItemDAO');
const InternalOrder = require('../Model/InternalOrder');

buildInternalOrder = (io) => {
    let sql = "SELECT SKU, qty FROM InternalOrderProduct WHERE internalOrder=?";
    const productList = this.connectionDB.DBgetAll(sql, io.getId());
    for(const p of productList){
        const sku = SkuDAO.getSKU(p.SKU);
        io.addSKU(sku, p.qty);
    }
    sql = "SELECT SKUItem FROM InternalOrderSKUItems WHERE internalOrder=?";
    const skuItemList = this.connectionDB.DBgetAll(sql, io.getId());
    io.deliveredProducts.concat(skuItemList.map(id => SKUItemDAO.getSKUItem(id.SKUItem)));
}
 
class InternalOrderDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery("CREATE TABLE IF NOT EXISTS InternalOrder (id NUMBER PRIMARY KEY, issueDate DATETIME, internalCustomer NUMBER, state VARCHAR(20)), FOREIGN KEY (internalCustomer) REFERENCES user.id) ", []);
        this.connectionDB.DBexecuteQuery("CREATE TABLE IF NOT EXISTS InternalOrderProduct ( internalOrder NUMBER, SKU NUMBER, qty NUMBER, PRIMARY KEY (internalOrder, SKU), FOREIGN KEY (internalOrder) REFERENCES InternalOrder.id, FOREIGN KEY (SKU) REFERENCES SKU.id)", []);
        this.connectionDB.DBexecuteQuery("CREATE TABLE IF NOT EXISTS InternalOrderSKUItems ( internalOrder NUMBER, SKUItem NUMBER, PRIMARY KEY (internalOrder, SKUItem) FOREIGN KEY (internalOrder) REFERENCES InternalOrder.id, FOREIGN KEY (SKUItem) REFERENCES SKUItem.id ", [])
    }

    newInternalOrder = async (issueDate, products, customerId, state) => {
        let sql = "INSERT INTO InternalOrder(issueDate, internalCustomer, state) VALUES(?, ?, ?)";
        const res = await this.connectionDB.DBexecuteQuery(sql, [issueDate, customerId, state]);

        sql = "INSERT INTO InternalOrderProduct(internalOrder, SKU, qty) VALUES(?, ?, ?)"
        for(const prod of products){
            this.connectionDB.DBexecuteQuery(sql, [res.lastID, prod.sku.getId(), prod.qty]);
        }
        return res.lastID;
    };

    getAllInternalOrders = async () => {
        let sql = "SELECT * FROM InternalOrder";
        const result = await this.connectionDB.DBgetAll(sql, []);
        const internalOrders = result.map(r => new InternalOrder(r.id, r.customerId, r.issueDate));

        for(const io of internalOrders){
            buildInternalOrder(io);
        }

        return internalOrders;
    }

    getAllIssued = async () => {
        let sql = "SELECT * FROM InternalOrder WHERE state='ISSUED'";
        const result = await this.connectionDB.DBgetAll(sql, []);
        const internalOrders = result.map(r => new InternalOrder(r.id, r.customerId, r.issueDate));

        for(const io of internalOrders){
            buildInternalOrder(io);
        }

        return internalOrders;
    }

    getAllAccepted = async () => {
        let sql = "SELECT * FROM InternalOrder WHERE state='ACCEPTED";
        const result = await this.connectionDB.DBgetAll(sql, []);
        const internalOrders = result.map(r => new InternalOrder(r.id, r.customerId, r.issueDate));

        for(const io of internalOrders){
            buildInternalOrder(io);
        }

        return internalOrders;
    }

    getInternalOrder = async (ID) => {
        let sql = "SELECT * FROM InternalOrder WHERE id=?";
        const result = await this.connectionDB.DBget(sql, [ID]);
        const io = new InternalOrder(result.id, result.customerId, result.issueDate);
        buildInternalOrder(io);

        return io;
    }

    addDeliveredProducts = async (ID, SKUItemList) => {
        const sql = "INSERT INTO InternalOrderSKUItems(internalOrder, SKUItem) VALUES(?, ?) ";
        for(const i of SKUItemList){
            this.connectionDB.DBexecuteQuery(sql, [ID, i.getId()]);
        }
    }

    setStatus = async (ID, newState) => {
        const sql = "UPDATE TABLE InternalOrder SET state=? WHERE id=?";
        this.connectionDB.DBexecuteQuery(sql, [newState, ID]);
    }

    deleteInternalOrder = async (ID) => {
        let sql = "DELETE FROM InternalOrderSKUItems WHERE internalOrder=?";
        this.connectionDB.DBexecuteQuery(sql, [ID]);
        sql = "DELETE FROM InternalOrderProduct WHERE internalOrder=?";
        this.connectionDB.DBexecuteQuery(sql, [ID]);
        sql = "DELETE FROM InternalOrder WHERE id=?";
        this.connectionDB.DBexecuteQuery(sql, [ID]);
    }






}

module.exports = InternalOrderDAO;