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
                    return res.status(422).json();
                return res.status(201).json();
            }
            else
                return res.status(422).json();
            // check if user authorized: return res.status(401).json({});
        }
        catch(err){
            console.log(err);
            return res.status(500).json();
        }
    };

    getInternalOrders = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try{
            ioList = this.warehouse.getInternalOrders();
            if(ioList === undefined)
                return res.status(500).json();
            
                jsonResult = ioList.map(io => io.convertToObj());
            if(jsonResult === undefined)
                return res.status(500).json();
            return res.status(200).json(jsonResult);
        }
        catch(err){
            console.log(err);
            return res.status(500).json();
        }
    }

    getInternalOrdersIssued = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try{
            issuedList = this.warehouse.getInternalOrderIssued();
            if(issuedList === undefined)
                return res.status(500).json();
            
                jsonResult = issuedList.map(io => io.convertToObj());
            if(jsonResult === undefined)
                return res.status(500).json();
            return res.status(200).json(jsonResult);
        }
        catch(err){
            console.log(err);
            return res.status(500).json();
        }
    }

    getAcceptedInternalOrders = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        try{
            acceptedList = this.warehouse.getAcceptedInternalOrders();
            if(acceptedList === undefined)
                return res.status(500).json();
            
                jsonResult = acceptedList.map(io => io.convertToObj());
            if(jsonResult === undefined)
                return res.status(500).json();
            return res.status(200).json(jsonResult);
        }
        catch(err){
            console.log(err);
            return res.status(500).json();
        }
    }

    getInternalOrder = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        if(req.params.id === undefined)
        return res.status(422).json();

        try{
            io = this.warehouse.getInternalOrder(req.params.id);
            if(io === undefined)
                return res.status(404).json();
            
                jsonResult = io.convertToObj();
            if(jsonResult === undefined)
                return res.status(500).json();
            return res.status(200).json(jsonResult);
        }
        catch(err){
            console.log(err);
            return res.status(500).json();
        }
    }

    setIOStatus = async (req, res) => {

        // check if user authorized: return res.status(401).json({});

        if(req.params.id === undefined)
        return res.status(422).json();

        try{
            result = this.warehouse.setIOStatus(req.params.id, req.newState, req.products)
            if(result === false)
                return res.status(404).json();
            return res.status(200).json();
        }
        catch(err){
            console.log(err);
            return res.status(503).json();
        }

    }

    deleteInternalOrder = async (req, res) => {

         // check if user authorized: return res.status(401).json({});

         if(req.params.id === undefined)
         return res.status(422).json();
 
         try{
            result = this.warehouse.deleteInternalOrder(req.params.id)
            if(result === false)
                return res.status(404).json();
            return res.status(204).json();
         }
         catch(err){
             console.log(err);
             return res.status(503).json();
         }

    }


}

module.exports = ControllerInternalOrder;