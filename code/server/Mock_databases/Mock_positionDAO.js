"use strict";

class Mock_positionDAO {
    newPosition = (positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid) => jest.fn();
    getAllPosition = () => jest.fn();
    getPosition = (positionID) => jest.fn();
    updatePosition = (oldPositionID, newPositionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, skuID=undefined) => jest.fn();
    deletePosition  = (positionID) => jest.fn();
}

module.exports = Mock_positionDAO;