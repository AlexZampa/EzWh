'use strict';
const express = require('express');


const controllerSKU = require('./Controller/ControllerSKU');
const controllerPosition = require('./Controller/ControllerPosition');
const controllerUser =  require('./Controller/ControllerUser');
const controllerSKUItem = require('./Controller/controllerSKUItem');
const controllerRestockOrder = require('./Controller/ControllerRestockOrder');
const controllerInternalOrder = require('./Controller/ControllerInternalOrder');
const controllerReturnOrder = require('./Controller/ControllerReturnOrder');
const ControllerItem = require('./Controller/ControllerItem');
const ControllerTestDescriptor = require('./Controller/ControllertestDescriptor');
const ControllerTestResult = require('./Controller/controllerTestResult');


// init express
const app = new express();
const port = 3001;


// set Middlewares
app.use(express.json());
app.use('/api', controllerSKU);
app.use('/api', controllerPosition);
app.use('/api', controllerUser);
app.use('/api', controllerSKUItem);
app.use('/api', controllerRestockOrder);
app.use('/api', controllerInternalOrder);
app.use('/api', controllerReturnOrder);
app.use('/api', ControllerItem);
app.use('/api', ControllerTestDescriptor);
app.use('/api', ControllerTestResult);



//GET /api/test
app.get('/api/hello', hello);

/* Goes in controller */
function hello(req, res) {
	let message = {
		message: 'Hello World!'
	}
	return res.status(200).json(message);
}

// activate the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
