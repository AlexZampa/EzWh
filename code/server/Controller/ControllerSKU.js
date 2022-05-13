'use strict';
const express = require('express');
const {expressValidator, check , validationResult} = require('express-validator');
const router = express.Router();
const Warehouse =  require('../Model/Warehouse');


const warehouse = new Warehouse();


// CREATE NEW SKU
router.post('/sku', 
    [check("description").exists().trim().isAscii(), check("weight").exists().isNumeric(), check("volume").exists().isNumeric(), check("notes").exists().trim().isAscii(), 
     check("price").exists().isNumeric(), check("availableQuantity").exists().isInt({ min: 0})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            await warehouse.addSKU(req.body.description, req.body.weight, req.body.volume, 
                req.body.notes, req.body.price, req.body.availableQuantity);
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
router.get('/skus/:id', [check("id").isInt({ min: 1})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const sku = await warehouse.getSKU(req.params.id);
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
    [check("id").isInt({ min: 1}), check("newDescription").exists().trim().isAscii(), check("newWeight").exists().isNumeric(),
    check("newVolume").exists().isNumeric(), check("newNotes").exists().trim().isAscii(), 
    check("newPrice").exists().isNumeric(), check("newAvailableQuantity").exists().isInt({ min: 0})],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifySKU(req.params.id, req.body.newDescription, req.body.newWeight, req.body.newVolume,
                req.body.newNotes, req.body.newPrice, req.body.newAvailableQuantity);
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
    [check("id").isNumeric()], check("position").exists().isNumeric({no_symbols: true}),
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifySKUposition(req.params.id, req.body.position);
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
router.delete('/skus/:id', async (req, res) => {
        try{
            const result = await warehouse.deleteSKU(req.params.id);
            return res.status(204).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(422).end();      // should be 404 but API require only 422
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});




// const validateCreateSKUjson = (body) => {
//     if(body.description !== undefined || body.weight !== undefined || body.volume !== undefined || body.notes !== undefined 
//         || body.price !== undefined || body.availableQuantity !== undefined)
//         return true;
//     return false;
// }

// const validateModifySKUjson = (body) => {
//     if(body.newDescription !== undefined && body.newWeight !== undefined && body.newVolume !== undefined && body.newNotes !== undefined
//         && body.newPrice !== undefined && body.newAvailableQuantity !== undefined)
//         return true;
//     return false;
// };

// class ControllerSKU{
    
//     constructor(){
//         this.warehouse = new Warehouse();
//     };

//     createSKU = async (req, res) => {
//         try{
//             if(validateCreateSKUjson(req.body)){
//                 await this.warehouse.addSKU(req.body.description, req.body.weight, req.body.volume, 
//                     req.body.notes, req.body.price, req.body.availableQuantity);
//                 return res.status(201).end();
//             }
//             return res.status(422).end();
//             // check if user authorized otherwise: return res.status(401).json({});
//         } catch(err){
//             console.log(err);
//             return res.status(503).end();
//         }
//     };  

//     getSKUs = async (req, res) => {
//         try{
//             const skuList = await this.warehouse.getSKUs();
//             const result = [];
            
//             skuList.forEach(sku => { result.push(sku.convertToObj()); });
//             return res.status(200).json(result);
//             // check if user authorized otherwise: return res.status(401).json({});
//         } catch(err){
//             console.log(err);
//             return res.status(500).end();
//         }
//     };

//     getSKUbyID = async (req, res) => {
//         try{
//             const sku = await this.warehouse.getSKU(req.params.id);
//             if(sku !== undefined){
//                 const result = sku.convertToObj();
//                 return res.status(200).json(result);
//             }
//             return res.status(404).end();
//             // check if user authorized otherwise: return res.status(401).json({});
//         } catch(err){
//             console.log(err);
//             switch(err.err){
//                 case 404: return res.status(404).end();
//                 default: return res.status(500).end();
//             }
//         }
//     };

//     modifySKU = async (req, res) => {
//         try {
//             if(validateModifySKUjson(req.body)){
//                 const result = await this.warehouse.modifySKU(req.params.id, req.body.newDescription, req.body.newWeight, req.body.newVolume,
//                     req.body.newNotes, req.body.newPrice, req.body.newAvailableQuantity);
//                 return res.status(200).end();
//             }
//             return res.status(422).end();
//         } catch (err) {
//             console.log(err);
//             switch(err.err){
//                 case 404: return res.status(404).end();
//                 case 422: return res.status(422).end();
//                 default: return res.status(503).end();
//             }
//         }
//     };

//     modifySKUposition = async (req, res) => {
//         try{
//             if(req.body.position === undefined)
//                 return res.status(422).end();
//             const result = await this.warehouse.modifySKUposition(req.params.id, req.body.position);
//             return res.status(200).end();
//         } catch(err){
//             console.log(err);
//             switch(err.err){
//                 case 404: return res.status(404).end();
//                 case 422: return res.status(422).end();
//                 default: return res.status(503).end();
//             }
//         }
//     };

//     deleteSKU = async (req, res) => {
//         try{
//             const result = await this.warehouse.deleteSKU(req.params.id);
//             return res.status(204).end();
            
//             // check if user authorized otherwise: return res.status(401).json({});
//         } catch(err){
//             console.log(err);
//             switch(err.err){
//                 case 404: return res.status(424).end();      // should be 404 but API require only 422
//                 case 422: return res.status(422).end();
//                 default: return res.status(503).end();
//             }
//         }
//     };

// }
    

   
module.exports = router;