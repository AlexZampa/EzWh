'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const SKU = require('../Model/Sku');
const { Position } = require('../Model/Position');

class PositionDAO{

    constructor(){
        this.connectionDB = new ConnectionDB();
    };

    newPosition = async (positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid) => {
        try{
            const sql = "INSERT INTO Position(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const res = await this.connectionDB.DBexecuteQuery(sql, [positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid]);
            if(res.changes === 0)      // positionID not unique
                throw {err : 422, msg : "positionID not unique"};
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    }

    getAllPosition = async () => {
        try{
            let sql = "SELECT * FROM Position";
            const result = await this.connectionDB.DBgetAll(sql, []);
            const positions = result.map(r => new Position(r.positionID, r.aisle, r.row, r.col, r.maxWeight, r.maxVolume, r.occupiedWeight, r.occupiedVolume, r.assignedSKUid ? r.assignedSKUid : undefined));
            return positions;
        }
        catch(err){
            throw err;
        }
    };

    getPosition = async (positionID) => {
        try{
            let sql = "SELECT * FROM Position WHERE positionID = ?";
            const res = await this.connectionDB.DBget(sql, [positionID]);
            if(res === undefined)
                throw {err : 404, msg : "Position not found"};
            const positions = new Position(res.positionID, res.aisle, res.row, res.col, res.maxWeight, res.maxVolume, res.occupiedWeight, 
                res.occupiedVolume, res.assignedSKUid ? res.assignedSKUid : undefined);
            return positions;
        }
        catch(err){
            throw err;
        }
    };

    updatePosition = async (oldPositionID, newPositionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) => {
        try{
            let sql = "SELECT COUNT(*) AS num FROM Position WHERE positionID = ?";
            let res = await this.connectionDB.DBget(sql, [newPositionID]);
            if(res.num > 0)     // newPositionID not unique
                throw {err : 422, msg : "positionID not unique"};
            sql = "UPDATE Position SET positionID = ?, aisle = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [newPositionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, oldPositionID]);
            sql = "UPDATE SKU SET position = ? WHERE position = ?";
            await this.connectionDB.DBexecuteQuery(sql, [newPositionID, oldPositionID]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    };

    deletePosition  = async (positionID) => {
        try{
            // check consistency of the DB 
            let sql = "SELECT COUNT(*) AS num FROM SKU WHERE position = ?";        // check SKU
            let res = await this.connectionDB.DBget(sql, [positionID]);
            if(res.num !== 0)
                throw {err : 422, msg : "Cannot delete Position"};
            sql = "DELETE FROM Position WHERE positionID = ?";
            res = await this.connectionDB.DBexecuteQuery(sql, [positionID]);
            if(res.changes === 0)      // positionID not found
                throw {err : 404, msg : "Position not found"};
            return res.changes;
        }
        catch(err){
            throw err;
        }
    };

}

module.exports = PositionDAO;