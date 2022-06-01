'use strict';

const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const router = express.Router();
const Warehouse = require('../Model/Warehouse');

const warehouse = new Warehouse();


// CREATE NEW SKUITEM
router.post('/skuitem',
    check("SKUId").exists().isInt({ min: 1}),
    check("DateOfStock").optional({ nullable: true }).isString()],
    [check("RFID").optional({ nullable: true }).exists().isString().isLength({min: 32, max: 32}),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.addSKUItem(req.body.RFID, req.body.SKUId, req.body.DateOfStock);
            return res.status(201).end();
            // check if user authorized otherwise: return res.status(401).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    });


// GET ALL SKUITEM
router.get('/skuitems', async (req, res) => {
    try {
        const skuItemList = await warehouse.getSKUItems();
        const result = [];
        skuItemList.forEach(skuItem => { result.push(skuItem.convertToObj()); });
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});


// GET ALL SKUITEM BY SKUID
router.get('/skuitems/sku/:id',
    [check("id").isInt({ min: 1 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const skuItemList = await warehouse.getSKUItemsBySKUid(Number(req.params.id));
            const result = [];
            skuItemList.forEach(skuItem => {
                const obj = skuItem.convertToObj();
                delete obj.Available;
                result.push(obj);
            });
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    });


// GET SKUITEM
router.get('/skuitems/:rfid',
    [check("rfid").optional({ nullable: true }).isString().isLength({min: 32, max: 32})],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const skuItem = await warehouse.getSKUItem(String(req.params.rfid));
            const result = skuItem.convertToObj();
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    });



// MODIFY SKUITEM
router.put('/skuitems/:rfid',
    [check("rfid").isString().isLength({min: 32, max: 32}),
    check("newRFID").exists().isString(),
    check("newAvailable").exists().isInt({ min: 0, max: 1 }),
    check("newDateOfStock").optional({ nullable: true }).exists().isString()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(404).end();
            }
            const result = await warehouse.modifySKUItem(req.params.rfid, req.body.newRFID, req.body.newAvailable, req.body.newDateOfStock);
            return res.status(200).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    });


// DELETE SKUITEM
router.delete('/skuitems/:rfid',
    [check("rfid").isString().isLength({min: 32, max: 32})],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.deleteSKUItem(req.params.rfid);
            return res.status(204).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    });


// TEST - DELETE ALL SKUItems
router.delete('/test/skuitems', async (req, res) => {
    try {
        const result = await warehouse.testDeleteAllSKUItems();
        return res.status(204).end();
    } catch (err) {
        console.log(err);
        return res.status(503).end();
    }
});


module.exports = router;