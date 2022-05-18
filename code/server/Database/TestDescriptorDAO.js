'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const TestDescriptor = require('../Model/TestDescriptor');

class TestDescriptorDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
        this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "TestDescriptor" ("id" INTEGER NOT NULL UNIQUE, "name" TEXT NOT NULL, "procedureDescription" TEXT NOT NULL, "idSKU" INTEGER NOT NULL, PRIMARY KEY("id"));');
    }

    getAllTestDescriptor = async () => {
        try{
            let sql = "SELECT * FROM TestDescriptor";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const testDescriptorList = result.map(r => new TestDescriptor(r.id, r.name, r.procedureDescription, r.idSKU));
            return testDescriptorList;
        }
        catch(err){
            throw err;
        }
    }

    getTestDescriptor = async (id) => {
        try{
            let sql = "SELECT * FROM TestDescriptor WHERE id = ?";
            const res = await this.connectionDB.DBget(sql, [id]);
            if(res === undefined)
                throw {err : 404, msg : "Test descriptor not found"};
            const td = new TestDescriptor(res.id, res.name, res.procedureDescription, res.idSKU);
            return td;
        }
        catch(err){
            throw err;
        }
    }

    newTestDescriptor = async (name, procedureDescription, idSKU) => {
        try{
            const sql = "INSERT INTO TestDescriptor(name, procedureDescription, idSKU) VALUES(?, ?, ?)";
            const res = await this.connectionDB.DBexecuteQuery(sql, [name, procedureDescription, idSKU]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    }

    updateTestDescriptor = async (id, newName, newProcedureDescription, newIdSKU) => {
        try{
            let sql = "UPDATE TestDescriptor SET name = ?, procedureDescription = ?, idSKU = ?, WHERE id = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newName, newProcedureDescription, newIdSKU, id]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    }

    deleteTestDescriptor = async (id) => {
        try{
            sql = "DELETE FROM TestDescriptor WHERE id = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [id]);
            return res.changes;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = TestDescriptorDAO;