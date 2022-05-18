"use strict";
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const TestResult = require('../Model/TestResult');

class TestResultDAO{

    constructor(db){
        this.connectionDB = new ConnectionDB();
        // aggiunger CREATE TABLE IF NOT EXISTS: testare se campo Result come BOOL (non so se funziona) o INTEGER
        // this.connectionDB.DBexecuteQuery('');
    }

    getAllTestResult = async (rfid) => {
        try{
            let sql = "SELECT * FROM TestResult WHERE rfid = ?";
            const res = await this.connectionDB.DBgetAll(sql, [rfid]);
            const trList = res.map(r => new TestResult(r.id, r.rfid, r.idTestDescriptor, r.Date, r.Result));
            return trList;
        }
        catch(err){
            throw err;
        }
    }

    getTestResult = async (rfid, id) => {
        try{
            let sql = "SELECT * FROM TestResult WHERE (rfid = ?) AND (id = ?)";
            const res = await this.connectionDB.DBget(sql, [rfid, id]);
            if(res === undefined)
                throw {err : 404, msg : "Test result not found"};
            const tr = new TestResult(res.id, res.rfid, res.idTestDescriptor, res.Date, res.Result);
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
            let sql = "UPDATE TestResult SET idTestDescriptor = ?, Date = ?, Result = ? WHERE (rfid = ?) AND (id = ?) ";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newIdTestDescriptor, newDate, newResult, rfid, id]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    }

    deleteTestResult = async (id, rfid) => {
        try{
            const sql = "DELETE FROM TestResult WHERE (rfid = ?) AND (id = ?)";
            const res = await this.connectionDB.DBexecuteQuery(sql, [rfid, id]);
            return res.changes;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = TestResultDAO;