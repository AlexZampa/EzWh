'use strict'

class Position{

    constructor(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight=0, occupiedVolume=0, assignedSKU=undefined){
        this.positionID = positionID;
        this.aisle = aisle;
        this.row = row;
        this.col = col;
        this.maxWeight = maxWeight;
        this.maxVolume = maxVolume;
        this.occupiedWeight = occupiedWeight;
        this.occupiedVolume = occupiedVolume;
        this.assignedSKU = assignedSKU;
    }

    getPositionID = () => this.positionID;
    getAisle = () => this.aisle;
    getRow = () => this.row;
    getCol = () => this.col;
    getMaxWeight = () => this.maxWeight;
    getMaxVolume = () => this.maxVolume;
    getOccupiedWeight = () => this.occupiedWeight;
    getOccupiedVolume = () => this.occupiedVolume;

    setAssignedSKU = (sku) => {this.assignedSKU = sku};

};


module.exports = Position;