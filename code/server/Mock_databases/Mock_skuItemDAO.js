"use strict";

class Mock_skuItemDAO {
    newSKUItem = (RFID, sku, available, dateOfStock, restockOrder=null) => jest.fn();
    getSKUItem = (rfid) => jest.fn();
    getAllSKUItems = () => jest.fn();
    updateSKUItem = (oldRFID, newRFID, newAvailable, newDate, restockOrderID) => jest.fn();
    deleteSKUItem = (rfid) => jest.fn();
}

module.exports = Mock_skuItemDAO;