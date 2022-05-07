'use strict';
const express = require('express');
const ControllerUser = require('./Controller/ControllerUser');
const ControllerSKU = require('./Controller/ControllerSKU');
const ControllerPosition = require('./Controller/ControllerPosition');
const ControllerInternalOrder = require('./Controller/ControllerInternalOrder');

// init express
const app = new express();
const port = 3001;
const controllerUser = new ControllerUser();
const controllerSKU = new ControllerSKU();
const controllerPosition = new ControllerPosition();
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

app.post('/api/managerSessions', controllerUser.loginManager);

/**** SKU  ****/
app.post('/api/sku', controllerSKU.createSKU);
app.get('/api/skus', controllerSKU.getSKUs);
app.get('/api/skus/:id', controllerSKU.getSKUbyID);
app.put('/api/sku/:id', controllerSKU.modifySKU);
app.put('/api/sku/:id/position', controllerSKU.modifySKUposition);
app.delete('/api/skus/:id', controllerSKU.deleteSKU);

/**** POSITION ****/
app.post('/api/position', controllerPosition.createPosition);
app.get('/api/positions', controllerPosition.getPositions);
app.put('/api/position/:positionID', controllerPosition.modifyPosition);
app.put('/api/position/:positionID/changeID', controllerPosition.modifyPositionID);
app.delete('/api/position/:positionID', controllerPosition.deletePosition);

/**** INTERNAL ORDER ****/
app.get('/api/internalOrders', controllerInternalOrder.getInternalOrders);
app.get('/api/internalOrdersIssued', controllerInternalOrder.getInternalOrdersIssued);
app.get('/api/internalOrdersAccepted', controllerInternalOrder.getAcceptedInternalOrders);
app.get('/api/internalOrders/:id', controllerInternalOrder.getInternalOrder);
app.post('/api/internalOrders', controllerInternalOrder.createInternalOrder);
app.put('/api/internalOrders/:id', controllerInternalOrder.setIOStatus);
app.delete('/api/internalOrders/:id', controllerInternalOrder.deleteInternalOrder);


// activate the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;