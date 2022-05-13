'use strict';
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

const UserDAO = require('../Database/UserDAO');
const SkuDAO = require('../Database/SkuDAO');
const SKUItemDAO = require('../Database/SKUItemDAO');
const PositionDAO = require('../Database/PositionDAO');
const InternalOrderDAO = require('../Database/InternalOrderDAO');
const RestockOrderDAO = require('../Database/RestockOrderDAO');
const ReturnOrderDAO = require('../Database/ReturnOrderDAO');

const { User, userTypes } = require('./User');
const SKU = require('./Sku');
const Position = require('./Position');
const SKUItem = require('./SKUItem');
const RestockOrder = require("./RestockOrder");
const ReturnOrder = require("./ReturnOrder");
const InternalOrder = require("./InternalOrder");

/* Mock DAO */
const Mock_internalOrderDAO = require('../Mock_databases/Mock_internalOrderDAO');
const Mock_positionDAO = require("../Mock_databases/Mock_positionDAO");
const Mock_restockOrderDAO = require("../Mock_databases/Mock_restockOrderDAO");
const Mock_returnOrderDAO = require("../Mock_databases/Mock_returnOrderDAO");
const Mock_skuDAO = require("../Mock_databases/Mock_skuDAO");
const Mock_skuItemDAO = require("../Mock_databases/Mock_skuItemDAO");
const Mock_testDescriptorDAO = require("../Mock_databases/Mock_testDescriptorDAO");
const Mock_testResultDAO = require("../Mock_databases/Mock_testResultDAO");
const Mock_userDAO = require("../Mock_databases/Mock_userDAO");

dayjs.extend(customParseFormat);

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
        this.restockOrderDAO = new RestockOrderDAO();
        this.returnOrderDAO = new ReturnOrderDAO();
        this.internalOrderDAO = new InternalOrderDAO();
    };

    /* This function must be executed BEFORE EACH unit test on Warehouse:
    *  it sets each DAO to the corresponding Mock DAO
    */
    initTest = () => {
        this.internalOrderDAO = Mock_internalOrderDAO;
        this.positionDAO = Mock_positionDAO;
        this.restockOrderDAO = Mock_restockOrderDAO;
        this.returnOrderDAO = Mock_returnOrderDAO;
        this.skuDAO = Mock_skuDAO;
        this.skuItemDAO = Mock_skuItemDAO;
        this.testDescriptorDAO = Mock_testDescriptorDAO;
        this.testResultDAO = Mock_testResultDAO;
        this.userDAO = Mock_userDAO;
    }

    /*************** functions for managing SKU ***************/
    addSKU = async (description, weight, volume, notes, price, availableQty) => {
        try{
            if(weight <= 0 || volume <= 0 || price <= 0 || availableQty <= 0)
                throw {err : 422, msg : "Invalid data"};
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
            if(weight <= 0 || volume <= 0 || price <= 0 || availableQty <= 0)
                throw {err : 422, msg : "Invalid data"};
            const sku = await this.skuDAO.getSKU(skuID);                    // get SKU
            // if SKU has a Position and availableQty, weight or volume is changed -> check that Position can store SKU
            if(sku.getPosition() !== undefined && (availableQty !== sku.getAvailableQuantity() || weight !== sku.getWeight() || volume !== sku.getVolume())) {
                const pos = await this.positionDAO.getPosition(sku.getPosition());      // get Position
                const newTotWeight = weight * availableQty;
                const newTotVolume = volume * availableQty;
                if((pos.getMaxWeight() < newTotWeight) || (pos.getMaxVolume() < newTotVolume))     // check if Position can store SKU
                    throw {err : 422, msg : "Position cannot store the SKU"};
                // update occupiedWeight and occupiedVolume of Position
                const res = await positionDAO.updatePosition(pos.getPositionID(), pos.getPositionID(), pos.getAisle(), pos.getRow(), pos.getCol(), pos.getMaxWeight(), pos.getMaxVolume(),
                        newTotWeight, newTotVolume, skuID);      
            }
            // update SKU
            const result = await this.skuDAO.updateSKU(skuID, description, weight, volume, notes, price, availableQty, sku.getPosition() ? sku.getPosition() : null);
            return result;
        } catch (err) {
            throw err;
        }
    };


    modifySKUposition = async (skuID, positionID) => {
        try{
            const sku = await this.skuDAO.getSKU(skuID);                         // get SKU
            const position = await this.positionDAO.getPosition(positionID);     // get Position

            if(position.getAssignedSKU() !== undefined)                   // check if Position has already a SKU assigned
                throw {err : 422, msg : "A SKU is already assigned to the Position"};
            const totWeight = sku.getWeight() * sku.getAvailableQuantity();
            const totVolume = sku.getVolume() * sku.getAvailableQuantity();
            if((position.getMaxWeight() < totWeight) || (position.getMaxVolume() < totVolume))     // check if Position can store SKU
                throw {err : 422, msg : "Position cannot store the SKU"};
            
            if(sku.getPosition() !== undefined){
                // release Position assigned to the SKU (set occupiedVolume and occupiedWeight to 0)
                const skuPos = await this.positionDAO.getPosition(sku.getPosition());            // get old Position of SKU
                const res = await this.positionDAO.updatePosition(skuPos.getPositionID(), skuPos.getPositionID(), skuPos.getAisle(), skuPos.getRow(), skuPos.getCol(), 
                    skuPos.getMaxWeight(), skuPos.getMaxVolume(), 0, 0, null);
            }
            // set Position to SKU
            const result = await this.skuDAO.updateSKU(skuID, sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(), sku.getPrice(), sku.getAvailableQuantity(), positionID);
            // set SKU to Position
            const res = await this.positionDAO.updatePosition(positionID, positionID, position.getAisle(), position.getRow(), position.getCol(), 
                position.getMaxWeight(), position.getMaxVolume(), totWeight, totVolume, skuID);
            return result;
        }
        catch(err){
            throw err;
        }
    };

    deleteSKU = async (skuID) => {
        try{
            const sku = await this.skuDAO.getSKU(skuID);        // check if SKU exists
            const roList = await this.restockOrderDAO.getRestockOrders();       // check if RestockOrderProducts has SKU
            for(const ro of roList){
                if(ro.getProducts().find(p => p.SKUId === skuID))
                    throw {err : 422, msg : "Cannot delete SKU"};
            }
            
            const skuItemList = await this.skuItemDAO.getAllSKUItems();         // check if SKUItem has SKU
            if(skuItemList.find(s => s.getSKU() === skuID))
                throw {err : 422, msg : "Cannot delete SKU"};

            // TODO: add check on TestDescriptor

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
        try{
            if(!(dayjs(dateOfStock, 'YYYY/MM/DD HH:mm', true).isValid() || dayjs(dateOfStock, 'YYYY/MM/DD', true).isValid()))
                throw {err : 422, msg : "Invalid Date"};
            const sku = await this.getSKU(skuID); 
            const res = await this.skuItemDAO.newSKUItem(rfid, skuID, 0, dateOfStock);
            return res;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUItem = async (rfid) => {
        try {
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);
            const sku = await this.skuDAO.getSKU(skuItem.getSKU());
            skuItem.setSKU(sku);
            return skuItem;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUItems = async () => {
        try{
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            for(const skuItem of skuItemList){
                const sku = await this.skuDAO.getSKU(skuItem.getSKU());
                skuItem.setSKU(sku);
            }
            return skuItemList;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUItemsBySKUid = async (skuID) => {
        try {
            const sku =  await this.skuDAO.getSKU(skuID);
            let skuItems = await this.skuItemDAO.getAllSKUItems();
            skuItems = skuItems.filter(s => s.getSKU() === skuID && s.getAvailable() === 1);
            skuItems.forEach(s => s.setSKU(sku));
            return skuItems;
        }
        catch (err) {
            throw err;
        }
    };

    modifySKUItem = async (rfid, newRFID, newAvailable, newDate) => {
        try {
            if(!(dayjs(newDate, 'YYYY/MM/DD HH:mm', true).isValid() || dayjs(newDate, 'YYYY/MM/DD', true).isValid() || newDate === null))
                throw {err : 422, msg : "Invalid Date"};
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);
            const result = this.skuItemDAO.updateSKUItem(rfid, newRFID, newAvailable, newDate ? newDate : skuItem.getDateOfStock(), skuItem.getRestockOrder());
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
            if(positionID !== aisle.concat(row).concat(col) || maxWeight <= 0 || maxVolume <= 0)
                throw {err : 422, msg : "Invalid Position data"};
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
            if(maxWeight <= 0 || maxVolume <= 0 || occupiedWeight <= 0 || occupiedVolume <= 0 
                || occupiedVolume > maxVolume || occupiedWeight > maxWeight)
                throw {err : 422, msg : "Invalid Position data"};

            const newPositionID = aisle.concat(row).concat(col);
            if(pos.getAssignedSKU() !== undefined){
                const sku = await this.skuDAO.getSKU(pos.getAssignedSKU());         // get SKU of Position
                const totWeight = sku.getWeight() * sku.getAvailableQuantity();
                const totVolume = sku.getVolume() * sku.getAvailableQuantity();
                if(totWeight > maxWeight || totVolume > maxVolume )
                    throw {err : 422, msg : "Cannot update position"};
                // update positionID of the SKU
                const res = await this.skuDAO.updateSKU(sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                    sku.getPrice(), sku.getAvailableQuantity(), newPositionID);
            }
            const result = await this.positionDAO.updatePosition(positionID, newPositionID, aisle, row, col, 
                maxWeight, maxVolume, occupiedWeight, occupiedVolume, pos.getAssignedSKU() ? pos.getAssignedSKU() : null);
            return result;
        }
        catch(err){
            throw err;
        }
    };

    modifyPositionID = async (oldPositionID, newPositionID) => {
        try{
            const pos = await this.positionDAO.getPosition(oldPositionID);     // get position to check if exists
            if(!Number(newPositionID))
                throw {err : 422, msg : "Invalid Position data"};
            
            const newAisle = newPositionID.slice(0, 4);     // take first 4 digits
            const newRow = newPositionID.slice(4, 8);       // take 4 digits in the middle
            const newCol = newPositionID.slice(8);          // take last digits
             // update Position modifying only positionID, aisle, row and col
             const result = await this.positionDAO.updatePosition(oldPositionID, newPositionID, newAisle, newRow, newCol, 
                pos.getMaxWeight(), pos.getMaxVolume(), pos.getOccupiedWeight(), pos.getOccupiedVolume(), pos.getAssignedSKU() ? pos.getAssignedSKU() : null);
            // if position has SKU assigned
            if(pos.getAssignedSKU() !== undefined){
                const sku = await this.skuDAO.getSKU(pos.getAssignedSKU());     // get assigned SKU
                // update positionID of the SKU
                const res = await this.skuDAO.updateSKU(sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                    sku.getPrice(), sku.getAvailableQuantity(), newPositionID);
            }
            return result;
        }
        catch(err){
            throw err;
        }
    };

    deletePosition = async (positionID) => {
        try{
            const pos = await this.positionDAO.getPosition(positionID);
            if(pos.getAssignedSKU() !== undefined)
                throw {err : 422, msg : "Cannot delete: Position assigned to SKU"};
            const res = await this.positionDAO.deletePosition(positionID);
            return res;
        }
        catch(err){
            throw err;
        }
    };

    /********* functions for managing Restock Order ***********/
    addRestockOrder = async (products, supplierID, issueDate) => {
        if(!(dayjs(issueDate, 'YYYY/MM/DD HH:mm', true).isValid() || dayjs(issueDate, 'YYYY/MM/DD', true).isValid()))
            throw {err : 422, msg : "Invalid Date"};
        for(const prod of products){
            await this.skuDAO.getSKU(prod.SKUId);           // for each product get SKU associated: throw err 404 if does not exists
        }
        const users = await this.userDAO.getAllUsers();
        if(!users.find(u => u.getUserID() === supplierID && u.getType() === "supplier"))
            throw {err : 422, msg : "Supplier Not Found" };
        const res = await this.restockOrderDAO.newRestockOrder(products, supplierID, issueDate);
        return res;
    }

    getRestockOrder = async (restockOrderID) => {
        try{
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            restockOrder.setSKUItems(skuItemList.filter(s => s.getRestockOrder() === restockOrder.getID()));
            return restockOrder;
        } catch(err){
            throw err;
        }
    }

    getRestockOrders = async () => {
        try{
            const restockOrderList = await this.restockOrderDAO.getRestockOrders();
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            restockOrderList.forEach(ro => {
                const skuItemsOfRO = skuItemList.filter(s => s.getRestockOrder() === ro.getID());
                ro.setSKUItems(skuItemsOfRO);
            });
            return restockOrderList;
        } catch(err){
            throw err;
        }
    }

    getRestockOrdersIssued = async () => {
        try{
            let restockOrderList = await this.restockOrderDAO.getRestockOrders();
            restockOrderList = restockOrderList.filter(ro => ro.getState() === "ISSUED");
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            restockOrderList.forEach(ro => {
                const skuItemsOfRO = skuItemList.filter(s => s.getRestockOrder() === ro.getID());
                ro.setSKUItems(skuItemsOfRO);
            });
            return restockOrderList;
        } catch(err){
            throw err;
        }
    }

    restockOrderAddSKUItems = async (restockOrderID, SKUItemIdList) => {
        try{
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            if(restockOrder.getState() !== "DELIVERED")
                throw {err: 422, msg: "Restock Order not in DELIVERED state"};
            const allSKUItems = await this.skuItemDAO.getAllSKUItems();
            const skuItemList = [];
            for(const s of SKUItemIdList){
                const skuItem = allSKUItems.find(skuI => skuI.getRFID() === s.rfid);        // get SKUItem 
                // if SKUItem not found or SKUid passed as params is different from the real SKUid or SKUItem has already a restockOrder
                if(!skuItem || s.SKUId !== skuItem.getSKU() || skuItem.getRestockOrder() !== undefined)
                    throw {err: 422, msg: "Invalid SKUItem"};
                skuItemList.push(skuItem);
            }
            for(const skuItem of skuItemList){
                // update skuItem with all fields equal but the restockOrderID
                const res = await this.skuItemDAO.updateSKUItem(skuItem.getRFID(), skuItem.getRFID(), skuItem.getAvailable(), skuItem.getDateOfStock(), restockOrderID);
            }
            return restockOrder;
        } catch(err){
            throw err;
        }
    }

    restockOrderAddTransportNote = async (restockOrderID, date) => {
        try{
            if(!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() || dayjs(date, 'YYYY/MM/DD', true).isValid()))
                throw {err : 422, msg : "Invalid Date"};
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            const res = await this.restockOrderDAO.updateRestockOrder(restockOrderID, restockOrder.getState(), dayjs(date).format('YYYY-MM-DD HH:mm'));
            return res;
        } catch(err){
            throw err;
        }
    }

    modifyRestockOrderState = async (restockOrderID, newState) => {
        try{
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            const res = await this.restockOrderDAO.updateRestockOrder(restockOrderID, newState, restockOrder.getTransportNote());
            return res;
        } catch(err){
            throw err;
        }
    }

    returnItemsFromRestockOrder = async (restockOrderID) => {
        try {
            const res = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            // call testResultDAO get testResult
            // TODO
            return res;
        } catch (err) {
            throw err;
        }
    }

    deleteRestockOrder = async (restockOrderID) => {
        try {
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            const res = await this.restockOrderDAO.deleteRestockOrder(restockOrderID);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /********* functions for managing Return Orders **********/

    addReturnOrder = async (SKUItemList, restockOrderId, returnDate) => {
        const res = await this.returnOrderDao.newReturnOrder(SKUItemList, restockOrderId, returnDate);
        const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderId);
        if(res !== undefined && restockOrder !== undefined){
            this.sendNotificationRO(restockOrder.supplierID, res.lastId);
        }
    }

    getReturnOrders = async () => {
        const res = await this.returnOrderDAO.getAllReturnOrders();
        return res;
    }

    getReturnOrderById = async (id) => {
        const res = await this.returnOrderDAO.getReturnOrderById(id);
        return res;
    }

    deleteReturnOrder = async (id) => {
        const res = await this.returnOrderDAO.deleteReturnOrder();
    }
    
    sendNotificationRO = async (userID, returnOrderID)=> {
        const ro = await this.returnOrderDAO.getReturnOrderById(returnOrderID);
        if(ro !== undefined){
            
            console.log("*** RETURN ORDER NOTIFICATION ***");
            console.log(`To SUPPLIER: ${userID}`);
            console.log(`Related to RESTOCK ORDER ${ro.getRestockOrderId}`);
            console.log(`For products: ${ro.getProducts}`);
        }
    }
    

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
            if(type === "manager" || type === "administrator")
                throw {err : 422, msg : "attempt to create manager or administrator accounts"};
            if(password.length < 8)
                throw {err : 422, msg : "Password must be at least 8 characters"};
            if(!userTypes.find(t => t === type))
                throw {err : 422, msg : "Invalid user type"};
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

    login = async (username, password, type) => {
        try{
            const user = await this.userDAO.loginUser(username, password, type);
            return user;
        } catch(err){
            throw err;
        }
    };

    modifyUserRights = async (username, oldType, newType) => {
        try {
            if(!userTypes.filter(t => (t !== "manager" && t !== "administrator")).find(type => type === newType))
                throw {err : 422, msg : "Invalid user type"};
            const user = await this.userDAO.getUser(username, oldType);
            const result = await this.userDAO.updateUser(username, oldType, newType);
            return result;
        } catch (err) {
            throw err;
        }
    };

    
    deleteUser = async (username, type) => {
        try {
            const user = await this.userDAO.getUser(username, type);
            if(type === "manager" || type === "administrator")
                throw {err : 422, msg : "Attempt to delete manager/administrator" };
            if(type === "supplier"){
                const roList = await this.restockOrderDAO.getRestockOrders();
                if(roList.find(ro => ro.getSupplier() === user.getUserID()))
                    throw {err : 422, msg : "Cannot delete supplier: Restock Order assigned to the user" };
            }
            const result = await this.userDAO.deleteUser(username, type);
            return result;
        } catch (err) {
            throw err;
        }
    };


}


// Singleton class
const warehouse = new Warehouse();


module.exports = Warehouse;