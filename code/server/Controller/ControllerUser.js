'use strict';
const Warehouse = require('../Model/Warehouse');

const validateCreateUserJson = (body) => {
    if(body.username !== undefined && body.name !== undefined && body.surname !== undefined && body.password !== undefined && body.type !== undefined
        && body.type !== "manager"  && body.type !== "administrator")
        return true;
    return false;
};

class ControllerUser{

    constructor(){
        this.warehouse = new Warehouse();
    };


    createUser = async (req, res) => {
        try {
            if(validateCreateUserJson(req.body)){
                const result = await this.warehouse.addUser(req.body.username, req.body.name, req.body.surname, req.body.password, req.body.type);
                return res.status(201).json();
            }
            return res.status(422).json();
        } catch (err) {
            console.log(err);
            switch(err.err){
                case 409: return res.status(409).json();
                case 422: return res.status(422).json();
                default: return res.status(503).json();
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
            return res.status(500).json();
        }
    };


    getUsers = async (req, res) => {
        try {
            const userList = await this.warehouse.getUsers();
            const result = userList.map(u => u.convertToObj());
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).json();
        }
    };


    loginManager = async (req, res) => {
        try{
            if(req.body.username !== undefined && req.body.password !== undefined){
                const user = await this.warehouse.loginManager(req.body.username, req.body.password);
                return res.status(200).json();
            }
            return res.status(401).json();
        }
        catch(err){
            console.log(err);
            switch(err.err){
                case 401: return res.status(401).json();
                default: return res.status(500).json();
            }
        }
    }



}


module.exports = ControllerUser;