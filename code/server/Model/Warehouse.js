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

    login = async (username, password) => {
        const user = await this.userDAO.loginUser(username, password);
        if(user !== undefined)
            return {"id": user.getUserID(), "name": user.getName(), "surname": user.getSurname(), "email": user.getEmail(), "type": user.getType()};
        return {};
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
            // if SKU has a Position and availableQty, weight or volume is changed -> check that Position can store SKU
            if( sku.getPosition() !== undefined && (availableQty !== sku.getAvailableQuantity() || weight !== sku.getWeight() || volume !== sku.getVolume()) ) {
                const pos = await this.positionDAO.getPosition(sku.getPosition());      // get Position
                const newTotWeight = weight * availableQty;
                const newTotVolume = volume * availableQty;
                if((pos.getMaxWeight() < newTotWeight) || (pos.getMaxVolume() < newTotVolume))     // check if Position can store SKU
                    throw {err : 422, msg : "Position cannot store the SKU"};
                // update occupiedWeight and occupiedVolume of position
                const res = await this.positionDAO.updatePosition(pos.getPositionID(), pos.getPositionID(), pos.getAisle(), pos.getRow(), pos.getCol(), pos.getMaxWeight(), pos.getMaxVolume(),
                        newTotWeight, newTotVolume, skuID);      
            }
            // update sku
            const res = await this.skuDAO.updateSKU(skuID, description, weight, volume, notes, price, availableQty, sku.getPosition() ? sku.getPosition() : undefined);
            return res;
        } catch (err) {
            throw err;
        }
    };


    modifySKUposition = async (skuID, positionID) => {
        try{
            const sku = await this.skuDAO.getSKU(skuID);                    // get SKU
            const pos = await this.positionDAO.getPosition(positionID);     // get Position
            if(pos.getAssignedSKU() !== undefined)                   // check if Position has already a SKU assigned
                throw {err : 422, msg : "A SKU is already assigned to the Position"};
            const totWeight = sku.getWeight() * sku.getAvailableQuantity();
            const totVolume = sku.getVolume() * sku.getAvailableQuantity();
            if((pos.getMaxWeight() < totWeight) || (pos.getMaxVolume() < totVolume))     // check if Position can store SKU
                throw {err : 422, msg : "Position cannot store the SKU"};
            
            if(sku.getPosition() !== undefined){
                // release Position assigned to the SKU (set occupiedVolume and occupiedWeight to 0)
                const skuPos = await this.positionDAO.getPosition(sku.getPosition());
                let res = await this.positionDAO.updatePosition(skuPos.getPositionID(), skuPos.getPositionID(), skuPos.getAisle(), skuPos.getRow(), skuPos.getCol(), skuPos.getMaxWeight(), skuPos.getMaxVolume(),
                    0, 0);
            }
            
            // set Position to SKU
            const result = await this.skuDAO.updateSKU(skuID, sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                sku.getPrice(), sku.getAvailableQuantity(), positionID);
            // set SKU to Position
            let res = await this.positionDAO.updatePosition(positionID, positionID, pos.getAisle(), pos.getRow(), pos.getCol(), pos.getMaxWeight(), pos.getMaxVolume(),
                totWeight, totVolume, skuID);
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

    getSKUItem = (rfid) => {
        try {
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);
            return skuItem;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUItems = () => {
        try {
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            return skuItemList;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUItemsBySKUid = (skuID) => {
        try {
            const skuItemList = await this.SKUItemDAO.getSKUItems();
            let skuItems = [];
            skuItemList.forEach(skuItem => {
                if (skuItem.getSKU().getID() === skuID) {
                    skuItems.append(skuItem);
                }
            });
            return skuItems;
        }
        catch (err) {
            throw err;
        }
    };

    modifySKUItem = (rfid, newRFID, newSKUID, newDate, newTestResult) => {
        try {
            const skuID = await this.skuItemDAO.getSKUItem(rfid);
            const newsku = await this.getSKU(newSKUID);
            const result = skuID.modifySKUItem(newRFID, newsku, newDate, newTestResult);
            return result;
        }
        catch (err) {
            throw err;
        }
    };

    deleteSKUItem = (rfid) => {
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
            const newPositionID = aisle.concat(row).concat(col);
            const result = await this.positionDAO.updatePosition(positionID, newPositionID, aisle, row, col, 
                maxWeight, maxVolume, occupiedWeight, occupiedVolume, pos.getAssignedSKU());
            if(pos.getAssignedSKU() !== undefined){
                // update positionID of the SKU
                const sku = await this.skuDAO.getSKU(pos.getAssignedSKU());
                const res = await this.skuDAO.updateSKU(sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                    sku.getPrice(), sku.getAvailableQuantity(), newPositionID);
            }
            return result;
        }
        catch(err){
            throw err;
        }
    };

    modifyPositionID = async (oldPositionID, newPositionID) => {
        try{
            const newAisle = newPositionID.slice(0, 4);     // take first 4 digits
            const newRow = newPositionID.slice(4, 8);       // take 4 digits in the middle
            const newCol = newPositionID.slice(8);          // take last digits
            const pos = await this.positionDAO.getPosition(oldPositionID);     // get position to check if exists
            if(pos.getAssignedSKU() !== undefined){
                const sku = await this.skuDAO.getSKU(pos.getAssignedSKU());     // get assigned SKU 
                // update positionID of the SKU
                const res = await this.skuDAO.updateSKU(sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                    sku.getPrice(), sku.getAvailableQuantity(), newPositionID);
            }
            // update Position modifying only positionID, aisle, row and col
            const result = await this.positionDAO.updatePosition(oldPositionID, newPositionID, newAisle, newRow, newCol, 
                pos.getMaxWeight(), pos.getMaxVolume(), pos.getOccupiedWeight(), pos.getOccupiedVolume(), pos.getAssignedSKU());
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

}


// Singleton class
const warehouse = new Warehouse();


module.exports = Warehouse;