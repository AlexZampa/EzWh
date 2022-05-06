'use strict';
const { use } = require('chai');
const UserDAO = require('../Database/UserDAO');
const SkuDAO = require('../Database/SkuDAO');
const SKUItemDAO = require('../Database/SKUItemDAO');
const PositionDAO = require('../Database/PositionDAO');
const User = require('./User');
const SKU = require('./Sku');
const { Position } = require('./Position');
const SKUItem = require('./SKUItem');
const RestockOrder = require("./RestockOrder");
const ReturnOrder = require("./ReturnOrder");
const InternalOrder = require("./InternalOrder");

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
        for(const sku of skuList){
            if(sku.getPosition() !== ""){
                const position = await this.positionDAO.getPosition(sku.getPosition());
                sku.setPosition(position);
            }
        }
        // add get all test descriptors of skuID
        return skuList;
    };

    getSKU = async (skuID) => {
        const sku = await this.skuDAO.getSKU(skuID);
        console.log(sku === undefined);
        if(sku !== undefined && sku.getPosition() !== ""){
            const position = await this.positionDAO.getPosition(sku.getPosition());
            sku.setPosition(position);
        }
        // add get all test descriptors of skuID
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
        const res = await this.positionDAO.newPosition(positionID, aisle, row, col, maxWeight, maxVolume, 0, 0, null);
        return res;
    };

    getPositions = async () => {
        const positionList = await this.positionDAO.getAllPosition();
        for(const pos of positionList){
            if(pos.getAssignedSKU() !== undefined){
                const sku = await this.skuDAO.getSKU(pos.getAssignedSKU());
                pos.setAssignedSKU(sku);
            }
        }
        return positionList;
    };


    modifyPosition = async (positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) => {
        const result = await this.positionDAO.updatePosition(positionID, aisle.concat(row).concat(col), aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume);
        return result;
    };

    deletePosition = async (positionID) => {
        const res = await this.positionDAO.deletePosition(positionID);
        return res;
    };


    /********* functions for managing Internal Order **********/
    addInternalOrder = async (products, customerId, issueDate) => {
        const res = await this.internalOrderDAO.newInternalOrder(issueDate, products, customerId, "ISSUED");
        return res;
    }

    getInternalOrders = async () => {
        const res = await this.internalOrderDAO.getAllInternalOrders();
        return res;    
    }

    getInternalOrderIssued = async () => {
        const res = await this.internalOrderDAO.getAllIssued();
        return res;
    }

    getAcceptedInternalOrders = async () => {
        const res = await this.internalOrderDAO.getAllAccepted();
        return res;
    }

    getInternalOrder = async (ID) => {
        const res = await this.internalOrderDAO.getInternalOrder(ID);
        return res;
    }

    setIOStatus = async (ID, status, products) => {
        const io = this.getInternalOrder(ID);
        if(io == undefined)
            return false;

        deliveredProducts = products.map(p => getSKUItem(p.RFID));
        io.setStatus(status, deliveredProducts, internalOrderDAO);
        return true;
    }

    deleteInternalOrder = async (ID) => {
        const res = await this.internalOrderDAO.deleteInternalOrder(ID);
        return res;
    };

}

const warehouse = new Warehouse();

module.exports = Warehouse;