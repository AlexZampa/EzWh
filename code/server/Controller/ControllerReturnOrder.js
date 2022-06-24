"use strict"

const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const Warehouse = require('../Model/Warehouse');
const dayjs = require('dayjs');

const router = express.Router();
const warehouse = new Warehouse();

//GET ALL RETURN ORDERS
router.get('/returnOrders',
    async (req, res) => {

        // check if user authorized otherwise: return res.status(401).json({});

        try {
            const ReturnOrderList = await warehouse.getReturnOrders();
            const result = [];

            ReturnOrderList.forEach(returnOrder => { result.push(returnOrder.convertToObj()); });
            return res.status(200).json(result);

        } catch (err) {
            console.log(err);
            return res.status(500).json();
        }
    }
);

//GET RETURN ORDER BY ID
router.get('/returnOrders/:id',
    [[check("id").isInt({min: 0})]],
    async (req, res) => {

         // check if user authorized otherwise: return res.status(401).end();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

         try {
            const returnOrder = await warehouse.getReturnOrderById(req.params.id);
            if (returnOrder !== undefined) {
                const result = returnOrder.convertToObj();
                return res.status(200).json(result);
            }
            return res.status(404).json();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                default: return res.status(500).json();
            }
        }
    }
);

// CREATE NEW RETURN ORDER
router.post('/returnOrder',
    [check("returnDate").exists().isString(), check("products").exists(), check("restockOrderId").exists().isInt({min: 1})],
    async (req, res) => {

        // check if user authorized otherwise: return res.status(401).json({});

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        if(req.body.returnDate !== dayjs(req.body.returnDate).format('YYYY/MM/DD HH:mm')){
            console.log("returnDate not properly formatted");
            return res.status(422).end();
        }

        try {
            await warehouse.addReturnOrder(req.body.products, req.body.restockOrderId, req.body.returnDate);
            return res.status(201).json();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    }
);

// DELETE RETURN ORDER
router.delete('/returnOrder/:id',
    [check("id").isInt({min: 0})],
    async (req, res) => {
        
        // check if user authorized otherwise: return res.status(401).end();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        try {
            const result = await warehouse.deleteReturnOrder(req.params.id);
            return res.status(204).json();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    }
);

router.delete('/test/returnOrdersBefore', async (req, res) => {
    try{
        const result = await warehouse.testDeleteAllReturnOrders(true);
        return res.status(204).end();
    } catch(err){
        console.log(err);
        return res.status(503).end();
    }
});

router.delete('/test/returnOrders', async (req, res) => {
    try{
        const result = await warehouse.testDeleteAllReturnOrders(false);
        return res.status(204).end();
    } catch(err){
        console.log(err);
        return res.status(503).end();
    }
});

module.exports = router;