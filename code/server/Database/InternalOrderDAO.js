'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const InternalOrder = require('../Model/InternalOrder');
const dayjs = require('dayjs');

const buildInternalOrder = async (io, connectionDB) => {
    let sql = "SELECT SKU, description, price, qty FROM InternalOrderProduct WHERE internalOrder=?";

    if (io.state !== "COMPLETED") {
        const productList = await connectionDB.DBgetAll(sql, io.getId());
        for (const p of productList) {
            io.addProduct(p.SKU, p.price, p.description, p.qty);
        }
    } else {
        sql = "SELECT SKUId, description, price, rfid FROM InternalOrderSKUItems WHERE internalOrder=?";
        const productList = await connectionDB.DBgetAll(sql, io.getId());
        for (const p of productList) {
            io.addProduct(p.SKUId, p.price, p.description, undefined, p.rfid);
        }
    }
    return io;
}

class InternalOrderDAO {

    constructor(db) {
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "InternalOrder" ("id" INTEGER PRIMARY KEY, "issueDate" DATETIME NOT NULL, "internalCustomer" INTEGER, "state" VARCHAR(20) NOT NULL); ', []);
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "InternalOrderProduct" ( "internalOrder" INTEGER NOT NULL, "SKU" INTEGER NOT NULL, "description" VARCHAR(100), "price" NUMERIC, "qty" INTEGER, PRIMARY KEY ("internalOrder", "SKU"));', []);
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "InternalOrderSKUItems" ( "internalOrder" INTEGER NOT NULL, "SKUId" INTEGER NOT NULL, "description" VARCHAR(100), "price" NUMERIC, "rfid" TEXT, PRIMARY KEY ("internalOrder", "SKUId"));', []);
    }

    newInternalOrder = async (issueDate, products, customerId, state) => {

        try {
            let sql = "INSERT INTO InternalOrder(issueDate, internalCustomer, state) VALUES(?, ?, ?)";
            const res = await this.connectionDB.DBexecuteQuery(sql, [issueDate, customerId, state]);

            sql = "INSERT INTO InternalOrderProduct(internalOrder, SKU, description, price, qty) VALUES(?, ?, ?, ?, ?)"
            for (const prod of products) {
                this.connectionDB.DBexecuteQuery(sql, [res.lastID, prod.SKUId, prod.description, prod.price, prod.qty]);
            }
            return res.lastID;
        }
        catch (err) {
            throw err;
        }
    };

    getAllInternalOrders = async () => {

        try {
            let sql = "SELECT * FROM InternalOrder";
            const result = await this.connectionDB.DBgetAll(sql, []);
            let internalOrders = result.map(r => new InternalOrder(r.id, r.customerId, dayjs(r.issueDate), r.state));

            for (let io of internalOrders) {
                io = buildInternalOrder(io, this.connectionDB);
            }

            return internalOrders;
        }
        catch (err) {
            throw err;
        }
    }

    getAllIssued = async () => {

        try {
            let sql = "SELECT * FROM InternalOrder WHERE state='ISSUED'";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const internalOrders = result.map(r => new InternalOrder(r.id, r.customerId, dayjs(r.issueDate), r.state));

            for (let io of internalOrders) {
                io = buildInternalOrder(io, this.connectionDB);
            }

            return internalOrders;
        }
        catch (err) {
            throw err;
        }

    }

    getAllAccepted = async () => {

        try {
            let sql = "SELECT * FROM InternalOrder WHERE state='ACCEPTED'";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const internalOrders = result.map(r => new InternalOrder(r.id, r.customerId, dayjs(r.issueDate), r.state));

            for (let io of internalOrders) {
                io = buildInternalOrder(io, this.connectionDB);
            }

            return internalOrders;
        }
        catch (err) {
            throw err;
        }
    }

    getInternalOrder = async (ID) => {
        try {
            let sql = "SELECT * FROM InternalOrder WHERE id=?";
            const result = await this.connectionDB.DBget(sql, [ID]);
            if (result === undefined) {
                throw { err: 404, msg: "not found" };
            }

            let io = new InternalOrder(result.id, result.customerId, dayjs(result.issueDate), result.state);
            io = buildInternalOrder(io, this.connectionDB);

            return io;
        }
        catch (err) {
            throw err;
        }
    }

    addDeliveredProducts = async (ID, SKUItemList) => {

        try {
            const sql = "INSERT INTO InternalOrderSKUItems(internalOrder, SKUId, description, price, rfid) VALUES(?, ?, ?, ?, ?) ";
            for (const i of SKUItemList) {
                this.connectionDB.DBexecuteQuery(sql, [ID, i.SKUId, i.description, i.price, i.RFID]);
            }
        }
        catch (err) {
            throw err;
        }
    }

    setStatus = async (ID, newState) => {

        try {
            const sql = "UPDATE InternalOrder SET state=? WHERE id=?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newState, ID]);
            return res.changes;
        }
        catch (err) {
            throw err;
        }
    }

    deleteInternalOrder = async (ID) => {
        try {
            let sql = "DELETE FROM InternalOrderSKUItems WHERE internalOrder=?";
            let res = await this.connectionDB.DBexecuteQuery(sql, [ID]);
            sql = "DELETE FROM InternalOrderProduct WHERE internalOrder=?";
            res = await this.connectionDB.DBexecuteQuery(sql, [ID]);
            sql = "DELETE FROM InternalOrder WHERE id=?";
            res = await this.connectionDB.DBexecuteQuery(sql, [ID]);
            return res.changes;
        }
        catch (err) {
            return err;
        }
    }

    resetTable = async () => {
        try {
            let res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS InternalOrder');
            res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS InternalOrderProduct');
            res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS InternalOrderSKUItems');
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "InternalOrder" ("id" INTEGER PRIMARY KEY, "issueDate" DATETIME NOT NULL, "internalCustomer" INTEGER, "state" VARCHAR(20) NOT NULL); ', []);
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "InternalOrderProduct" ( "internalOrder" INTEGER NOT NULL, "SKU" INTEGER NOT NULL, "description" VARCHAR(100), "price" NUMERIC, "qty" INTEGER, PRIMARY KEY ("internalOrder", "SKU"));', []);
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "InternalOrderSKUItems" ( "internalOrder" INTEGER NOT NULL, "SKUId" INTEGER NOT NULL, "description" VARCHAR(100), "price" NUMERIC, "rfid" TEXT, PRIMARY KEY ("internalOrder", "SKUId"));', []);
        } catch (err) {
            throw err;
        }
    };




}

module.exports = InternalOrderDAO;