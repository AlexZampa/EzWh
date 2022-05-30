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
        this.assignedSKU = assignedSKU ? assignedSKU : undefined;
    }

    getPositionID = () => this.positionID;
    getAisle = () => this.aisle;
    getRow = () => this.row;
    getCol = () => this.col;
    getMaxWeight = () => this.maxWeight;
    getMaxVolume = () => this.maxVolume;
    getOccupiedWeight = () => this.occupiedWeight;
    getOccupiedVolume = () => this.occupiedVolume;
    getAssignedSKU = () => this.assignedSKU;

    setAssignedSKU = (sku) => {this.assignedSKU = sku};

    convertToObj = () => {
        return ( 
            {"positionID": this.positionID, "aisleID": this.aisle, "row": this.row, "col": this.col,
             "maxWeight": this.maxWeight, "maxVolume": this.maxVolume, 
             "occupiedWeight": this.occupiedWeight, "occupiedVolume":this.occupiedVolume } );
    };

};


module.exports = Position;