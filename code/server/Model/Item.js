'use strict';

class Item {
    constructor(id, description, price, associatedSKU, supplier){
        this.id=id;
        this.description=description;
        this.price=price;
        this.associatedSKU=associatedSKU;
        this.supplier=supplier;
    };

    getID = () => this.id;
    getDescription = () => this.description;
    getPrice = () => this.price;
    getAssociatedSKU = () => this.associatedSKU;
    getSupplier = () => this.supplier;

    setDescription = (description) => { this.description = description ; };
    setPrice = (price) => {this.price = price; };
    setAssociatedSKU = (associatedSKU) => {this.associatedSKU = associatedSKU; };
    setSupplier = (supplier) => {this.supplier = supplier; };

    modifyItemData = async (newDescription, newPrice, ItemDAO) => {
        try{
            this.description=newDescription;
            this.price=newPrice;
            const res = await ItemDAO.updateItem(this.id, this.description, this.price, this.associatedSKU, this.supplier);
            return res;
        }catch(err){
            throw err;
        }
    }

    convertToObj = () => {
        return (
            {"id" : this.id, "description" : this.description, "price" : this.price,
             "SKUId" : this.associatedSKU, "supplierId" : this.supplier} );
    };
}

module.exports = Item;