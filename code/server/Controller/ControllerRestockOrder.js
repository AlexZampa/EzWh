'use strict';
const Warehouse = require('../Model/Warehouse');
const RestockOrder = require('../Model/RestockOrder');

const validateCreateRestockOrderjson = (body) => {
    if (body.issueDate !== undefined || body.products !== undefined || body.supplierId !== undefined)
        return true;
    return false;
}

const validateTransportNotejson = (body) => {
    if (body.transportNote !== undefined)
        return true;
    return false;
};

const validateStateRestockOrderjson = (body) => {
    if (body.newState === "ISSUED" || body.newState === "DELIVERY" || body.newState === "DELIVERED" ||
        body.newState === "TESTED" || body.newState === "COMPLETEDRETURN" || body.newState === "COMPLETED")
        return true;
    return false;
};

const validateAddSKUItems = (body) => {
    if (body.skuItems !== undefined)
        return true;
    return false;
}

class ControllerRestockOrder {
    constructor() {
        this.warehouse = new Warehouse();
    };

    createRestockOrder = async (req, res) => {
        try {
            if (validateCreateRestockOrderjson(req.body)) {
                await this.warehouse.addRestockOrder(req.body.products, req.body.supplierId);
                return res.status(201).json();
            }
            else
                return res.status(422).json();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            return res.status(503).json();
        }
    };

    getRestockOrders = async (req, res) => {
        try {
            const RestockOrderList = await this.warehouse.getRestockOrders();
            const result = [];

            RestockOrderList.forEach(restockOrder => { result.push(restockOrder.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            return res.status(500).json();
        }
    };

    getRestockOrdersIssued = async (req, res) => {
        try {
            const restockOrder = await this.warehouse.getRestockOrdersIssued();
            if (restockOrder !== undefined) {
                const result = restockOrder.convertToObjIssued();
                return res.status(200).json(result);
            }
            return res.status(404).json();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                default: return res.status(500).json();
            }
        }
    };

    getRestockOrderByID = async (req, res) => {
        try {
            const restockOrder = await this.warehouse.getRestockOrderByID(req.params.id);
            if (restockOrder !== undefined) {
                const result = restockOrder.convertToObj();
                return res.status(200).json(result);
            }
            return res.status(404).json();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                default: return res.status(500).json();
            }
        }
    };

    getItemsToReturnFromRO = async (req, res) => {
        try {
            const skuItemsList = await this.warehouse.returnItemsFromRestockOrder(req.params.id);
            if (skuItemsList !== undefined) {
                const result = restockOrder.convertToObj();
                return res.status(200).json(result);
            }
            return res.status(404).json();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                default: return res.status(500).json();
            }
        }
    };

    modifyState = async (req, res) => {
        try {
            if (validateStateRestockOrderjson(req.body)) {
                const res = await this.warehouse.modifyRestockOrderState(req.params.RFID, req.body.newState);
                return res.status(200).json();
            }
            return res.status(422).json();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                case 422: return res.status(422).json();
                default: return res.status(503).json();
            }
        }
    };

    addSKUItems = async (req, res) => {
        try {
            if (validateAddSKUItems(req.body)) {
                const res = await this.warehouse.restockOrderAddSKUItems(req.params.id, req.body.skuItems);
                return res.status(200).json();
            }
            return res.status(422).json();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                case 422: return res.status(422).json();
                default: return res.status(503).json();
            }
        }
    };

    addTransportNote = async (req, res) => {
        try {
            if (validateTransportNotejson(req.body)) {
                const res = await this.warehouse.restockOrderAddTransportNote(req.params.id, req.body.transportNote);
                return res.status(200).json();
            }
            return res.status(422).json();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).json();
                case 422: return res.status(422).json();
                default: return res.status(503).json();
            }
        }
    };

    deleteRestockOrder = async (req, res) => {
        try {
            const res = await this.warehouse.deleteRestockOrder(req.params.id);

            return res.status(204).json();

            // check if user authorized otherwise: return res.status(401).json({});
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

module.exports = ControllerRestockOrder;