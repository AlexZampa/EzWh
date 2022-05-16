"use strict";
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const TestResult = require('../Model/TestResult');

class TestResultDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
    }

    getAllTestResult = async (rfid) => {
        try{
            let sql = "SELECT * FROM TestResult WHERE rfid = ?";
            const result = await this.connectionDB.DBgetAll(sql, [rfid]);
            const trList = result.map(r => new TestResult(r.id, r.rfid, r.idTestDescriptor, r.date, r.result));
            return trList;
        }
        catch(err){
            throw err;
        }
    }

    getTestResult = async (rfid, id) => {
        try{
            let sql = "SELECT * FROM TestResult WHERE (rfid = ?) AND (id = ?)";
            const result = await this.connectionDB.DBgetAll(sql, [rfid, id]);
            const tr = new TestResult(r.id, r.rfid, r.idTestDescriptor, r.date, r.result);
            return tr;
        }
        catch(err){
            throw err;
        }
    }

    newTestResult = async (rfid, idTestDescriptor, date, result) => {
        try{
            const sql = "INSERT INTO TestResult(rfid, idTestDescriptor, Date, Result) VALUES(?, ?, ?, ?)";
            const res = await this.connectionDB.DBexecuteQuery(sql, [rfid, idTestDescriptor, date, result]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    }

    updateTestResult = async (id, rfid, newIdTestDescriptor, newDate, newResult) => {
        try{
            let sql = "UPDATE TestResult SET idTestDescription = ?, Date = ?, Result = ? WHERE (rfid = ?) AND (id = ?) ";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newIdTestDescriptor, newDate, newResult, rfid, id]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    }

    deleteTestResult = async (id, rfid) => {
        try{
            sql = "DELETE FROM TestResult WHERE (rfid = ?) AND (id = ?)";
            res = await this.connectionDB.DBexecuteQuery(sql, [id, rfid]);     // delete SKU
            return res.changes;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = TestResultDAO;