'use strict';

const express = require('express');
const {expressValidator, check , validationResult} = require('express-validator');
const router = express.Router();
const Warehouse =  require('../Model/Warehouse');


const warehouse = new Warehouse();


// CREATE NEW SKU
router.post('/sku', 
    [check("description").exists().isString().trim().notEmpty(),
     check("weight").exists().isInt({min: 1}),
     check("volume").exists().isInt({min: 1}),
     check("notes").exists().isString().trim().notEmpty(), 
     check("price").exists().isNumeric(),
     check("availableQuantity").exists().isInt({ min: 0})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            await warehouse.addSKU(req.body.description, Number(req.body.weight), Number(req.body.volume), 
                req.body.notes, Number(req.body.price), Number(req.body.availableQuantity));
            return res.status(201).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            switch(err.err){
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});


// GET ALL SKU
router.get('/skus', async (req, res) => {
        try{
            const skuList = await warehouse.getSKUs();
            const result = [];
            skuList.forEach(sku => { result.push(sku.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
});


// GET SKU BY ID
router.get('/skus/:id', [check("id").isInt({ min: 1}).notEmpty()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const sku = await warehouse.getSKU(Number(req.params.id));
            const result = sku.convertToObj();
            delete result.id;
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
});


// MODIFY SKU 
router.put('/sku/:id', 
    [check("id").isInt({ min: 1}).notEmpty(),
     check("newDescription").exists().isString().trim().notEmpty(),
     check("newWeight").exists().isNumeric(),
     check("newVolume").exists().isNumeric(),
     check("newNotes").exists().isString().trim().notEmpty(), 
     check("newPrice").exists().isNumeric(),
     check("newAvailableQuantity").exists().isInt({ min: 0})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifySKU(Number(req.params.id), req.body.newDescription, Number(req.body.newWeight), Number(req.body.newVolume),
                req.body.newNotes, Number(req.body.newPrice), Number(req.body.newAvailableQuantity));
            return res.status(200).end();
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(500).end();
            }
        }
});


// MODIFY SKU POSITION
router.put('/sku/:id/position',
    [check("id").isNumeric().notEmpty()], 
    check("position").exists().isNumeric({no_symbols: true}).notEmpty(),
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifySKUposition(Number(req.params.id), req.body.position);
            return res.status(200).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(500).end();
            }
        }
});


// DELETE SKU
router.delete('/skus/:id', [check("id").isNumeric().notEmpty()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.deleteSKU(Number(req.params.id));
            return res.status(204).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            switch(err.err){
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});


// TEST - DELETE ALL SKU
router.delete('/test/skus', async (req, res) => {
    try{
        const result = await warehouse.testDeleteAllSKU();
        return res.status(204).end();
    } catch(err){
        console.log(err);
        return res.status(503).end();
    }
});



   
module.exports = router;