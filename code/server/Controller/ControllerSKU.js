'use strict';
const Warehouse =  require('../Model/Warehouse');

const validateCreateSKUjson = (body) => {
    if(body.description === undefined || body.weight === undefined || body.volume === undefined || body.notes === undefined 
        || body.price === undefined || body.availableQuantity === undefined)
        return false;
    else
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
            }
        catch(err){
            console.log(err);
        }
    };  

    getSKUs = async (req, res) => {
        try{
            const skuList = await this.warehouse.getSKUs();
            const result = [];
            
            skuList.map(s => { 
                const item =  {"id" : s.description, "description" : s.description }
                result.push(item);
            }) //creare nuovo oggetto

            return res.status(200).json(result);
        }
        catch(err){
            console.log(err);
        }
    };

}
    

   
module.exports = ControllerSKU;