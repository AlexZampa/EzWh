'use strict';
const Warehouse = require('../Model/Warehouse');
const {RestockOrder, stateList} = require('../Model/RestockOrder');

const validateCreateRestockOrderjson = (body) => {
    if (body.issueDate !== undefined || body.products !== undefined || body.supplierId !== undefined)
        return true;
    return false;
}

const validateTransportNotejson = (body) => {
    if (body.transportNote !== undefined && body.transportNote.deliveryDate !== undefined)
        return true;
    return false;
};

const validateStateRestockOrderjson = (body) => {
    if (body.newState !== undefined && stateList.find(state => state === body.newState))
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
                await this.warehouse.addRestockOrder(req.body.products, req.body.supplierId, req.body.issueDate);
                return res.status(201).end();
            }
            else
                return res.status(422).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch(err.err){
                case 404: return res.status(422).end();        // skuID of a product does not exists
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
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
            return res.status(500).end();
        }
    };

    getRestockOrdersIssued = async (req, res) => {
        try {
            const RestockOrderList = await this.warehouse.getRestockOrdersIssued();
            const result = [];
            RestockOrderList.forEach(restockOrder => { result.push(restockOrder.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    };

    getRestockOrderByID = async (req, res) => {
        try {
            const restockOrder = await this.warehouse.getRestockOrder(req.params.id);
            if (restockOrder !== undefined) {
                const result = restockOrder.convertToObj();
                delete result.id;
                return res.status(200).json(result);
            }
            return res.status(404).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    };

    getItemsToReturnFromRO = async (req, res) => {
        try {
            const skuItemsList = await this.warehouse.returnItemsFromRestockOrder(req.params.id);
            if (skuItemsList !== undefined) {
                const result = restockOrder.convertToObj();     // TODO: restockOrder does not exist
                return res.status(200).json(result);
            }
            return res.status(404).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                default: return res.status(500).end();
            }
        }
    };

    modifyState = async (req, res) => {
        try {
            if (validateStateRestockOrderjson(req.body)) {
                const result = await this.warehouse.modifyRestockOrderState(req.params.id, req.body.newState);
                return res.status(200).end();
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    addSKUItems = async (req, res) => {
        try {
            if (validateAddSKUItems(req.body)) {
                const result = await this.warehouse.restockOrderAddSKUItems(req.params.id, req.body.skuItems);
                return res.status(200).end();
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    addTransportNote = async (req, res) => {
        try {
            if (validateTransportNotejson(req.body)) {
                const result = await this.warehouse.restockOrderAddTransportNote(req.params.id, req.body.transportNote.deliveryDate);
                return res.status(200).end();
            }
            return res.status(422).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    deleteRestockOrder = async (req, res) => {
        try {
            const result = await this.warehouse.deleteRestockOrder(req.params.id);
            return res.status(204).end();
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(422).end();     // API requires 422 in any case
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

}

module.exports = ControllerRestockOrder;