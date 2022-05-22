'use strict';

const Warehouse = require('../Model/Warehouse');
const express = require('express');
const {expressValidator, check , validationResult} = require('express-validator');
const router = express.Router();

const warehouse = new Warehouse();


// CREATE NEW USER
router.post('/newUser', 
    [check("username").exists().isEmail(),
     check("name").exists().isAlpha(),
     check("surname").exists().isAlpha(),
     check("password").exists().isString(),
     check("type").exists().isAlpha()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.addUser(req.body.username, req.body.name, req.body.surname, req.body.password, req.body.type);
            return res.status(201).end();
            // check if user authorized otherwise: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 409: return res.status(409).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});

// GET USER INFO
router.get('/userinfo', async (req, res) => {
    try{
        return res.status(200).json();
    } catch(err){
        console.log(err);
        return res.status(500).end();
    }
});


// GET SUPPLIERS
router.get('/suppliers', async (req, res) => {
        try{
            const supplierList = await warehouse.getSuppliers();
            const result = supplierList.map(u => u.convertToObj());
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
});


// GET ALL USERS BUT MANAGERS
router.get('/users', async (req, res) => {
    try{
        const userList = await warehouse.getUsers();
        const result = userList.map(u => u.convertToObj());
        return res.status(200).json(result);
    } catch(err){
        console.log(err);
        return res.status(500).end();
    }
});


// MANAGER SESSION
router.post('/managerSessions', 
    [check("username").exists().isEmail(),
     check("password").exists().isAscii()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(401).end();
            }
            const user = await warehouse.login(req.body.username, req.body.password, "manager");
            const result = {"id" : user.getUserID(), "username" : user.getEmail(), "name" : user.getName()};
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
});



// CUSTOMER SESSION
router.post('/customerSessions', 
    [check("username").exists().isEmail(),
     check("password").exists().isAscii()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(401).end();
            }
            const user = await warehouse.login(req.body.username, req.body.password, "customer");
            const result = {"id" : user.getUserID(), "username" : user.getEmail(), "name" : user.getName()};
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
});




// SUPPLIER SESSION
router.post('/supplierSessions', 
    [check("username").exists().isEmail(),
     check("password").exists().isAscii()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(401).end();
            }
            const user = await warehouse.login(req.body.username, req.body.password, "supplier");
            const result = {"id" : user.getUserID(), "username" : user.getEmail(), "name" : user.getName()};
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
});



// CLERK SESSION
router.post('/clerkSessions', 
    [check("username").exists().isEmail(),
     check("password").exists().isAscii()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(401).end();
            }
            const user = await warehouse.login(req.body.username, req.body.password, "clerk");
            const result = {"id" : user.getUserID(), "username" : user.getEmail(), "name" : user.getName()};
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
});



// QUALITY EMPLOYEE SESSION
router.post('/qualityEmployeeSessions', 
    [check("username").exists().isEmail(),
     check("password").exists().isAscii()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(401).end();
            }
            const user = await warehouse.login(req.body.username, req.body.password, "qualityEmployee");
            const result = {"id" : user.getUserID(), "username" : user.getEmail(), "name" : user.getName()};
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
});




// DELIVERY EMPLOYEE SESSION
router.post('/deliveryEmployeeSessions', 
    [check("username").exists().isEmail(),
     check("password").exists().isAscii()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(401).end();
            }
            const user = await warehouse.login(req.body.username, req.body.password, "deliveryEmployee");
            const result = {"id" : user.getUserID(), "username" : user.getEmail(), "name" : user.getName()};
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
});



// MODIFY USER RIGHTS
router.put('/users/:username', 
    [check("username").exists().isEmail(),
     check("oldType").exists().isAlpha(),
     check("newType").exists().isAlpha()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.modifyUserRights(req.params.username, req.body.oldType, req.body.newType);
            return res.status(200).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();   
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});


// DELETE USER
router.delete('/users/:username/:type', 
    [check("username").exists().isEmail(),
     check("type").exists().isAlpha()],
    async (req, res) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log({ errors: errors.array() });
                return res.status(422).end();
            }
            const result = await warehouse.deleteUser(req.params.username, req.params.type);
            return res.status(204).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(422).end();   // not specified in the API
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
});



// TEST - DELETE ALL USER
router.delete('/test/users', async (req, res) => {
        try{
            const result = await warehouse.testDeleteAllUser();
            return res.status(204).end();
        } catch(err){
            console.log(err);
            return res.status(503).end();
        }
});


module.exports = router;