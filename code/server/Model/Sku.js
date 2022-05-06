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

    setPosition = (position) => { this.position = position; };
    setDescription = (description) => { this.description = description ; };
    setWeight = (weight) => { this.weight = this.weight; };
    setVolume = (volume) => { this.volume; };
    setNotes = (notes) => { this.notes; };
    setPrice = (price) => { this.price; };
    setAvailableQuantity = (availableQty) => { this.availableQuantity = availableQty; };
    addTestDescriptor = (testDescriptor) => { this.testDescriptors.push(testDescriptor); };

    convertToObj = () => {
        return (
            {"description" : this.description, "weight" : this.weight, "volume" : this.volume, "notes" : this.notes,
             "position" : this.position ? this.position.getPositionID() : "", "availableQuantity" : this.availableQuantity,
             "price" : this.price, "testDescriptors" : this.testDescriptors.map(t => t.getID()) } );
    };

}

module.exports = SKU;