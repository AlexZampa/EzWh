'use strict';
const Warehouse =  require('../Model/Warehouse');
const SKU = require('../Model/Sku');
const Position = require('../Model/Position')


const validateCreatePositionJson = (body) => {
    if(body.positionID === undefined || body.aisleID === undefined || body.row === undefined || body.col === undefined 
        || body.maxWeight === undefined || body.maxVolume === undefined)
        return false;
    return true;
}

class ControllerPosition{

    constructor() {
        this.warehouse = new Warehouse();
    };

    createPosition = async (req, res) => {
        try{
            if(validateCreatePositionJson(req.body)){
                const result = await this.warehouse.addPosition(req.body.positionID, req.body.aisleID, req.body.row, 
                    req.body.col, req.body.maxWeight, req.body.maxVolume);
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
        }
    };  

    getPositions = async (req, res) => {
        try{
            
        }
        catch(err){
            console.log(err);
        }
    };


    deletePosition = async (req, res) => {
        try{
            const result = this.warehouse.deleteSKU(req.params.id);
            return res.status(204).json();
            // check if user authorized otherwise: return res.status(401).json({});
        }
        catch(err){
            console.log(err);
        }
    };


};

module.exports = ControllerPosition;