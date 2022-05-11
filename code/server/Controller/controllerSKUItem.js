'use strict';
const Warehouse = require('../Model/Warehouse');
const SKUItem = require('../Model/SkuItem');

const validateCreateSKUItemjson = (body) => {
    if (body.RFID !== undefined || body.SKUId !== undefined || body.DateOfStock !== undefined)
        return true;
    return false;
}

const validateModifySKUItemjson = (body) => {
    if (body.newRFID !== undefined && body.newAvailable !== undefined && body.newDateOfStock !== undefined && body.newNotes !== undefined)
        return true;
    return false;
};

class ControllerSKUItem {
    constructor() {
        this.warehouse = new Warehouse();
    };

    createSKUItem = async (req, res) => {
        try {
            if (validateCreateSKUItemjson(req.body)) {
                await this.warehouse.addSKUItem(req.body.RFID, req.body.SKUId, req.body.DateOfStock);
                return res.status(201).end();
            }
            else
                return res.status(422).end();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            return res.status(503).end();
        }
    };

    getSKUItems = async (req, res) => {
        try {
            const skuItemList = await this.warehouse.getSKUItems();
            const result = [];

            skuItemList.forEach(skuItem => { result.push(skuItem.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    };

    getSKUItemsBySKUid = async (req, res) => {
        try {
            const skuItem = await this.warehouse.getSKUItemsBySKUid(req.params.id);
            if (skuItem !== undefined) {
                const result = skuItem.convertToObj();
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

    getSKUItemByRFID = async (req, res) => {
        try {
            const skuItem = await this.warehouse.getSKUItem(req.params.rfid);
            if (skuItem !== undefined) {
                const result = skuItem.convertToObj();
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

    modifySKUItem = async (req, res) => {
        try {
            if (validateModifySKUItemjson(req.body)) {
                const res = await this.warehouse.modifySKUItem(req.params.RFID, req.body.getSKUItemByRFID, req.body.Available, req.body.DateOfStock);
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

    deleteSKUItem = async (req, res) => {
        try {
            const res = await this.warehouse.deleteSKUItem(req.params.rfid);

            return res.status(204).end();

            // check if user authorized otherwise: return res.status(401).json({});
        } catch (err) {
            console.log(err);
            switch (err.err) {
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

}

module.exports = ControllerSKUItem;