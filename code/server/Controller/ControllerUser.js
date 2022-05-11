'use strict';
const Warehouse = require('../Model/Warehouse');
const { userTypes } = require('../Model/User')

const validateCreateUserJson = (body) => {
    if(body.username !== undefined && body.name !== undefined && body.surname !== undefined && body.password !== undefined && body.type !== undefined
        && body.type !== "manager"  && body.type !== "administrator" && body.password.length >= 8)
        return true;
    return false;
};

class ControllerUser{

    constructor(){
        this.warehouse = new Warehouse();
    };


    createUser = async (req, res) => {
        try {
            if(validateCreateUserJson(req.body) && userTypes.find(type => type === req.body.type)){
                const result = await this.warehouse.addUser(req.body.username, req.body.name, req.body.surname, req.body.password, req.body.type);
                return res.status(201).end();
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch(err.err){
                case 409: return res.status(409).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };


    getSuppliers = async (req, res) => {
        try {
            const supplierList = await this.warehouse.getSuppliers();
            const result = supplierList.map(u => u.convertToObj());
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    };


    getUsers = async (req, res) => {
        try {
            const userList = await this.warehouse.getUsers();
            const result = userList.map(u => u.convertToObj());
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    };


    loginManager = async (req, res) => {
        try{
            if(req.body.username !== undefined && req.body.password !== undefined){
                const user = await this.warehouse.login(req.body.username, req.body.password, "manager");
                const result = user.getUserInfo();
                return res.status(200).json(result);
            }
            return res.status(401).end();
        }
        catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
    };

    loginCustomer = async (req, res) => {
        try{
            if(req.body.username !== undefined && req.body.password !== undefined){
                const user = await this.warehouse.login(req.body.username, req.body.password, "customer");
                const result = user.getUserInfo();
                return res.status(200).json(result);
            }
            return res.status(401).end();
        }
        catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
    };

    loginSupplier = async (req, res) => {
        try{
            if(req.body.username !== undefined && req.body.password !== undefined){
                const user = await this.warehouse.login(req.body.username, req.body.password, "supplier");
                const result = user.getUserInfo();
                return res.status(200).json(result);
            }
            return res.status(401).end();
        }
        catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
    };

    loginClerk = async (req, res) => {
        try{
            if(req.body.username !== undefined && req.body.password !== undefined){
                const user = await this.warehouse.login(req.body.username, req.body.password, "clerk");
                const result = user.getUserInfo();
                return res.status(200).json(result);
            }
            return res.status(401).end();
        }
        catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
    };

    loginQualityEmployee = async (req, res) => {
        try{
            if(req.body.username !== undefined && req.body.password !== undefined){
                const user = await this.warehouse.login(req.body.username, req.body.password, "qualityEmployee");
                const result = user.getUserInfo();
                return res.status(200).json(result);
            }
            return res.status(401).end();
        }
        catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
    };


    loginDeliveryEmployee = async (req, res) => {
        try{
            if(req.body.username !== undefined && req.body.password !== undefined){
                const user = await this.warehouse.login(req.body.username, req.body.password, "deliveryEmployee");
                const result = user.getUserInfo();
                return res.status(200).json(result);
            }
            return res.status(401).end();
        }
        catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).end();
                default: return res.status(500).end();
            }
        }
    };


    modifyUserRights = async (req, res) => {
        try {
            if(req.body.oldType !== undefined && req.body.newType !== undefined  && userTypes.filter(t => (t !== "manager" && t !== "administrator")).find(type => type === req.body.newType)){
                const result = await this.warehouse.modifyUserRights(req.params.username, req.body.oldType, req.body.newType);
                return res.status(200).json(result);
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();   
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }    
    };


    deleteUser = async (req, res) => {
        try {
            if(req.params.type !== "manager" && req.params.type !== "administrator"){
                const result = await this.warehouse.deleteUser(req.params.username, req.params.type);
                return res.status(204).end();
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch(err.err){
                case 404: return res.status(422).end();   // not specified in the API
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };


}


module.exports = ControllerUser;