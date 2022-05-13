"use strict"

const Warehouse = require('../Model/Warehouse');

const validateCreateReturnOrderjson = (body) => {
    if (body.returnDate !== undefined || body.products !== undefined || body.restockOrderId !== undefined)
        return true;
    return false;
}

class ControllerReturnOrder {
    constructor() {
        this.warehouse = new Warehouse();
    };

    createReturnOrder = async (req, res) => {

        // check if user authorized otherwise: return res.status(401).json({});

        try {
            if (validateCreateReturnOrderjson(req.body)) {
                await this.warehouse.addReturnOrder(req.body.products, req.body.restockOrderId, req.body.returnDate);
                return res.status(201).json();
            }
            else
                return res.status(422).json();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            return res.status(500).json();
        }
    }

    getReturnOrders = async (req, res) => {

        // check if user authorized otherwise: return res.status(401).json({});

        try {
            const ReturnOrderList = await this.warehouse.getReturnOrders();
            const result = [];

            ReturnOrderList.forEach(returnOrder => { result.push(returnOrder.convertToObj()); });
            return res.status(200).json(result);
            
        } catch (err) {
            console.log(err);
            return res.status(500).json();
        }
    };

    getReturnOrderByID = async (req, res) => {

        // check if user authorized otherwise: return res.status(401).json({});

        try {
            const returnOrder = await this.warehouse.getReturnOrderByID(req.params.id);
            if (returnOrder !== undefined) {
                const result = returnOrder.convertToObj();
                return res.status(200).json(result);
            }
            return res.status(404).json();        
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                default: return res.status(500).json();
            }
        }
    };

    deleteReturnOrder = async (req, res) => {

        // check if user authorized otherwise: return res.status(401).json({});

        try {
            const res = await this.warehouse.deleteReturnOrder(req.params.id);

            return res.status(204).json();

            
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                case 422: return res.status(422).json();
                default: return res.status(503).json();
            }
        }
    };



}


module.exports = ControllerReturnOrder;