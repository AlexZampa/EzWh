'use strict';

class SKU {
    constructor(id, description, weight, volume, notes, price, availableQty, position=undefined){
        this.id = id;
        this.description = description;
        this.weight = weight;
        this.volume = volume;
        this.notes = notes;
        this.price = price;
        this.availableQuantity = availableQty;
        this.position = position;
        this.testDescriptors = [];
    };

    getID = () => this.id;
    getDescription = () => this.description;
    getWeight = () => this.weight;
    getVolume = () => this.volume;
    getNotes = () => this.notes;
    getPrice = () => this.price;
    getAvailableQuantity = () => this.availableQuantity;
    getPosition = () => this.position;
    getTestDescriptors = () => this.testDescriptors;

    setDescription = (description) => { this.description = description ; };
    setWeight = (weight) => { this.weight = this.weight; };
    setVolume = (volume) => { this.volume; };
    setNotes = (notes) => { this.notes; };
    setPrice = (price) => { this.price; };
    setAvailableQuantity = (availableQty) => { this.availableQuantity = availableQty; };
    setPosition = (position) => { this.position = position};

    modifyPosition = async (position, skuDAO, positionDAO) => {
        try{
            if(position.getAssignedSKU() !== undefined)                   // check if Position has already a SKU assigned
                throw {err : 422, msg : "A SKU is already assigned to the Position"};
            const totWeight =this.weight * this.availableQuantity;
            const totVolume = this.volume * this.availableQuantity;
            if((position.getMaxWeight() < totWeight) || (position.getMaxVolume() < totVolume))     // check if Position can store SKU
                throw {err : 422, msg : "Position cannot store the SKU"};
            
            if(this.position !== undefined){
                // release Position assigned to the SKU (set occupiedVolume and occupiedWeight to 0)
                const skuPos = await positionDAO.getPosition(this.position);
                let res = await positionDAO.updatePosition(skuPos.getPositionID(), skuPos.getPositionID(), skuPos.getAisle(), skuPos.getRow(), skuPos.getCol(), 
                    skuPos.getMaxWeight(), skuPos.getMaxVolume(), 0, 0);
            }
            // set Position to SKU
            const result = await skuDAO.updateSKU(this.id, this.description, this.weight, this.volume, this.notes, this.price, this.availableQuantity, position.getPositionID());
            this.position = position;
            // set SKU to Position
            let res = await positionDAO.updatePosition(position.getPositionID(), position.getPositionID(), position.getAisle(), position.getRow(), position.getCol(), 
                position.getMaxWeight(), position.getMaxVolume(), totWeight, totVolume, this.id);
            position.setAssignedSKU(this);
            return result;
        }
        catch(err){
            throw err;
        }
    };


    addTestDescriptor = (testDescriptor) => { this.testDescriptors.push(testDescriptor); };


    modifySKUdata = async (description, weight, volume, notes, price, availableQty, skuDAO, positionDAO) => {
        try{
            // if SKU has a Position and availableQty, weight or volume is changed -> check that Position can store SKU
            if(this.position !== undefined && (availableQty !== this.availableQuantity || weight !== this.weight || volume !== this.volume)) {
                const pos = await positionDAO.getPosition(this.position);      // get Position
                this.position = pos;
                const newTotWeight = weight * availableQty;
                const newTotVolume = volume * availableQty;
                if((pos.getMaxWeight() < newTotWeight) || (pos.getMaxVolume() < newTotVolume))     // check if Position can store SKU
                    throw {err : 422, msg : "Position cannot store the SKU"};
                // update occupiedWeight and occupiedVolume of position
                const res = await positionDAO.updatePosition(pos.getPositionID(), pos.getPositionID(), pos.getAisle(), pos.getRow(), pos.getCol(), pos.getMaxWeight(), pos.getMaxVolume(),
                        newTotWeight, newTotVolume, skuID);      
            }
            // update sku
            const res = await skuDAO.updateSKU(this.id, description, weight, volume, notes, price, availableQty, this.position ? this.position : undefined);
            this.description = description;
            this.weight = weight;
            this.volume = volume;
            this.notes = notes;
            this.price = price;
            this.availableQuantity = availableQty;
            return res;
        }
        catch(err){
            throw err;
        }
    };


    convertToObj = () => {
        return (
            {"description" : this.description, "weight" : this.weight, "volume" : this.volume, "notes" : this.notes,
             "position" : this.position ? this.position.getPositionID() : "", "availableQuantity" : this.availableQuantity,
             "price" : this.price, "testDescriptors" : this.testDescriptors.map(t => t.getID()) } );
    };

}

module.exports = SKU;