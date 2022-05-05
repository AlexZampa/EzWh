'use strict';
const { use } = require('chai');
const UserDAO = require('../Database/UserDAO');
const SkuDAO = require('../Database/SkuDAO');
const SKUItemDAO = require('../Database/SKUItemDAO');
const PositionDAO = require('../Database/PositionDAO');
const User = require('./User');
const SKU = require('./Sku');
const Position = require('./Position');
const SKUItem = require('./SKUItem');
const RestockOrder = require("./RestockOrder");
const ReturnOrder = require("./ReturnOrder");

class Warehouse{

    constructor() {
        if (Warehouse._instance) {
            return Warehouse._instance
        }
        Warehouse._instance = this;
        this.userDAO = new UserDAO();
        this.skuDAO = new SkuDAO();
        this.skuItemDAO = new SKUItemDAO();
        this.positionDAO = new PositionDAO();
    };

    login = async (username, password) => {
        const user = await this.userDAO.loginUser(username, password);
        if(user !== undefined)
            return {"id": user.getUserID(), "name": user.getName(), "surname": user.getSurname(), "email": user.getEmail(), "type": user.getType()};
        return {};
    };

    /********* functions for managing SKU **********/
    addSKU = async (description, weight, volume, notes, price, availableQty) => {
        const res = await this.skuDAO.newSKU(description, weight, volume, notes, price, availableQty, null);
        return res;
    };

    getSKUs = async () => {
        const skuList = await this.skuDAO.getAllSKU();
        return skuList;
    };

    getSKU = async (skuID) => {
        const sku = await this.skuDAO.getSKU(skuID);
        return sku;
    };

    deleteSKU = async (skuID) => {
        const res = await this.skuDAO.deleteSKU(skuID);
        return res;
    };

    /********* functions for managing SKUItem **********/
    addSKUItem = async (rfid, skuID, dateOfStock) => {
        const SKUObj = await this.skuDAO.getSKU(skuID);
        if (Object.keys(SKUObj).length === 0)
            return {};
        const res = await this.skuItemDAO.newSKUItem(rfid, SKUObj, dateOfStock);
    };

    /********* functions for managing Position **********/
    addPosition = async (positionID, aisle, row, col, maxWeight, maxVolume) => {
        if(positionID !== aisle.concat(row).concat(col))
            return undefined;
        const res = await this.positionDAO.newPosition(positionID, aisle, row, col, maxWeight, maxVolume, 0, 0, null);
        return res;
    };

    getPositions = async () => {
        return [];
    };



}

const warehouse = new Warehouse();

module.exports = Warehouse;