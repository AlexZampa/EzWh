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
    getAssignedSKU = () => this.assignedSKU;

    setAssignedSKU = (sku) => {this.assignedSKU = sku};

    modifyPositionID = async (newPositionID, positionDAO, skuDAO) => {
        try{
            const newAisle = newPositionID.slice(0, 4);     // take first 4 digits
            const newRow = newPositionID.slice(4, 8);       // take 4 digits in the middle
            const newCol = newPositionID.slice(8);          // take last digits
            if(this.assignedSKU !== undefined){
                const sku = await skuDAO.getSKU(this.assignedSKU);     // get assigned SKU
                this.assignedSKU = sku;
                // update positionID of the SKU
                const res = await skuDAO.updateSKU(sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                    sku.getPrice(), sku.getAvailableQuantity(), newPositionID);
            }
            // update Position modifying only positionID, aisle, row and col
            const result = await positionDAO.updatePosition(this.positionID, newPositionID, newAisle, newRow, newCol, 
                this.maxWeight, this.maxVolume, this.occupiedWeight, this.occupiedVolume, this.assignedSKU);
            this.positionID = newPositionID;
            this.aisle = newAisle;
            this.row = newRow;
            this.col = newCol;
            return result;
        }
        catch(err){
            throw err;
        }
    };

    modifyPositionData = async (aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, positionDAO, skuDAO) => {
        try{
            const newPositionID = aisle.concat(row).concat(col);
            if(this.assignedSKU !== undefined){
                const sku = await skuDAO.getSKU(this.assignedSKU);         // get SKU
                this.assignedSKU = sku;
                const totWeight = sku.getWeight() * sku.getAvailableQuantity();
                const totVolume = sku.getVolume() * sku.getAvailableQuantity();
                if(totWeight > maxWeight || totVolume > maxVolume )
                    throw {err : 422, msg : "Cannot update position"};
                // update positionID of the SKU
                const res = await skuDAO.updateSKU(sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                    sku.getPrice(), sku.getAvailableQuantity(), newPositionID);
            }
            const result = await positionDAO.updatePosition(this.positionID, newPositionID, aisle, row, col, 
                maxWeight, maxVolume, occupiedWeight, occupiedVolume, this.assignedSKU ? this.assignedSKU.getID() : undefined);
            this.positionID = newPositionID;
            this.aisle = aisle;
            this.row = row;
            this.col = col;
            this.maxWeight = maxWeight;
            this.maxVolume = maxVolume;
            this.occupiedWeight = occupiedWeight;
            this.occupiedVolume = occupiedVolume;
            return result;
        }
        catch(err){
            throw err;
        }
    };

    convertToObj = () => {
        return ( 
            {"positionID": this.positionID, "aisleID": this.aisle, "row": this.row, "col": this.col,
             "maxWeight": this.maxWeight, "maxVolume": this.maxVolume, 
             "occupiedWeight": this.occupiedWeight, "occupiedVolume":this.occupiedVolume } );
    };

};

/**
 * 
 * @param {*} positionID 
 * @param {*} aisle 
 * @param {*} row 
 * @param {*} col 
 * @returns true if positionID is equal to the string aisle + row + col
 */
function validatePositionID(positionID, aisle, row, col){
    if(positionID !== aisle.concat(row).concat(col))
        return false;
    return true;
};

module.exports = { Position, validatePositionID };