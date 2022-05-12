'use strict';
const Warehouse = require('../Model/Warehouse');
const SKUItem = require('../Model/SkuItem');

const validateCreateSKUItemjson = (body) => {
    if (body.RFID !== undefined || body.SKUId !== undefined || body.DateOfStock !== undefined)
        return true;
    return false;
}

const validateModifySKUItemjson = (body) => {
    if (body.newRFID !== undefined && body.newAvailable !== undefined && body.newDateOfStock !== undefined)
        return true;
    return false;
};

class ControllerSKUItem {
    constructor() {
        this.warehouse = new Warehouse();
    };

    createSKUItem = async (req, res) => {
        try {
            if(validateCreateSKUItemjson(req.body)) {
                await this.warehouse.addSKUItem(req.body.RFID, req.body.SKUId, req.body.DateOfStock);
                return res.status(201).end();
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

    getSKUItems = async (req, res) => {
        try {
            const skuItemList = await this.warehouse.getSKUItems();
            const result = [];
            skuItemList.forEach(skuItem => { result.push(skuItem.convertToObj()); });
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    };

    getSKUItemsBySKUid = async (req, res) => {
        try {
            if(Number(req.params.id)){
                const skuItemList = await this.warehouse.getSKUItemsBySKUid(Number(req.params.id));
                const result = [];
                skuItemList.forEach(skuItem => { 
                    const obj = skuItem.convertToObj();
                    delete obj.Available;
                    result.push(obj);
                });
                return res.status(200).json(result);
            }
            return res.status(422).end();
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
            const result = skuItem.convertToObj();
            return res.status(200).json(result);
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
                const result = await this.warehouse.modifySKUItem(req.params.rfid, req.body.newRFID, req.body.newAvailable, req.body.newDateOfStock);
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
            const result = await this.warehouse.deleteSKUItem(req.params.rfid);
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

module.exports = ControllerSKUItem;