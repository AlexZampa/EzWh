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


    loginManager = async (req, res) => {
        try{
            const user = await this.warehouse.login(req.body.username, req.body.password);
            if(Object.keys(user).length !== 0)
                return res.status(200).json(user);
            else
                return res.status(401).json();
        }
        catch(err){
            console.log(err);
        }
    }



}


module.exports = ControllerUser;