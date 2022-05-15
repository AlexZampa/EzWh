'use strict';
const express = require('express');

const ControllerInternalOrder = require('./Controller/ControllerInternalOrder');
const ControllerReturnOrder = require('./Controller/ControllerReturnOrder');

const controllerSKU = require('./Controller/ControllerSKU');
const controllerPosition = require('./Controller/ControllerPosition');
const controllerUser =  require('./Controller/ControllerUser');
const controllerSKUItem = require('./Controller/ControllerSKUItem');
const controllerRestockOrder = require('./Controller/ControllerRestockOrder');


// init express
const app = new express();
const port = 3001;

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
app.use('/api', controllerRestockOrder);



//GET /api/test
app.get('/api/hello', hello);

/* Goes in controller */
function hello(req, res) {
	let message = {
		message: 'Hello World!'
	}
	return res.status(200).json(message);
}


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

// activate the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;