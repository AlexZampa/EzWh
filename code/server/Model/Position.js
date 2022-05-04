'use strict'

class Position{

    constructor(positionID, aisle, row, col, maxWeight, maxVolume){
        this.positionID = positionID;
        this.aisle = aisle;
        this.row = row;
        this.col = col;
        this.maxWeight = maxWeight;
        this.maxVolume = maxVolume;
    }

    getPositionID = () => this.positionID;
    getAisle = () => this.aisle;
    getRow = () => this.row;
    getCol = () => this.col;
    getMaxWeight = () => this.maxWeight;
    getMaxVolume = () => this.maxVolume;

};


module.exports = Position;