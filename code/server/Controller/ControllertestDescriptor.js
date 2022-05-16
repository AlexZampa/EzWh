'use strict';
const Warehouse = require('../Model/Warehouse');
const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const router = express.Router();

const warehouse = new Warehouse();

//get all testDescriptors
router.get('/testDescriptors',
    async (req, res) => {
        try {
            const testDescriptorList = await warehouse.getTestDescriptors();
            const result = [];

            testDescriptorList.forEach(td => { result.push(td.convertToObj()); });
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    });

//get testDescriptor
router.get('/testDescriptors/:id', [check("id").isInt({ min: 1 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const td = await warehouse.getTestDescriptor(req.params.id);
            const result = td.convertToObj();
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    });

//create testDescriptor
router.post('/testDescriptor', [check("name").exists().trim().isAscii(), check("procedureDescription").exists().trim().isAscii(), check("idSKU").exists().isInt({ min: 0 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            await warehouse.addTestDescriptor(req.body.name, req.body.procedureDescription, req.body.idSKU);
            return res.status(201).end();
        } catch (err) {
            console.log(err);
            return res.status().end();
        }
    }
);

//modify testDescriptor
router.put('/testDescriptor/:id', [check("id").exists().isInt({ min: 1 }), check("newName").exists().trim().isAscii(),
check("newProcedureDescription").exists().trim().isAscii(), check("newIdSKU").exists().isInt({ min: 0 })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifyTestDescriptor(req.params.id, req.body.newName, req.body.newProcedureDescription, req.body.newIdSKU);
            return res.status(200).end();
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

//delete testDescriptor
router.delete('/testDescriptor/:id', async (req, res) => {
    try {
        const result = await warehouse.deleteTestDescriptor(req.params.id);
        return res.status(204).end();
    } catch (err) {
        console.log(err);
        switch (err.err) {
            case 422: return res.status(422).end();
            default: return res.status(503).end();
        }
    }
});

module.exports = router;