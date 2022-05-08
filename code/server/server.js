'use strict';
const express = require('express');
const ControllerUser = require('./Controller/ControllerUser');
const ControllerSKU = require('./Controller/ControllerSKU');
const ControllerSKUItem = require('./Controller/ControllerSKUItem');
const ControllerPosition = require('./Controller/ControllerPosition');
const ControllerRestockOrder = require('./Controller/ControllerRestockOrder');
const ControllerInternalOrder = require('./Controller/ControllerInternalOrder');
const { application } = require('express');

// init express
const app = new express();
const port = 3001;
const controllerUser = new ControllerUser();
const controllerSKU = new ControllerSKU();
const controllerSKUItem = new ControllerSKUItem();
const controllerPosition = new ControllerPosition();
const controllerRestockOrder = new ControllerRestockOrder();
const controllerInternalOrder = new ControllerInternalOrder(); 

/*
 * Alessandro -> SKU, Position, User
 * Michele    -> Internal Order, SKUItem
 * Nicola 	  -> Restock Order, Return Order
 * Nicolò 	  -> Test Descriptor, Test Result, Item
 */

app.use(express.json());

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
app.post('/api/sku', controllerSKU.createSKU);
app.get('/api/skus', controllerSKU.getSKUs);
app.get('/api/skus/:id', controllerSKU.getSKUbyID);
app.put('/api/sku/:id', controllerSKU.modifySKU);
app.put('/api/sku/:id/position', controllerSKU.modifySKUposition);
app.delete('/api/skus/:id', controllerSKU.deleteSKU);

/**** SKUITEM ****/
app.post('/api/skuitem', controllerSKUItem.createSKUItem);
app.get('/api/skuitems', controllerSKUItem.getSKUItems);
app.get('/api/skuitems/sku/:id', controllerSKUItem.getSKUItemsBySKUid);
app.get('/api/skuitems/:rfid', controllerSKUItem.getSKUItemByRFID);
app.put('/api/skuitems/:rfid', controllerSKUItem.modifySKUItem);
app.delete('/api/skuitems/:rfid', controllerSKUItem.deleteSKUItem);

/**** POSITION ****/
app.post('/api/position', controllerPosition.createPosition);
app.get('/api/positions', controllerPosition.getPositions);
app.put('/api/position/:positionID', controllerPosition.modifyPosition);
app.put('/api/position/:positionID/changeID', controllerPosition.modifyPositionID);
app.delete('/api/position/:positionID', controllerPosition.deletePosition);

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

/**** USER ****/
app.post('/api/managerSessions', controllerUser.loginManager);
app.post('/api/newUser', controllerUser.createUser);
app.get('/api/suppliers', controllerUser.getSuppliers);
app.get('/api/users',  controllerUser.getUsers);


// activate the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;