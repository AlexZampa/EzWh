"use strict";

class Mock_skuDAO {
    newSKU = (description, weight, volume, notes, price, availableQty, position) => jest.fn();
    getAllSKU = () => jest.fn();
    getSKU = (skuID) => jest.fn();
    updateSKU = (skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, newPositionID=undefined) => jest.fn();
    deleteSKU = (skuID) => jest.fn();
}

module.exports = Mock_skuDAO;