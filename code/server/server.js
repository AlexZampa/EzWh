'use strict';
const express = require('express');
// const ControllerUser = require('./Controller/ControllerUser');
// const ControllerSKU = require('./Controller/ControllerSKU');
// const ControllerPosition = require('./Controller/ControllerPosition');
// const ControllerSKUItem = require('./Controller/ControllerSKUItem');
const ControllerRestockOrder = require('./Controller/ControllerRestockOrder');
const ControllerInternalOrder = require('./Controller/ControllerInternalOrder');
const ControllerReturnOrder = require('./Controller/ControllerReturnOrder');

const controllerSKU = require('./Controller/ControllerSKU');
const controllerPosition = require('./Controller/ControllerPosition');
const controllerUser =  require('./Controller/ControllerUser');
const controllerSKUItem = require('./Controller/ControllerSKUItem');

// init express
const app = new express();
const port = 3001;

// const controllerUser = new ControllerUser();
// const controllerSKU = new ControllerSKU();
// const controllerPosition = new ControllerPosition();
// const controllerSKUItem = new ControllerSKUItem();
const controllerRestockOrder = new ControllerRestockOrder();
const controllerInternalOrder = new ControllerInternalOrder();
const controllerReturnOrder = new ControllerReturnOrder(); 

/*
 * Alessandro -> SKU, Position, User
 * Michele    -> Internal Order, SKUItem
 * Nicola 	  -> Restock Order, Return Order
 * Nicolò 	  -> Test Descriptor, Test Result, Item
 */

// set Middlewares
app.use(express.json());
app.use('/api', controllerSKU);
app.use('/api', controllerPosition);
app.use('/api', controllerUser);
app.use('/api', controllerSKUItem);

//GET /api/test
app.get('/api/hello', hello);

/* Goes in controller */
function hello(req, res) {
	let message = {
		message: 'Hello World!'
	}
	return res.status(200).json(message);
}


/**** SKU  ****/
// app.post('/api/sku', controllerSKU.createSKU);
// app.get('/api/skus', controllerSKU.getSKUs);
// app.get('/api/skus/:id', controllerSKU.getSKUbyID);
// app.put('/api/sku/:id', controllerSKU.modifySKU);
// app.put('/api/sku/:id/position', controllerSKU.modifySKUposition);
// app.delete('/api/skus/:id', controllerSKU.deleteSKU);

/**** SKUITEM ****/
// app.post('/api/skuitem', controllerSKUItem.createSKUItem);
// app.get('/api/skuitems', controllerSKUItem.getSKUItems);
// app.get('/api/skuitems/sku/:id', controllerSKUItem.getSKUItemsBySKUid);
// app.get('/api/skuitems/:rfid', controllerSKUItem.getSKUItemByRFID);
// app.put('/api/skuitems/:rfid', controllerSKUItem.modifySKUItem);
// app.delete('/api/skuitems/:rfid', controllerSKUItem.deleteSKUItem);

/**** POSITION ****/
// app.post('/api/position', controllerPosition.createPosition);
// app.get('/api/positions', controllerPosition.getPositions);
// app.put('/api/position/:positionID', controllerPosition.modifyPosition);
// app.put('/api/position/:positionID/changeID', controllerPosition.modifyPositionID);
// app.delete('/api/position/:positionID', controllerPosition.deletePosition);

/**** RESTOCK ORDER ****/
app.post('/api/restockOrder', controllerRestockOrder.createRestockOrder);
app.get('/api/restockOrders', controllerRestockOrder.getRestockOrders);
app.get('/api/restockOrdersIssued', controllerRestockOrder.getRestockOrdersIssued);
app.get('/api/restockOrders/:id', controllerRestockOrder.getRestockOrderByID);
app.get('/api/restockOrders/:id/returnItems', controllerRestockOrder.getItemsToReturnFromRO);
app.put('/api/restockOrder/:id', controllerRestockOrder.modifyState);
app.put('/api/restockOrder/:id/skuItems', controllerRestockOrder.addSKUItems);
app.put('/api/restockOrder/:id/transportNote', controllerRestockOrder.addTransportNote);
app.delete('/api/restockOrder/:id', controllerRestockOrder.deleteRestockOrder);

/**** INTERNAL ORDER ****/
app.get('/api/internalOrders', controllerInternalOrder.getInternalOrders);
app.get('/api/internalOrdersIssued', controllerInternalOrder.getInternalOrdersIssued);
app.get('/api/internalOrdersAccepted', controllerInternalOrder.getAcceptedInternalOrders);
app.get('/api/internalOrders/:id', controllerInternalOrder.getInternalOrder);
app.post('/api/internalOrders', controllerInternalOrder.createInternalOrder);
app.put('/api/internalOrders/:id', controllerInternalOrder.setIOStatus);
app.delete('/api/internalOrders/:id', controllerInternalOrder.deleteInternalOrder);

/**** RETURN ORDER ****/
// app.get('/api/returnOrders', controllerReturnOrder.getReturnOrders);
// app.get('/api/returnOrders/:id', controllerReturnOrder.getReturnOrderById);
// app.post('/api/returnOrder', controllerReturnOrder.createReturnOrder);
// app.delete('/api/returnOrder/:id', controllerReturnOrder.deleteReturnOrder);

/**** USER ****/
// app.get('/api/suppliers', controllerUser.getSuppliers);
// app.get('/api/users',  controllerUser.getUsers);
// app.post('/api/newUser', controllerUser.createUser);
// app.post('/api/managerSessions', controllerUser.loginManager);
// app.post('/api/customerSessions', controllerUser.loginCustomer);
// app.post('/api/supplierSessions', controllerUser.loginSupplier);
// app.post('/api/clerkSessions', controllerUser.loginClerk);
// app.post('/api/qualityEmployeeSessions', controllerUser.loginQualityEmployee);
// app.post('/api/deliveryEmployeeSessions', controllerUser.loginDeliveryEmployee);
// app.put('/api/users/:username', controllerUser.modifyUserRights);
// app.delete('/api/users/:username/:type', controllerUser.deleteUser);

// activate the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;