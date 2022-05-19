'use strict';
const Warehouse = require('../Model/Warehouse');
const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const router = express.Router();

const warehouse = new Warehouse();

//get testResults
router.get('/skuitems/:rfid/testResults', [check("rfid").exists().isNumeric()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        const trList = await warehouse.getTestResults(req.params.rfid);
        const result = [];

        trList.forEach(tr => { result.push(tr.convertToObj()); });
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        switch (err.err) {
            case 404: return res.status(404).end();
            case 422: return res.status(422).end();
            default: return res.status(500).end();
        }
    }
});

//get testResult
router.get('/skuitems/:rfid/testResults/:id', [check("rfid").exists().isNumeric(), check("id").exists().isInt({ min: 1 })], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.status(422).end();
        }

        const testResult = await warehouse.getTestResult(req.params.rfid, Number(req.params.id));
        const result = testResult.convertToObj();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        switch (err.err) {
            case 404: return res.status(404).end();
            case 422: return res.status(422).end();
            default: return res.status(500).end();
        }
    }
});

//create testResult
router.post('/skuitems/testResult',
    [check("rfid").exists().isNumeric(), check("idTestDescriptor").exists().isInt(), check("Date").exists(), check("Result").exists()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            await warehouse.addTestResult(req.body.rfid, req.body.idTestDescriptor, req.body.Date, req.body.Result);
            return res.status(201).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(503).end();
            }
        }
    });


//modify testResult
router.put('/skuitems/:rfid/testResult/:id',
    [check("rfid").exists().isNumeric(), check("id").exists().isInt(),
    check("newIdTestDescriptor").exists().trim().isAscii(),
    check("newDate").exists().isString(),
    check("newResult").exists()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifyTestResult(req.params.rfid, req.params.id, req.body.newIdTestDescriptor, req.body.newDate, req.body.newResult);
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

//delete testResult
router.delete('/skuitems/:rfid/testResult/:id', [check("rfid").exists().isNumeric(), check("id").exists().isInt()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.deleteTestResult(req.params.id, req.params.rfid);
            return res.status(204).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    }

);

module.exports = router;