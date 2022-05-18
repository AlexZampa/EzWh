'use strict';
const Warehouse = require('../Model/Warehouse');
const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const router = express.Router();

const warehouse = new Warehouse();

//get all items
router.get('/items', async (req, res) => {
    try {
        const itemList = await warehouse.getItems();
        const result = [];
        itemList.forEach(item => {
            result.push(item.convertToObj());
        });
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

//get item by id
router.get('/items/:id', [check("id").isInt({ min: 1 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const item = await warehouse.getItem(req.params.id);
            const result = item.convertToObj();
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    });

//create item
router.post('/item', [check("id").exists().isInt({ min: 0 }), check("description").exists().trim().isAscii(), check("price").exists().isNumeric(), check("SKUId").exists().isInt({ min: 0 }),
check("supplierId").exists().isInt({ min: 0 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            await warehouse.addItem(req.body.description, req.body.price, req.body.SKUId, req.body.supplierId);
            return res.status(201).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();//da controllare
                default: return res.status(503).end();
            }
        }
    }
);

//modify item
router.put('/item/:id', [check("id").exists().isInt({ min: 0 }), check("newDescription").exists().trim().isAscii(), check("newPrice").exists().isNumeric()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            await warehouse.modifyItem(req.params.id, req.body.newDescription, req.body.newPrice);
            return res.status(200).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(503).end();
            }
        }
    }
);

//delete item
router.delete('/items/:id', [check("id").exists().isInt({ min: 0 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.deleteItem(req.params.id);
            return res.status(204).end();
        } catch (err) {
            console.log(err);
            return res.status(503).end();
        }
    });

module.exports = router;