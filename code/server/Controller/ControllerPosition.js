'use strict';
const Warehouse =  require('../Model/Warehouse');
const SKU = require('../Model/Sku');
const { Position, validatePositionID } = require('../Model/Position');


const validateCreatePositionJson = (body) => {
    if(((body.positionID !== undefined && body.aisleID !== undefined && body.row !== undefined && body.col !== undefined && body.maxWeight !== undefined && body.maxVolume !== undefined)) 
        && validatePositionID(body.positionID, body.aisleID, body.row, body.col))
        return true;
    return false;
}

const validateModifyPositionJson = (body) => {
    if(body.newAisleID !== undefined && body.newRow !== undefined && body.newCol !== undefined && body.newMaxWeight !== undefined 
        && body.newMaxVolume !== undefined && body.newOccupiedWeight !== undefined && body.newOccupiedVolume !== undefined)
        return true;
    return false;
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
                return res.status(201).end();
            }
            return res.status(422).end();
            // check if user authorized: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };  

    getPositions = async (req, res) => {
        try{
            const positionList = await this.warehouse.getPositions();
            const result = [];
            positionList.forEach(pos => { result.push(pos.convertToObj()); });          
            return res.status(200).json(result);
        } catch(err){
            console.log(err);
            return res.status(500).end();
        }
    };

    modifyPosition = async (req, res) => {
        try{
            if(validateModifyPositionJson(req.body)){
                const result = await this.warehouse.modifyPosition(req.params.positionID, req.body.newAisleID, req.body.newRow, req.body.newCol,
                    req.body.newMaxWeight, req.body.newMaxVolume, req.body.newOccupiedWeight, req.body.newOccupiedVolume);
                return res.status(200).end();
            }
            return res.status(422).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    modifyPositionID = async (req, res) => {
        try {
            if(req.body.newPositionID !== undefined){
                const result = await this.warehouse.modifyPositionID(req.params.positionID, req.body.newPositionID);
                return res.status(200).end();
            }
            return res.status(422).end();
        } catch (err){ 
            console.log(err);
            switch(err.err){
                case 404: return res.status(404).end();
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };

    deletePosition = async (req, res) => {
        try{
            const result = await this.warehouse.deletePosition(req.params.positionID);
            return res.status(204).end();
            // check if user authorized: return res.status(401).end();
        } catch(err){
            console.log(err);
            switch(err.err){
                case 404: return res.status(422).end();    // response should be 404 but API.md require 422 in any case
                case 422: return res.status(422).end();
                default: return res.status(503).end();
            }
        }
    };


};

module.exports = ControllerPosition;