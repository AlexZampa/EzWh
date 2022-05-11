"use strict";

const Warehouse =  require('../Model/Warehouse');
const SKU = require('../Model/Sku');

const validateCreateInternalOrderjson = (body) => {
    if(body.products === undefined || body.customerId === undefined || body.issueDate === undefined)
        return false;
    return true;
}

class ControllerInternalOrder{

    constructor() {
        this.warehouse = new Warehouse();
    };

    createInternalOrder = async (req, res) => {
        try{
            if(validateCreateInternalOrderJson(req.body)){
                const result = await this.warehouse.addInternalOrder(req.body.products, req.body.customerId, req.body.issueDate);
                if(result === undefined)
                    return res.status(422).end();
                return res.status(201).end();
            }
            else
                return res.status(422).end();
            // check if user authorized: return res.status(401).end();
        }
        catch(err){
            console.log(err);
            return res.status(500).end();
        }
    };

    getInternalOrders = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try{
            ioList = this.warehouse.getInternalOrders();
            if(ioList === undefined)
                return res.status(500).end();
            
                jsonResult = ioList.map(io => io.convertToObj());
            if(jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch(err){
            console.log(err);
            return res.status(500).end();
        }
    }

    getInternalOrdersIssued = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try{
            issuedList = this.warehouse.getInternalOrderIssued();
            if(issuedList === undefined)
                return res.status(500).end();
            
                jsonResult = issuedList.map(io => io.convertToObj());
            if(jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch(err){
            console.log(err);
            return res.status(500).end();
        }
    }

    getAcceptedInternalOrders = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try{
            acceptedList = this.warehouse.getAcceptedInternalOrders();
            if(acceptedList === undefined)
                return res.status(500).end();
            
                jsonResult = acceptedList.map(io => io.convertToObj());
            if(jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch(err){
            console.log(err);
            return res.status(500).end();
        }
    }

    getInternalOrder = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        if(req.params.id === undefined)
        return res.status(422).end();

        try{
            io = this.warehouse.getInternalOrder(req.params.id);
            if(io === undefined)
                return res.status(404).end();
            
                jsonResult = io.convertToObj();
            if(jsonResult === undefined)
                return res.status(500).end();
            return res.status(200).json(jsonResult);
        }
        catch(err){
            console.log(err);
            return res.status(500).end();
        }
    }

    setIOStatus = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        if(req.params.id === undefined)
        return res.status(422).end();

        try{
            result = this.warehouse.setIOStatus(req.params.id, req.newState, req.products)
            if(result === false)
                return res.status(404).end();
            return res.status(200).end();
        }
        catch(err){
            console.log(err);
            return res.status(503).end();
        }

    }

    deleteInternalOrder = async (req, res) => {

         // check if user authorized: return res.status(401).json({});

         if(req.params.id === undefined)
         return res.status(422).end();
 
         try{
            result = this.warehouse.deleteInternalOrder(req.params.id)
            if(result === false)
                return res.status(404).end();
            return res.status(204).end();
         }
         catch(err){
             console.log(err);
             return res.status(503).end();
         }

    }


}

module.exports = ControllerInternalOrder;