'use strict';

const express = require('express');
const {expressValidator, check , validationResult} = require('express-validator');
const router = express.Router();
const Warehouse =  require('../Model/Warehouse');

const warehouse = new Warehouse();


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
            const restockOrder = await warehouse.getRestockOrder(Number(req.params.id));
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


/****************  TODO *********************************************/
// GET RESTOCK ORDER RETURN ITEMS
router.get('/restockOrders/:id/returnItems',
    [check("id").isInt({min: 1})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const restockOrder = await warehouse.returnItemsFromRestockOrder(Number(req.params.id));
            // const result = restockOrder.convertToObj();
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
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
            const result = await warehouse.modifyRestockOrderState(Number(req.params.id), req.body.newState);
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
            for(const s of req.body.skuItems){
                if(s.SKUId === undefined || s.rfid === undefined)
                    return res.status(422).end();
                skuItems.push({"skuID" : s.SKUId, "rfid" : s.rfid});
            }
            const result = await warehouse.restockOrderAddSKUItems(Number(req.params.id), skuItems);
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
            const result = await warehouse.restockOrderAddTransportNote(Number(req.params.id), req.body.transportNote.deliveryDate);
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



// DELETE RESTOCK ORDER
router.delete('/restockOrder/:id', 
    [check("id").isInt({min: 1})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.deleteRestockOrder(Number(req.params.id));
            return res.status(204).end();
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch (err.err) {
                case 404: return res.status(422).end();     // API requires 422 in any case
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});


module.exports = router;