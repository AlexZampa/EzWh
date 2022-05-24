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
const ItemDAO = require('../Database/ItemDAO');
const TestDescriptorDAO = require('../Database/TestDescriptorDAO');
const TestResultDAO = require('../Database/TestResultDAO');

const { User, userTypes } = require('./User');
const SKU = require('./Sku');
const Position = require('./Position');
const SKUItem = require('./SKUItem');
const { RestockOrder, restockOrderstateList } = require("./RestockOrder");
const ReturnOrder = require("./ReturnOrder");
const InternalOrder = require("./InternalOrder");
const Item = require('./Item');
const TestDescriptor = require('./TestDescriptor');
const TestResult = require('./TestResult');

// used for date vaidation
dayjs.extend(customParseFormat);

class Warehouse {

    constructor(userDAO, skuDAO, skuItemDAO, positionDAO, restockOrderDAO, returnOrderDAO, internalOrderDAO, itemDAO, testDescriptorDAO, testResultDAO) {
        if (Warehouse._instance) {
            return Warehouse._instance;
        }

        Warehouse._instance = this;
        this.userDAO = userDAO ? userDAO : new UserDAO();
        this.skuDAO = skuDAO ? skuDAO : new SkuDAO();
        this.skuItemDAO = skuItemDAO ? skuItemDAO : new SKUItemDAO();
        this.positionDAO = positionDAO ? positionDAO : new PositionDAO();
        this.restockOrderDAO = restockOrderDAO ? restockOrderDAO : new RestockOrderDAO();
        this.returnOrderDAO = returnOrderDAO ? returnOrderDAO : new ReturnOrderDAO();
        this.internalOrderDAO = internalOrderDAO ? internalOrderDAO : new InternalOrderDAO();
        this.itemDAO = itemDAO ? itemDAO : new ItemDAO();
        this.testDescriptorDAO = testDescriptorDAO ? testDescriptorDAO : new TestDescriptorDAO();
        this.testResultDAO = testResultDAO ? testResultDAO : new TestResultDAO();
    };

    /*************** functions for managing SKU ***************/
    addSKU = async (description, weight, volume, notes, price, availableQty) => {
        try {
            if (weight <= 0 || volume <= 0 || price <= 0 || availableQty <= 0)
                throw { err: 422, msg: "Invalid data" };
            const res = await this.skuDAO.newSKU(description, weight, volume, notes, price, availableQty, null);
            return res;
        }
        catch (err) {
            throw err;
        }
    };

    getSKUs = async () => {
        try {
            const skuList = await this.skuDAO.getAllSKU();
            const tests = await this.testDescriptorDAO.getAllTestDescriptor();
            for (const sku of skuList) {
                tests.forEach(t => {
                    if (t.getSKUid() === sku.getID())
                        sku.addTestDescriptor(t);
                });
            }
            return skuList;
        }
        catch (err) {
            throw err;
        }
    };

    getSKU = async (skuID) => {
        try {
            const sku = await this.skuDAO.getSKU(skuID);
            const tests = await this.testDescriptorDAO.getAllTestDescriptor();
            tests.forEach(t => {
                if (t.getSKUid() === skuID)
                    sku.addTestDescriptor(t);
            });
            return sku;
        }
        catch (err) {
            throw err;
        }
    };


    modifySKU = async (skuID, description, weight, volume, notes, price, availableQty) => {
        try {
            if (weight <= 0 || volume <= 0 || price <= 0 || availableQty <= 0)
                throw { err: 422, msg: "Invalid data" };
            const sku = await this.skuDAO.getSKU(skuID);                    // get SKU
            // if SKU has a Position and availableQty, weight or volume is changed -> check that Position can store SKU
            if (sku.getPosition() !== undefined && (availableQty !== sku.getAvailableQuantity() || weight !== sku.getWeight() || volume !== sku.getVolume())) {
                const pos = await this.positionDAO.getPosition(sku.getPosition());      // get Position
                const newTotWeight = weight * availableQty;
                const newTotVolume = volume * availableQty;
                if ((pos.getMaxWeight() < newTotWeight) || (pos.getMaxVolume() < newTotVolume))    // check if Position can store SKU
                    throw { err: 422, msg: "Position cannot store the SKU" };
                // update occupiedWeight and occupiedVolume of Position
                const res = await this.positionDAO.updatePosition(pos.getPositionID(), pos.getPositionID(), pos.getAisle(), pos.getRow(), pos.getCol(), pos.getMaxWeight(), pos.getMaxVolume(),
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
        try {
            const sku = await this.skuDAO.getSKU(skuID);                         // get SKU
            const position = await this.positionDAO.getPosition(positionID);     // get Position

            if (position.getAssignedSKU() !== undefined)                   // check if Position has already a SKU assigned
                throw { err: 422, msg: "A SKU is already assigned to the Position" };

            const totWeight = sku.getWeight() * sku.getAvailableQuantity();
            const totVolume = sku.getVolume() * sku.getAvailableQuantity();
            if ((position.getMaxWeight() < totWeight) || (position.getMaxVolume() < totVolume))     // check if Position can store SKU
                throw { err: 422, msg: "Position cannot store the SKU" };

            if (sku.getPosition() !== undefined) {
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
        catch (err) {
            throw err;
        }
    };


    deleteSKU = async (skuID) => {
        try {
            const sku = await this.skuDAO.getSKU(skuID);        // check if SKU exists
            const skuItemList = await this.skuItemDAO.getAllSKUItems();         // check if SKUItem has SKU
            if (skuItemList.find(s => s.getSKU() === skuID))
                throw { err: 422, msg: "Cannot delete SKU" };

            const res = await this.skuDAO.deleteSKU(skuID);     // delete SKU
            if (sku.getPosition() !== undefined) {                // if SKU has a Position assigned
                const pos = await this.positionDAO.getPosition(sku.getPosition());
                // remove assignedSKU to the Position and set occupiedWeight and occupiedVolume to 0
                const result = await this.positionDAO.updatePosition(pos.getPositionID(), pos.getPositionID(), pos.getAisle(), pos.getRow(), pos.getCol(), pos.getMaxWeight(), pos.getMaxVolume(), 0, 0, null);
            }
            return res;
        }
        catch (err) {
            throw err;
        }
    };

    testDeleteAllSKU = async () => {
        try {
            await this.skuDAO.resetTable();
            await this.testDescriptorDAO.resetTable();
            await this.positionDAO.resetTable();
            await this.skuItemDAO.resetTable();
        } catch (err) {
            throw err;
        }
    }

    /**************** functions for managing SKUItem ***************/
    addSKUItem = async (rfid, skuID, dateOfStock) => {
        try {
            if (dateOfStock !== undefined && dateOfStock !== null) {
                if (!(dayjs(dateOfStock, 'YYYY/MM/DD HH:mm', true).isValid() || dayjs(dateOfStock, 'YYYY/MM/DD', true).isValid()))
                    throw { err: 422, msg: "Invalid Date" };
            }
            const res = await this.skuItemDAO.newSKUItem(rfid, skuID, 0, dateOfStock ? dateOfStock : null, null);
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
        try {
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            for (const skuItem of skuItemList) {
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
            const sku = await this.skuDAO.getSKU(skuID);
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
            if (newDate !== undefined && newDate !== null) {
                if (!(dayjs(newDate, 'YYYY/MM/DD HH:mm', true).isValid() || dayjs(newDate, 'YYYY/MM/DD', true).isValid()))
                    throw { err: 422, msg: "Invalid Date" };
            }
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
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);            // get SKUItem
            if (skuItem.getRestockOrder() !== undefined)
                throw { err: 422, msg: "Cannot delete SKUItem" };              // check Restock Order

            const res = await this.skuItemDAO.deleteSKUItem(rfid);
            return res;
        }
        catch (err) {
            throw err;
        }
    };

    testDeleteAllSKUItems = async () => {
        try {
            await this.skuItemDAO.resetTable();
        } catch (err) {
            throw err;
        }
    }

    /*************** functions for managing Position ****************/
    addPosition = async (positionID, aisle, row, col, maxWeight, maxVolume) => {
        try {
            if (!Number(positionID) || positionID.length != 12 || aisle.length != 4 || row.length != 4 || col.length != 4)
                throw { err: 422, msg: "Invalid Position data" };
            if (positionID !== aisle.concat(row).concat(col) || maxWeight <= 0 || maxVolume <= 0)
                throw { err: 422, msg: "Invalid Position data" };
            const res = await this.positionDAO.newPosition(positionID, aisle, row, col, maxWeight, maxVolume, 0, 0, null);
            return res;
        }
        catch (err) {
            throw err;
        }
    };

    getPositions = async () => {
        try {
            const positionList = await this.positionDAO.getAllPosition();
            return positionList;
        }
        catch (err) {
            throw err;
        }
    };


    modifyPosition = async (positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) => {
        try {
            const pos = await this.positionDAO.getPosition(positionID);     // get position to check if exists
            if (maxWeight <= 0 || maxVolume <= 0 || occupiedWeight < 0 || occupiedVolume < 0 || occupiedVolume > maxVolume || occupiedWeight > maxWeight)
                throw { err: 422, msg: "Invalid Position data" };

            if (!Number(aisle) || !Number(row) || !Number(col) || aisle.length != 4 || row.length != 4 || col.length != 4)
                throw { err: 422, msg: "Invalid Position data" };

            const newPositionID = aisle.concat(row).concat(col);

            if (pos.getAssignedSKU() !== undefined && newPositionID !== positionID) {
                const sku = await this.skuDAO.getSKU(pos.getAssignedSKU());         // get SKU of Position
                // update positionID of the SKU
                const res = await this.skuDAO.updateSKU(sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                    sku.getPrice(), sku.getAvailableQuantity(), newPositionID);
            }
            // update Position
            const result = await this.positionDAO.updatePosition(positionID, newPositionID, aisle, row, col,
                maxWeight, maxVolume, occupiedWeight, occupiedVolume, pos.getAssignedSKU() ? pos.getAssignedSKU() : null);
            return result;
        }
        catch (err) {
            throw err;
        }
    };

    modifyPositionID = async (oldPositionID, newPositionID) => {
        try {
            const pos = await this.positionDAO.getPosition(oldPositionID);     // get position to check if exists
            if (!Number(newPositionID) || newPositionID.length != 12)
                throw { err: 422, msg: "Invalid Position data" };

            const newAisle = newPositionID.slice(0, 4);     // take first 4 digits
            const newRow = newPositionID.slice(4, 8);       // take 4 digits in the middle
            const newCol = newPositionID.slice(8);          // take last digits
            // update Position modifying only positionID, aisle, row and col
            const result = await this.positionDAO.updatePosition(oldPositionID, newPositionID, newAisle, newRow, newCol,
                pos.getMaxWeight(), pos.getMaxVolume(), pos.getOccupiedWeight(), pos.getOccupiedVolume(), pos.getAssignedSKU() ? pos.getAssignedSKU() : null);
            // if position has SKU assigned
            if (pos.getAssignedSKU() !== undefined) {
                const sku = await this.skuDAO.getSKU(pos.getAssignedSKU());     // get assigned SKU
                // update positionID of the SKU
                const res = await this.skuDAO.updateSKU(sku.getID(), sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(),
                    sku.getPrice(), sku.getAvailableQuantity(), newPositionID);
            }
            return result;
        }
        catch (err) {
            throw err;
        }
    };

    deletePosition = async (positionID) => {
        try {
            const pos = await this.positionDAO.getPosition(positionID);
            if (pos.getAssignedSKU() !== undefined)
                throw { err: 422, msg: "Cannot delete: Position assigned to SKU" };
            const res = await this.positionDAO.deletePosition(positionID);
            return res;
        }
        catch (err) {
            throw err;
        }
    };

    testDeleteAllPosition = async () => {
        try {
            await this.skuDAO.resetTable();
            await this.positionDAO.resetTable();
        } catch (err) {
            throw err;
        }
    };


    /********* functions for managing Restock Order ***********/
    addRestockOrder = async (products, supplierID, issueDate) => {
        if (!(dayjs(issueDate, 'YYYY/MM/DD HH:mm', true).isValid() || dayjs(issueDate, 'YYYY/MM/DD', true).isValid()))
            throw { err: 422, msg: "Invalid Date" };
        for (const prod of products) {
            await this.skuDAO.getSKU(prod.SKUId);           // for each product get SKU associated: throw err 404 if does not exists
        }
        const users = await this.userDAO.getAllUsers();
        if (!users.find(u => u.getUserID() === supplierID && u.getType() === "supplier"))
            throw { err: 422, msg: "Supplier Not Found" };
        const res = await this.restockOrderDAO.newRestockOrder(products, "ISSUED", supplierID, issueDate, null);
        return res;
    }

    getRestockOrder = async (restockOrderID) => {
        try {
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            const skuItemsOfRO = skuItemList.filter(s => s.getRestockOrder() === restockOrderID);
            restockOrder.setSKUItems(skuItemsOfRO);
            return restockOrder;
        } catch (err) {
            throw err;
        }
    }

    getRestockOrders = async () => {
        try {
            const restockOrderList = await this.restockOrderDAO.getAllRestockOrders();
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            restockOrderList.forEach(ro => {
                const skuItemsOfRO = skuItemList.filter(s => s.getRestockOrder() === ro.getID());
                ro.setSKUItems(skuItemsOfRO);
            });
            return restockOrderList;
        } catch (err) {
            throw err;
        }
    }

    getRestockOrdersIssued = async () => {
        try {
            let restockOrderList = await this.restockOrderDAO.getAllRestockOrders();
            restockOrderList = restockOrderList.filter(ro => ro.getState() === "ISSUED");
            const skuItemList = await this.skuItemDAO.getAllSKUItems();
            restockOrderList.forEach(ro => {
                const skuItemsOfRO = skuItemList.filter(s => s.getRestockOrder() === ro.getID());
                ro.setSKUItems(skuItemsOfRO);
            });
            return restockOrderList;
        } catch (err) {
            throw err;
        }
    }

    // receive an object SKUItemIdList: [{"skuID" : skuid, "rfid" : rfid},...]
    restockOrderAddSKUItems = async (restockOrderID, SKUItemIdList) => {
        try {
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            if (restockOrder.getState() !== "DELIVERED")
                throw { err: 422, msg: "Restock Order not in DELIVERED state" };
            const allSKUItems = await this.skuItemDAO.getAllSKUItems();
            const skuItemList = [];
            for (const s of SKUItemIdList) {
                const skuItem = allSKUItems.find(skuI => skuI.getRFID() === s.rfid);        // get SKUItem 
                // if SKUItem not found or skuID passed as params is different from the real SKUid or SKUItem has already a restockOrder
                if (!skuItem || s.skuID !== skuItem.getSKU() || skuItem.getRestockOrder() !== undefined)
                    throw { err: 422, msg: "Invalid SKUItem" };
                skuItemList.push(skuItem);
            }
            for (const skuItem of skuItemList) {
                // update skuItem with all fields equal but the restockOrderID
                const res = await this.skuItemDAO.updateSKUItem(skuItem.getRFID(), skuItem.getRFID(), skuItem.getAvailable(), skuItem.getDateOfStock(), restockOrderID);
            }
            return restockOrder;
        } catch (err) {
            throw err;
        }
    }

    restockOrderAddTransportNote = async (restockOrderID, date) => {
        try {
            if (!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() || dayjs(date, 'YYYY/MM/DD', true).isValid()))
                throw { err: 422, msg: "Invalid date" };
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);        // get RestockOrder
            if (dayjs(date).isBefore(dayjs(restockOrder.getIssueDate())))
                throw { err: 422, msg: "Invalid date: deliveryDate is before issueDate" };
            const res = await this.restockOrderDAO.updateRestockOrder(restockOrderID, restockOrder.getState(), dayjs(date).format('YYYY-MM-DD'));
            return res;
        } catch (err) {
            throw err;
        }
    }

    modifyRestockOrderState = async (restockOrderID, newState) => {
        try {
            if (!restockOrderstateList.find(state => state === newState.toUpperCase()))
                throw { err: 422, msg: "newState invalid" };
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);
            const res = await this.restockOrderDAO.updateRestockOrder(restockOrderID, newState.toUpperCase(), restockOrder.getTransportNote() ? restockOrder.getTransportNote() : null);
            return res;
        } catch (err) {
            throw err;
        }
    }

    returnItemsFromRestockOrder = async (restockOrderID) => {
        try {
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);     // get Restock Order
            if (restockOrder.getState() !== "COMPLETEDRETURN")
                throw { err: 422, msg: "Restock Order not in COMPLETEDRETURN state" };
            const allSkuItems = await this.skuItemDAO.getAllSKUItems();
            let skuItems = [];
            allSkuItems.forEach(s => {
                if (s.getRestockOrder() === restockOrderID) {
                    skuItems.push(s);
                }
            });
            const returnItems = [];
            for (const s of skuItems) {
                const testResults = await this.testResultDAO.getAllTestResult(s.getRFID());
                for (const r of testResults) {
                    if (r.result === '0') {
                        returnItems.push(s);
                        break;
                    }
                }
            }
            return returnItems;
        } catch (err) {
            throw err;
        }
    }

    deleteRestockOrder = async (restockOrderID) => {
        try {
            const restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderID);        // get RestockOrder
            const skuItemList = await this.skuItemDAO.getAllSKUItems();             // get SKUItems
            for (const skuItem of skuItemList) {
                if (skuItem.getRestockOrder() === restockOrder.getID())                    // check SKUItems
                    throw { err: 422, msg: "Cannot delete Restock Order" };
            }
            const res = await this.restockOrderDAO.deleteRestockOrder(restockOrder.getID());      // delete RestockOrder
            return res;
        } catch (err) {
            throw err;
        }
    }

    testDeleteAllRestockOrders = async () => {
        try {
            await this.restockOrderDAO.resetTable();
        } catch (err) {
            throw err;
        }
    }


    /********* functions for managing Return Orders **********/
    addReturnOrder = async (SKUItemList, restockOrderId, returnDate) => {
        try {
            let restockOrder = await this.restockOrderDAO.getRestockOrder(restockOrderId);
            if(!restockOrder) return;
            //if(!restockOrder) restockOrder = new RestockOrder(1, returnDate, 1, "DELIVERED", undefined);
            //console.log(restockOrder);

            const res = await this.returnOrderDAO.newReturnOrder(SKUItemList, restockOrderId, returnDate);

            if (res !== undefined && restockOrder !== undefined) {
                this.sendNotificationRO(restockOrder.getSupplier()/*.getUserID()*/, res.lastId);
            }
            return res;
        } catch (err) {
            throw err;
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
        const res = await this.returnOrderDAO.deleteReturnOrder(id);
        return res;
    }

    sendNotificationRO = async (userID, returnOrderID) => {
        const ro = await this.returnOrderDAO.getReturnOrderById(returnOrderID);
        if (ro !== undefined) {

            console.log("*** RETURN ORDER NOTIFICATION ***");
            console.log(`To SUPPLIER: ${userID}`);
            console.log(`Related to RESTOCK ORDER ${ro.getRestockOrderId()}`);
            console.log(`For products: ${ro.getProducts()}`);
        }
    }

    testDeleteAllReturnOrders = async () => {
        try {
            await this.returnOrderDAO.resetTable();
        } catch (err) {
            throw err;
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
        const io = await this.getInternalOrder(ID);
        if (io == undefined)
            return 0;

        let res = 0;

        res = await this.internalOrderDAO.setStatus(ID, status);

        if (status === "COMPLETED") {
            res = await this.internalOrderDAO.addDeliveredProducts(ID, products);
        }
        if (res) return res; //if res has a value, it is an error


        return res;
    }

    deleteInternalOrder = async (ID) => {
        const io = await this.getInternalOrder(ID);
        if (io == undefined)
            return 0;

        const res = await this.internalOrderDAO.deleteInternalOrder(ID);
        return res;
    };

    testDeleteAllInternalOrders = async () => {
        try {
            await this.internalOrderDAO.resetTable();
        } catch (err) {
            throw err;
        }
    }


    /********* functions for managing Users **********/
    addUser = async (username, name, surname, password, type) => {
        try {
            if (type === "manager" || type === "administrator")
                throw { err: 422, msg: "attempt to create manager or administrator accounts" };
            if (password.length < 8)
                throw { err: 422, msg: "Password must be at least 8 characters" };
            if (!userTypes.find(t => t === type))
                throw { err: 422, msg: "Invalid user type" };
            const result = await this.userDAO.newUser(username, name, surname, password, type);
            return result;
        }
        catch (err) {
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
        try {
            const user = await this.userDAO.loginUser(username, password, type);
            return user;
        } catch (err) {
            throw err;
        }
    };

    modifyUserRights = async (username, oldType, newType) => {
        try {
            if (!userTypes.filter(t => (t !== "manager" && t !== "administrator")).find(type => type === newType))
                throw { err: 422, msg: "Invalid user type" };
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
            if (type === "manager" || type === "administrator")
                throw { err: 422, msg: "Attempt to delete manager/administrator" };
            const result = await this.userDAO.deleteUser(username, type);
            return result;
        } catch (err) {
            throw err;
        }
    };



    testDeleteAllUser = async () => {
        try {
            await this.userDAO.resetTable();
        } catch (err) {
            throw err;
        }
    };


    /********* functions for managing Item ***********/
    getItems = async () => {
        try {
            const itemList = await this.itemDAO.getAllItem();
            return itemList;
        } catch (err) {
            throw err;
        }
    }

    getItem = async (id) => {
        try {
            const item = await this.itemDAO.getItem(id);
            return item;
        } catch (err) {
            throw err;
        }
    }

    addItem = async (id, description, price, SKUId, supplierId) => {
        try {
            if (price <= 0)
                throw { err: 422, msg: "Invalid data" };
            const sku = await this.skuDAO.getSKU(SKUId);
            const res = await this.itemDAO.newItem(id, description, price, SKUId, supplierId);
            return res;
        }
        catch (err) {
            throw err;
        }
    }

    modifyItem = async (id, newDescription, newPrice) => {
        try {
            if (newPrice <= 0)
                throw { err: 422, msg: "Invalid data" };
            const item = await this.itemDAO.getItem(id);
            const result = await item.modifyItemData(newDescription, newPrice, this.itemDAO);
            return result;
        } catch (err) {
            throw err;
        }
    }

    deleteItem = async (id) => {
        try {
            const item = await this.itemDAO.getItem(id);
            const res = await this.itemDAO.deleteItem(id);
            return res;
        }
        catch (err) {
            throw err;
        }
    }

    testDeleteAllItem = async () => {
        try {
            await this.skuDAO.resetTable();
            await this.userDAO.resetTable();
            await this.itemDAO.resetTable();
        } catch (err) {
            throw err;
        }
    }

    /********* functions for managing Test Descriptor ***********/
    getTestDescriptors = async () => {
        try {
            const testDescriptorList = await this.testDescriptorDAO.getAllTestDescriptor();
            return testDescriptorList;
        } catch (err) {
            throw err;
        }
    }

    getTestDescriptor = async (id) => {
        try {
            const td = await this.testDescriptorDAO.getTestDescriptor(id);
            return td;
        } catch (err) {
            throw err;
        }
    }

    addTestDescriptor = async (name, procedureDescription, idSKU) => {
        try {
            const sku = await this.skuDAO.getSKU(idSKU);
            const res = await this.testDescriptorDAO.newTestDescriptor(name, procedureDescription, idSKU);
            return res;
        }
        catch (err) {
            throw err;
        }
    }

    modifyTestDescriptor = async (id, newName, newProcedureDescription, newIdSKU) => {
        try {
            const td = await this.testDescriptorDAO.getTestDescriptor(id);
            const skuId = await this.skuDAO.getSKU(newIdSKU);
            const result = await td.modifyTestDescriptorData(newName, newProcedureDescription, newIdSKU, this.testDescriptorDAO);
            return result;
        } catch (err) {
            throw err;
        }
    }

    deleteTestDescriptor = async (id) => {
        try {
            const td = await this.testDescriptorDAO.getTestDescriptor(id);
            const res = await this.testDescriptorDAO.deleteTestDescriptor(id);
            return res;
        }
        catch (err) {
            throw err;
        }
    }

    testDeleteAllTestDescriptors = async () => {
        try {
            await this.testDescriptorDAO.resetTable();
        }
        catch (err) {
            throw err;
        }
    }

    /********* functions for managing Test Result ***********/
    getTestResults = async (rfid) => {
        try {
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);
            const testResultList = await this.testResultDAO.getAllTestResult(rfid);
            return testResultList;
        }
        catch (err) {
            throw err;
        }
    }

    getTestResult = async (rfid, id) => {
        try {
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);
            const testResult = await this.testResultDAO.getTestResult(rfid, id);
            return testResult;
        }
        catch (err) {
            throw err;
        }
    }

    addTestResult = async (rfid, idTestDescriptor, date, result) => {
        try {
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);
            const testDescriptor = await this.testDescriptorDAO.getTestDescriptor(idTestDescriptor);
            const res = await this.testResultDAO.newTestResult(rfid, idTestDescriptor, date, result);
            return res;
        }
        catch (err) {
            throw err;
        }
    }

    modifyTestResult = async (rfid, id, newIdTestDescriptor, newDate, newResult) => {
        try {
            const skuItem = await this.skuItemDAO.getSKUItem(rfid);
            const testDescriptor = await this.testDescriptorDAO.getTestDescriptor(newIdTestDescriptor);
            const tr = await this.testResultDAO.getTestResult(rfid, id);
            const result = await tr.modifyTestResultdata(newIdTestDescriptor, newDate, newResult, this.testResultDAO);
            return result;
        } catch (err) {
            throw err;
        }
    }

    deleteTestResult = async (id, rfid) => {
        try {
            const tr = await this.testResultDAO.getTestResult(rfid, id);
            const res = await this.testResultDAO.deleteTestResult(id, rfid);
            return res;
        }
        catch (err) {
            throw err;
        }
    }

    testDeleteAllTestResults = async () => {
        try {
            await this.testResultDAO.resetTable();
        }
        catch (err) {
            throw err;
        }
    }
}



module.exports = Warehouse;
