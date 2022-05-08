'use strict';
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
            return Warehouse._instance;
        }
        Warehouse._instance = this;
        this.userDAO = new UserDAO();
        this.skuDAO = new SkuDAO();
        this.skuItemDAO = new SKUItemDAO();
        this.positionDAO = new PositionDAO();
    };

    /*************** functions for managing SKU ***************/
    addSKU = async (description, weight, volume, notes, price, availableQty) => {
        try{
            const res = await this.skuDAO.newSKU(description, weight, volume, notes, price, availableQty, null);
            return res;
        }
        catch(err){
            throw err;
        }
    };

    getSKUs = async () => {
        try{
            const skuList = await this.skuDAO.getAllSKU();
            for(const sku of skuList){
                if(sku.getPosition() !== undefined){
                    const position = await this.positionDAO.getPosition(sku.getPosition());
                    sku.setPosition(position);
                }
            }
            // add get all test descriptors of skuID
            return skuList;
        }
        catch(err){
            throw err;
        }
    };

    getSKU = async (skuID) => {
        try{
            const sku = await this.skuDAO.getSKU(skuID);
            if(sku.getPosition() !== undefined){
                const position = await this.positionDAO.getPosition(sku.getPosition());
                sku.setPosition(position);
            }
            // add get all test descriptors of skuID
            return sku;
        }
        catch(err){
            throw err;
        }
    };

    
    modifySKU = async (skuID, description, weight, volume, notes, price, availableQty) => {
        try {
            const sku = await this.skuDAO.getSKU(skuID);                    // get SKU
            const result = await sku.modifySKUdata(description, weight, volume, notes, price, availableQty, this.skuDAO, this.positionDAO);
            return result;
        } catch (err) {
            throw err;
        }
    };


    modifySKUposition = async (skuID, positionID) => {
        try{
            const sku = await this.skuDAO.getSKU(skuID);                         // get SKU
            const position = await this.positionDAO.getPosition(positionID);     // get Position
            const result = sku.modifyPosition(position, this.skuDAO, this.positionDAO);
            return result;
        }
        catch(err){
            throw err;
        }
    };

    deleteSKU = async (skuID) => {
        try{
            const sku = await this.skuDAO.getSKU(skuID);        // check if SKU exists
            const res = await this.skuDAO.deleteSKU(skuID);     // delete SKU
            if(sku.getPosition() !== undefined){                // if SKU has a Position assigned
                const pos = await this.positionDAO.getPosition(sku.getPosition());
                // remove assignedSKU to the Position and set occupiedWeight and occupiedVolume to 0
                const result = await this.positionDAO.updatePosition(pos.getPositionID(), pos.getPositionID(), pos.getAisle(), pos.getRow(), pos.getCol(), pos.getMaxWeight(), pos.getMaxVolume(), 0, 0);
            }
            return res;
        }
        catch(err){
            throw err;
        }
    };

    /**************** functions for managing SKUItem ***************/
    addSKUItem = async (rfid, skuID, dateOfStock) => {
        try {
            const sku = await this.getSKU(skuID); 
            const res = await this.skuItemDAO.newSKUItem(rfid, sku, dateOfStock);
            return res;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUItem = async (rfid) => {
        try {
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);
            return skuItem;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUItems = async () => {
        try {
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            return skuItemList;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUItemsBySKUid = async (skuID) => {
        try {
            const skuItemList = await this.SKUItemDAO.getSKUItems();
            let skuItems = [];
            skuItemList.forEach(skuItem => {
                if (skuItem.getSKU().getID() === skuID && skuItem.isAvailable()) {
                    skuItems.append(skuItem);
                }
            });
            return skuItems;
        }
        catch (err) {
            throw err;
        }
    };

    modifySKUItem = async (rfid, newRFID, newDate, newAvailable) => {
        try {
            const result = this.skuItemDAO.modifySKUItem(rfid, newRFID, newDate, newAvailable);
            return result;
        }
        catch (err) {
            throw err;
        }
    };

    deleteSKUItem = async (rfid) => {
        try {
            const res = await this.skuItemDAO.deleteSKUItem(rfid);
        }
        catch (err) {
            throw err;
        }
    };

    /*************** functions for managing Position ****************/
    addPosition = async (positionID, aisle, row, col, maxWeight, maxVolume) => {
        try{
            const res = await this.positionDAO.newPosition(positionID, aisle, row, col, maxWeight, maxVolume, 0, 0, null);
            return res;
        }
        catch(err){
            throw err;
        }
    };

    getPositions = async () => {
        try{
            const positionList = await this.positionDAO.getAllPosition();
            for(const pos of positionList){
                if(pos.getAssignedSKU() !== undefined){
                    const sku = await this.skuDAO.getSKU(pos.getAssignedSKU());
                    pos.setAssignedSKU(sku);
                }
            }
            return positionList;
        }
        catch(err){
            throw err;
        }
    };


    modifyPosition = async (positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) => {
        try{
            const pos = await this.positionDAO.getPosition(positionID);     // get position to check if exists
            if(occupiedVolume > maxVolume || occupiedWeight > maxWeight)
                throw {err : 422, msg : "Position data not valid"};;
            const result = pos.modifyPositionData(aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, this.positionDAO, this.skuDAO);
            return result;
        }
        catch(err){
            throw err;
        }
    };

    modifyPositionID = async (oldPositionID, newPositionID) => {
        try{
            const pos = await this.positionDAO.getPosition(oldPositionID);     // get position to check if exists
            const result = pos.modifyPositionID(newPositionID, this.positionDAO, this.skuDAO);
            return result;
        }
        catch(err){
            throw err;
        }
    };

    deletePosition = async (positionID) => {
        try{
            const res = await this.positionDAO.deletePosition(positionID);
            return res;
        }
        catch(err){
            throw err;
        }
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


    /********* functions for managing Users **********/
    addUser = async (username, name, surname, password, type) => {
        try{
            const userList = await this.userDAO.getAllUsers();
            const alreadyExists = userList.some((user) => {
                if(user.getEmail() === username && user.getType() === type)
                    return true;
                return false;
            });
        if(alreadyExists)
            throw {err: 409, msg: "User already exists"};
        const result = await this.userDAO.newUser(username, name, surname, password, type);
        return result;
        }
        catch(err){
            throw err;
        }
    };

    getUsers = async () => {
        try {
            const userList = await this.userDAO.getAllUsers();
            return userList.filter(u => u.getType() !== "manager");
        } catch (err) {
            throw err;
        }
    };

    getSuppliers = async () => {
        try {
            const supplierList = await this.userDAO.getAllUsersByType("supplier");
            return supplierList;
        } catch (err) {
            throw err;
        }
    };

    loginManager = async (username, password) => {
        try{
            const login = await this.userDAO.loginUser(username, password, "manager");
            return login;
        } catch(err){
            throw err;
        }
    };


}


// Singleton class
const warehouse = new Warehouse();


module.exports = Warehouse;