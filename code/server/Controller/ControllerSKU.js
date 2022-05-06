'use strict';
const Warehouse =  require('../Model/Warehouse');
const SKU = require('../Model/Sku');
const { Position } = require('../Model/Position')

const validateCreateSKUjson = (body) => {
    if(body.description === undefined || body.weight === undefined || body.volume === undefined || body.notes === undefined 
        || body.price === undefined || body.availableQuantity === undefined)
        return false;
    return true;
}

class ControllerSKU{
    
    constructor(){
        this.warehouse = new Warehouse();
    };
    
    createSKU = async (req, res) => {
        try{
            if(validateCreateSKUjson(req.body)){
                await this.warehouse.addSKU(req.body.description, req.body.weight, req.body.volume, 
                    req.body.notes, req.body.price, req.body.availableQuantity);
                return res.status(201).json();
            }
            else
                return res.status(422).json();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            return res.status(503).json();
        }
    };  

    getSKUs = async (req, res) => {
        try{
            const skuList = await this.warehouse.getSKUs();
            const result = [];
            
            skuList.forEach(sku => { result.push(sku.convertToObj()); });
            return res.status(200).json(result);
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            return res.status(500).json();
        }
    };

    getSKUbyID = async (req, res) => {
        try{
            const sku = await this.warehouse.getSKU(req.params.id);
            if(sku !== undefined){
                const result = sku.convertToObj();
                return res.status(200).json(result);
            }
            return res.status(404).json();
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).json();
                default: return res.status(500).json();
            }
        }
    };

    modifySKUposition = async (req, res) => {
        try{
            if(req.body.position === undefined)
                return res.status(422).json();
            const result = await this.warehouse.modifySKUposition(req.params.id, req.body.position);
            if(result === undefined)
                return res.status(422).json();
            return res.status(200).json();
        } catch(err){
            console.log(err);
            return res.status(503).json();
        }
    };

    deleteSKU = async (req, res) => {
        try{
            const result = await this.warehouse.deleteSKU(req.params.id);
           
            return res.status(204).json();
            
            // check if user authorized otherwise: return res.status(401).json({});
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).json();
                case 422: return res.status(422).json();
                default: return res.status(503).json();
            }
        }
    };

}
    

   
module.exports = ControllerSKU;