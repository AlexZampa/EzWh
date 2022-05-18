'use strict';

class SKU {
    constructor(id, description, weight, volume, notes, price, availableQty, positionID=undefined){
        this.id = id;
        this.description = description;
        this.weight = weight;
        this.volume = volume;
        this.notes = notes;
        this.price = price;
        this.availableQuantity = availableQty;
        this.position = positionID ? positionID : undefined;
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
    setPosition = (positionID) => { this.position = positionID};

    addTestDescriptor = (testDescriptor) => { this.testDescriptors.push(testDescriptor); };

    convertToObj = () => {
        return (
            {"id" : this.id, "description" : this.description, "weight" : this.weight, "volume" : this.volume, "notes" : this.notes,
             "position" : this.position ? this.position : "", "availableQuantity" : this.availableQuantity,
             "price" : this.price, "testDescriptors" : this.testDescriptors.map(t => t.getID()) } );
    };

}

module.exports = SKU;