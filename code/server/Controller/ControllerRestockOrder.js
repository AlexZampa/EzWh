'use strict';
const express = require('express');
const {expressValidator, check , validationResult} = require('express-validator');
const router = express.Router();
const {RestockOrder, stateList} = require('../Model/RestockOrder');
const Warehouse =  require('../Model/Warehouse');

const warehouse = new Warehouse();

// TODO
// app.get('/api/restockOrders/:id/returnItems', controllerRestockOrder.getItemsToReturnFromRO);


// app.put('/api/restockOrder/:id/skuItems', controllerRestockOrder.addSKUItems);
// app.delete('/api/restockOrder/:id', controllerRestockOrder.deleteRestockOrder);



// CREATE NEW RESTOCK ORDER
router.post('/restockOrder', 
    [check("issueDate").exists().isString(),
    check("products").exists().isArray(), 
    check("supplierId").exists().isInt({min: 1})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.addRestockOrder(req.body.products, req.body.supplierId, req.body.issueDate);
            return res.status(201).end();
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(422).end();        // skuID of a product does not exists
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});


// GET ALL RESTOCK ORDERS
router.get('/restockOrders', async (req, res) => {
        try{
            const restockOrderList = await warehouse.getRestockOrders();
            const result = [];
            restockOrderList.forEach(restockOrder => { result.push(restockOrder.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
});



//  GET ALL RESTOCK ORDERS ISSUED
router.get('/restockOrdersIssued', async (req, res) => {
        try{
            const restockOrderList = await warehouse.getRestockOrdersIssued();
            const result = [];
            restockOrderList.forEach(restockOrder => { result.push(restockOrder.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
});


// GET RESTOCK ORDER
router.get('/restockOrders/:id', [check("id").isInt({min: 1})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const restockOrder = await warehouse.getRestockOrder(req.params.id);
            const result = restockOrder.convertToObj();
            delete result.id;
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
});


// MODIFY RESTOCK ORDER STATE
router.put('/restockOrder/:id', 
    [check("id").isInt({min: 1}),
     check("newState").exists().isAlpha().toUpperCase()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifyRestockOrderState(req.params.id, req.body.newState);
            return res.status(200).end();
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});

// TODO
// ADD SKUITEMS TO RESTOCK ORDER
router.put('/restockOrder/:id/skuItems', 
    [check("id").isInt({min: 1}),
     check("skuItems").exists().isArray()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const skuItems = [];       // skuItems formatted
            req.body.skuItems.forEach(s => {
                console.log(s.SKUId);
                if(s.SKUId === undefined || s.rfid === undefined){
                    // console.log("PROVA");
                    return res.status(422).end();
                }
                skuItems.push({"skuID" : s.SKUId, "rfid" : s.rfid});
            });
            const result = await warehouse.restockOrderAddSKUItems(req.params.id, skuItems);
            return res.status(200).end();
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});



// ADD TRANSPORT NOTE TO RESTOCK ORDER
router.put('/restockOrder/:id/transportNote', 
    [check("id").isInt({min: 1}),
     check("transportNote").exists().isObject(),
     check("transportNote.deliveryDate").exists().isString()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.restockOrderAddTransportNote(req.params.id, req.body.transportNote.deliveryDate);
            return res.status(200).end();
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});




const validateCreateRestockOrderjson = (body) => {
    if (body.issueDate !== undefined || body.products !== undefined || body.supplierId !== undefined)
        return true;
    return false;
}

const validateTransportNotejson = (body) => {
    if (body.transportNote !== undefined && body.transportNote.deliveryDate !== undefined)
        return true;
    return false;
};

const validateStateRestockOrderjson = (body) => {
    if (body.newState !== undefined && stateList.find(state => state === body.newState))
        return true;
    return false;
};

const validateAddSKUItems = (body) => {
    if (body.skuItems !== undefined)
        return true;
    return false;
}

class ControllerRestockOrder {
    constructor() {
        this.warehouse = new Warehouse();
    };

    createRestockOrder = async (req, res) => {
        try {
            if (validateCreateRestockOrderjson(req.body)) {
                await this.warehouse.addRestockOrder(req.body.products, req.body.supplierId, req.body.issueDate);
                return res.status(201).end();
            }
            else
                return res.status(422).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch(err.err){
                case 404: return res.status(422).end();        // skuID of a product does not exists
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    getRestockOrders = async (req, res) => {
        try {
            const RestockOrderList = await this.warehouse.getRestockOrders();
            const result = [];

            RestockOrderList.forEach(restockOrder => { result.push(restockOrder.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    };

    getRestockOrdersIssued = async (req, res) => {
        try {
            const RestockOrderList = await this.warehouse.getRestockOrdersIssued();
            const result = [];
            RestockOrderList.forEach(restockOrder => { result.push(restockOrder.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    };

    getRestockOrderByID = async (req, res) => {
        try {
            const restockOrder = await this.warehouse.getRestockOrder(req.params.id);
            if (restockOrder !== undefined) {
                const result = restockOrder.convertToObj();
                delete result.id;
                return res.status(200).json(result);
            }
            return res.status(404).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    };

    getItemsToReturnFromRO = async (req, res) => {
        try {
            const skuItemsList = await this.warehouse.returnItemsFromRestockOrder(req.params.id);
            if (skuItemsList !== undefined) {
                const result = restockOrder.convertToObj();     // TODO: restockOrder does not exist
                return res.status(200).json(result);
            }
            return res.status(404).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    };

    modifyState = async (req, res) => {
        try {
            if (validateStateRestockOrderjson(req.body)) {
                const result = await this.warehouse.modifyRestockOrderState(req.params.id, req.body.newState);
                return res.status(200).end();
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    addSKUItems = async (req, res) => {
        try {
            if (validateAddSKUItems(req.body)) {
                const result = await this.warehouse.restockOrderAddSKUItems(req.params.id, req.body.skuItems);
                return res.status(200).end();
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    addTransportNote = async (req, res) => {
        try {
            if (validateTransportNotejson(req.body)) {
                const result = await this.warehouse.restockOrderAddTransportNote(req.params.id, req.body.transportNote.deliveryDate);
                return res.status(200).end();
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    deleteRestockOrder = async (req, res) => {
        try {
            const result = await this.warehouse.deleteRestockOrder(req.params.id);
            return res.status(204).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(422).end();     // API requires 422 in any case
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

}

// module.exports = ControllerRestockOrder;

module.exports = router;