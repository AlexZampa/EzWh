"use strict";

const dayjs = require('dayjs');
const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const Warehouse = require('../Model/Warehouse');

const router = express.Router();
const warehouse = new Warehouse();

//GET ALL INTERNAl ORDERS
router.get('/internalOrders',
    async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try {
            const ioList = await warehouse.getInternalOrders();
            if (ioList === undefined)
                return res.status(500).end();
            
            const jsonResult = ioList.map(io => io.convertToObj());
            if (jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    });

//GET ALL ISSUED INTERNAL ORDERS
router.get('/internalOrdersIssued',
    async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try {
            const issuedList = await warehouse.getInternalOrderIssued();
            if (issuedList === undefined)
                return res.status(500).end();

            const jsonResult = issuedList.map(io => io.convertToObj());
            if (jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    });

//GET ALL ACCEPTED INTERNAL ORDERS
router.get('/internalOrdersAccepted',
    async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try {
            const acceptedList = await warehouse.getAcceptedInternalOrders();
            if (acceptedList === undefined)
                return res.status(500).end();

            const jsonResult = acceptedList.map(io => io.convertToObj());
            if (jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    });

//GET INTERNAL ORDER BY ID
router.get('/internalOrders/:id',
    [
        check("id").exists().isInt({min: 1})
    ],
    async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        if (req.params.id === undefined){
            return res.status(422).end();
        }

        try {
            const io = await warehouse.getInternalOrder(req.params.id);
            if (io === undefined) {
                return res.status(404).end();
            }

            const jsonResult = io.convertToObj();
            if (jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(500).end();
            }
        }
    });

//CREATE NEW INTERNAL ORDER
router.post('/internalOrders',
    [
        check("issueDate").exists().isString(), 
        check("products").exists().isArray(), 
        check("customerId").exists().isInt({min: 1})
    ],
    async (req, res) => {

        // check if user authorized: return res.status(401).end();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        req.body.products.forEach( p => {
            if(p.SKUId === undefined || p.description === undefined || p.price === undefined || p.qty === undefined){
                console.log("Products not correctly defined");
                return res.status(422).end();
            }
        })

        //console.log(req.body.issueDate);
        //console.log(dayjs(req.body.issueDate).format('YYYY/MM/DD HH:mm'));
            
        if(req.body.issueDate !== dayjs(req.body.issueDate).format('YYYY/MM/DD HH:mm')){
            console.log("IssueDate not properly formatted");
            return res.status(422).end();
        }
        

        try {
            await warehouse.addInternalOrder(req.body.products, req.body.customerId, req.body.issueDate);
            return res.status(201).end();
        }
        catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(503).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    });

//SET INTERNAL ORDER STATUS
router.put('/internalOrders/:id',
    [check("newState").exists().isString(), check("id").exists().isInt({min: 1})],
    async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        if (req.body.newState !== "ISSUED"
            && req.body.newState !== "ACCEPTED"
            && req.body.newState !== "REFUSED" 
            && req.body.newState !== "CANCELED"
            && req.body.newState !== "COMPLETED") {
            return res.status(422).end();
        }

        try {
            let result = undefined;
            if(req.body.newState === "COMPLETED") {
            result = await warehouse.setIOStatus(req.params.id, req.body.newState, req.body.products);
            } else {
                result = await warehouse.setIOStatus(req.params.id, req.body.newState, undefined);
            }
            if (result === false)
                return res.status(404).end();
            return res.status(200).end();
        }
        catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    });

//DELETE INTERNAL ORDER
// app.delete('/api/internalOrders/:id', controllerInternalOrder.deleteInternalOrder);
router.delete('/internalOrders/:id',
    [check("id").exists().isInt({min: 1})],
    async (req, res) => {
        
        // check if user authorized: return res.status(401).json({});

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        if (req.params.id === undefined)
            return res.status(422).end();

        try {
            const result = await warehouse.deleteInternalOrder(req.params.id)
            if (result === false)
                return res.status(422).end();
            return res.status(204).end();
        }
        catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(422).end();         // API requires 422 in any case   
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    });

// TEST - DELETE ALL SKU
router.delete('/test/internalOrders', async (req, res) => {
    try{
        const result = await warehouse.testDeleteAllInternalOrders();
        return res.status(204).end();
    } catch(err){
        console.log(err);
        return res.status(503).end();
    }
});

module.exports = router;