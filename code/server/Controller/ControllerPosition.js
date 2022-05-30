'use strict';
const Warehouse =  require('../Model/Warehouse');
const express = require('express');
const {expressValidator, check , validationResult} = require('express-validator');
const router = express.Router();


const warehouse = new Warehouse();

// CREATE NEW POSITION
router.post('/position', 
    [check("positionID").exists().isNumeric({no_symbols: true}).notEmpty(),
     check("aisleID").exists().isNumeric({no_symbols: true}).notEmpty(),
     check("row").exists().isNumeric({no_symbols: true}).notEmpty(),
     check("col").exists().isNumeric({no_symbols: true}).notEmpty(),
     check("maxWeight").exists().isInt({min: 1}).notEmpty(),
     check("maxVolume").exists().isInt({min: 1}).notEmpty()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.addPosition(req.body.positionID, req.body.aisleID, req.body.row, 
                req.body.col, req.body.maxWeight, req.body.maxVolume);
            return res.status(201).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            switch(err.err){
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    }  
);


// GET ALL POSITION
router.get('/positions', async (req, res) => {
        try{
            const positionList = await warehouse.getPositions();
            const result = [];
            positionList.forEach(pos => { result.push(pos.convertToObj()); });          
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            return res.status(503).end();
        }
    }  
);

// MODIFY POSITION
router.put('/position/:positionID', 
    [check("positionID").isNumeric({no_symbols: true}).notEmpty(),
     check("newAisleID").exists().isNumeric({no_symbols: true}).notEmpty(),
     check("newRow").exists().isNumeric({no_symbols: true}).notEmpty(), 
     check("newCol").exists().isNumeric({no_symbols: true}).notEmpty(), 
     check("newMaxWeight").exists().isNumeric().notEmpty(), 
     check("newMaxVolume").exists().isNumeric().notEmpty(),
     check("newOccupiedWeight").exists().isNumeric().notEmpty(), 
     check("newOccupiedVolume").exists().isNumeric().notEmpty()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifyPosition(req.params.positionID, req.body.newAisleID, req.body.newRow, req.body.newCol,
            req.body.newMaxWeight, req.body.newMaxVolume, req.body.newOccupiedWeight, req.body.newOccupiedVolume);
            return res.status(200).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    }  
);


// MODIFY POSITION ID
router.put('/position/:positionID/changeID', 
    [check("positionID").isNumeric({no_symbols: true}).notEmpty(),
    check("newPositionID").exists().isNumeric({no_symbols: true}).notEmpty()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifyPositionID(req.params.positionID, req.body.newPositionID);
            return res.status(200).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    }  
);


// DELETE POSITION
router.delete('/position/:positionID',
    [check("positionID").isNumeric({no_symbols: true}).notEmpty()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.deletePosition(req.params.positionID);
            return res.status(204).end();
            // check if user authorized: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    }  
);


// TEST - DELETE ALL POSITION
router.delete('/test/positions', async (req, res) => {
    try{
        const result = await warehouse.testDeleteAllPosition();
        return res.status(204).end();
    } catch(err){
        console.log(err);
        return res.status(503).end();
    }
});




module.exports = router;