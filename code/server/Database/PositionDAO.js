'use strict';
const sqlite = require('sqlite3');
const ConnectionDB = require('./ConnectionDB');
const SKU = require('../Model/Sku');
const Position = require('../Model/Position');

class PositionDAO{

    constructor(){
        this.connectionDB = new ConnectionDB();
    };

    newPosition = async (positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid) => {
        const sql = "INSERT INTO Position(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const res= await this.connectionDB.DBexecuteQuery(sql, [positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid]);
        if(res.changes === 0)      // positionID not unique
            return undefined;
        return res.lastID;
    }

    getAllPosition = async () => {
        let sql = "SELECT * FROM Position";
        const result = await this.connectionDB.DBgetAll(sql, []);
        const positions = result.map(r => new Position(r.positionID, r.aisle, r.row, r.col, r.maxWeight, r.maxVolume, r.occupiedWeight, r.occupiedVolume, r.assignedSKUid ? r.assignedSKUid : undefined));
        return positions;
    };

    getPosition = async (positionID) => {
        let sql = "SELECT * FROM Position WHERE positionID = ?";
        const res = await this.connectionDB.DBget(sql, [positionID]);
        const positions = new Position(res.positionID, res.aisle, res.row, res.col, res.maxWeight, res.maxVolume, res.occupiedWeight, 
                res.occupiedVolume, res.assignedSKUid ? res.assignedSKUid : undefined);
        return positions;
    };

    deletePosition  = async (positionID) => {
        // check consistency of the DB 
        let sql = "SELECT COUNT(*) AS num FROM SKU WHERE position = ?";        // check SKU
        let res = await this.connectionDB.DBget(sql, [positionID]);
        if(res.num !== 0)
            return undefined;
        sql = "DELETE FROM Position WHERE positionID = ?";
        res = await this.connectionDB.DBexecuteQuery(sql, [positionID]);
        if(res.changes === 0)      // positionID not found
            return undefined;
        return res.changes;
    };

}

module.exports = PositionDAO;