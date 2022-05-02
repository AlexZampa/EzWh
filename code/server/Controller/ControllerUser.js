'use strict';
const express = require('express');
const Warehouse =  require('../Model/Warehouse')

class ControllerUser{

    constructor(){
        this.warehouse = new Warehouse();
    };

    loginManager = async (req, res) => {
        try{
            const user = await this.warehouse.login(req.body.username, req.body.password);
            if(Object.keys(user).length !== 0)
                return res.status(200).json(user);
            else
                return res.status(401).json({});
        }
        catch(err){
            console.log(err);
        }
        
    }

}


module.exports = ControllerUser;