'use strict';
const express = require('express');
const ControllerUser = require('./Controller/ControllerUser');
const ControllerSKU = require('./Controller/ControllerSKU');

// init express
const app = new express();
const port = 3001;
const controllerUser = new ControllerUser();
const controllerSKU = new ControllerSKU();

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

app.post('/api/sku', controllerSKU.createSKU);

app.get('/api/skus', controllerSKU.getSKUs);

app.get('/api/skus/:id', controllerSKU.getSKUbyID);

// activate the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;