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
        const result = await this.connectionDB.DBexecuteQuery(sql, [positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid]);
        return result;
    }

    getAllPosition = async () => {
        let sql = "SELECT * FROM Position";
        const result = await this.connectionDB.DBgetAll(sql, []);
        const positions = result.map(r => new Position(r.positionID, r.aisle, r.row, r.col, r.maxWeight, r.maxVolume, r.occupiedWeight, r.occupiedVolume, r.assignedSKUid ? r.assignedSKUid : undefined));
        return positions;
    };

}

module.exports = PositionDAO;