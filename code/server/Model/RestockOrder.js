'use strict';
const dayjs = require('dayjs');

const stateList = ["ISSUED", "DELIVERY", "DELIVERED", "TESTED", "COMPLETEDRETURN", "COMPLETED"];

class RestockOrder {
    constructor(id, issueDate, supplierID, state, transportNote=undefined) {
        this.id = id;
        this.issueDate = dayjs(issueDate);
        this.supplierID = supplierID;
        this.transportNote = transportNote ? new TransportNote(transportNote) : undefined;
        this.state = state;
        this.products = [];
        this.skuItems = [];
    }

    getID = () => { return this.id; };
    getIssueDate = () => { return this.issueDate; };
    getProducts = () => { return this.products; };
    getState = () => { return this.state; };
    getTransportNote = () => { 
        const transportNote = this.transportNote ? this.transportNote.getShipmentDate() : undefined
        return transportNote;
    };
    getSKUItems = () => { return this.SKUItems; };
    getSupplier = () => { return this.supplier; };

    setSKUItems = (skuItems) => { this.skuItems = skuItems };

    addProduct(SKUId, description, price, qty) {
        const prod = new Product(SKUId, description, price, qty);
        this.products.push(prod);
    }

    addSKUItems = (skuitems) => {
        this.skuItems = [...this.skuItems, ...skuitems];
    }
    
    setState = (newState) => {
        if(stateList.find(state => state === newState))
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
            "products": this.products.map(p => p.convertToObj()), 
            "supplierId": this.supplierID, "transportNote": this.transportNote ? this.transportNote.convertToObj() : "", 
            "skuItems": this.skuItems.map(s => { return {"SKUId" : s.getSKU(), "rfid" : s.getRFID()}; })
        }
        if(this.state === "ISSUED")
            delete obj.transportNote;
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
    constructor(SKUId, description, price, qty) {
        this.SKUId = SKUId;
        this.description = description;
        this.price = price;
        this.qty = qty;
    };

    convertToObj = () => {
         return ( { "SKUId": this.SKUId, "description": this.description, "price": this.price, "qty": this.qty }); 
    };
} 


module.exports = { RestockOrder, TransportNote, Product, stateList};