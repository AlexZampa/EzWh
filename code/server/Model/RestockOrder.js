'use strict';
const dayjs = require('dayjs');

const restockOrderstateList = ["ISSUED", "DELIVERY", "DELIVERED", "TESTED", "COMPLETEDRETURN", "COMPLETED"];

class RestockOrder {
    constructor(id, issueDate, supplier, state, transportNote=undefined) {
        this.id = id;
        this.issueDate = dayjs(issueDate);
        this.supplier = supplier;
        this.transportNote = transportNote ? new TransportNote(transportNote) : undefined;
        this.state = state;
        this.products = [];
        this.skuItems = [];
    }

    getID = () => { return this.id; };
    getIssueDate = () => { return this.issueDate; };
    getProducts = () => { return this.products; };

    getItemIDFromProduct = (skuID) => {
       return this.products.find(prod => prod.SKUId === skuID).itemID;
    }

    getState = () => { return this.state; };
    getTransportNote = () => { 
        const transportNote = this.transportNote ? this.transportNote.getShipmentDate() : undefined
        return transportNote;
    };
    getSKUItems = () => { return this.skuItems; };
    getSupplier = () => { return this.supplier; };

    setSKUItems = (skuItems) => { this.skuItems = skuItems };

    addProduct(itemID, SKUId, description, price, qty) {
        const prod = new Product(itemID, SKUId, description, price, qty);
        this.products.push(prod);
    }

    addSKUItems = (skuitems) => {
        for (const s in skuitems) {
            this.skuItems.push(s);
        }
    }
    
    setState = (newState) => {
        if(restockOrderstateList.find(state => state === newState))
            this.state = newState;
        
        if (newState === "DELIVERY") 
            this.transportNote = new TransportNote();
    }

    getSKUItemsFailedTest = () => {
        let skuitems_failed = [];
        this.skuItems.forEach(element => {
            if (element.getNotPassed() === true) {
                skuitems_failed.push(element);
            }
        });
    }

    convertToObj = () => {
        
        const obj = { "id": this.id, "issueDate": this.issueDate.format('YYYY/MM/DD HH:mm'), "state": this.state, 
            "products": this.products.map(p => { return { "SKUId": p.SKUId, "itemId" : p.itemID, "description": p.description, "price": p.price, "qty": p.qty }}),
            "supplierId": this.supplier, "transportNote": this.transportNote ? this.transportNote.convertToObj() : "", 
            "skuItems": this.skuItems.map(s => { return {"SKUId" : s.getSKU(), "itemId" : this.getItemIDFromProduct(s.getSKU()), "rfid" : s.getRFID()}; })
        }
        if(this.state === "ISSUED")
            delete obj.transportNote;
        if(this.state === "ISSUED" || this.state === "DELIVERY")
            obj.skuItems = [];
        return (obj);
    };

}

class TransportNote {
    constructor(date) {
        this.dateDelivery = dayjs(date);
    };

    getShipmentDate = () => {
        return this.dateDelivery.format('YYYY/MM/DD HH:mm');
    };
    
    convertToObj = () => {
        return ( { "deliveryDate": this.dateDelivery.format('YYYY/MM/DD HH:mm') } );
    };
}

class Product {
    constructor(itemID, SKUId, description, price, qty) {
        this.itemID = itemID
        this.SKUId = SKUId;
        this.description = description;
        this.price = price;
        this.qty = qty;
    };

    convertToObj = () => {
         return ( { "SKUId": this.SKUId, "itemId" : this.itemID, "description": this.description, "price": this.price, "qty": this.qty }); 
    };
} 


module.exports = { RestockOrder, TransportNote, Product, restockOrderstateList};