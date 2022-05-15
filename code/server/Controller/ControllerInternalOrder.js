"use strict";

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
            ioList = warehouse.getInternalOrders();
            if (ioList === undefined)
                return res.status(500).end();

            jsonResult = ioList.map(io => io.convertToObj());
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
            issuedList = warehouse.getInternalOrderIssued();
            if (issuedList === undefined)
                return res.status(500).end();

            jsonResult = issuedList.map(io => io.convertToObj());
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
            acceptedList = warehouse.getAcceptedInternalOrders();
            if (acceptedList === undefined)
                return res.status(500).end();

            jsonResult = acceptedList.map(io => io.convertToObj());
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
    async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        if (req.params.id === undefined)
            return res.status(422).end();

        try {
            io = warehouse.getInternalOrder(req.params.id);
            if (io === undefined)
                return res.status(404).end();

            jsonResult = io.convertToObj();
            if (jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    });

//CREATE NEW INTERNAL ORDER
router.post('/internalOrders',
    [check("issueDate").exists().isDate("YYYY/MM/DD hh:mm"), check("products").exists(), check("customerId").exists().isNumeric()],
    (req, res) => {

        // check if user authorized: return res.status(401).end();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        try {
            await this.warehouse.addInternalOrder(req.body.products, req.body.customerId, req.body.issueDate);
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

//SET INTERNAL ORDER STATUS
router.put('/internalOrders/:id',
    [check("newState").exists().isString()],
    async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        if (req.body.newState !== "ISSUED"
            || req.body.newState !== "ACCEPTED"
            || req.body.newState !== "REFUSED" 
            || req.body.newState !== "CANCELED"
            || req.body.newState !== "COMPLETED") {
            return res.status(422).end();
        }

        try {
            const result = undefined;
            if(req.body.newState === "COMPLETED") {
            result = warehouse.setIOStatus(req.params.id, req.newState, req.products);
            } else {
                result = warehouse.setIOStatus(req.params.id, req.newState, undefined);
            }
            if (result === false)
                return res.status(404).end();
            return res.status(200).end();
        }
        catch (err) {
            console.log(err);
            return res.status(503).end();
        }
    });

//DELETE INTERNAL ORDER
app.delete('/api/internalOrders/:id', controllerInternalOrder.deleteInternalOrder);
router.delete('/internalOrders/:id',
    (req, res) => {
        
        // check if user authorized: return res.status(401).json({});

        if (req.params.id === undefined)
            return res.status(422).end();

        try {
            result = this.warehouse.deleteInternalOrder(req.params.id)
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

module.exports = router;