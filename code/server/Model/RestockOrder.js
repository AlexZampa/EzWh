class RestockOrder {
    constructor(id, products, supplierID, issueDate) {
        this.supplierID = supplierID;
        for (prod in products) {
            this.addProduct(prod.SKUId, prod.description, prod.price, prod.qty);
        }
        this.issueDate = issueDate;
        this.id = id;
    }

    getID = () => { return this.id; };
    getIssueDate = () => { return this.issueDate; };
    getProducts = () => { return this.products; };
    getState = () => { return this.state; };
    getTransportNote = () => { return this.TransportNote };
    getSKUItems = () => { return this.SKUItems; };
    getSupplier = () => { return this.supplier; };

    addProduct(SKUId, description, qty) {
        const prod = new Product(SKUId, description, qty);
        this.products.append(prod);
    }

    addSKUItems = (skuitems) => {
        this.skuitems = skuitems;
    }
    
    setState = (newState) => {
        if (newState === "ISSUED" || newState === "DELIVERY"
            || newState === "DELIVERED" || newState === "TESTED"
            || newState === "COMPLETEDRETURN" || newState === "COMPLETED") {
        
            this.state = newState;
        }
        if (newState === "DELIVERY") {
            this.transportNote = new TransportNote();
        }
    }

    getSKUItemsFailedTest = () => {
        let skuitems_failed = [];
        this.skuitems.forEach(element => {
            if (element.getNotPassed() === true) {
                skuitems_failed.push(element);
            }
        });
    }

    convertToObj = () => {
        return (
            {
                "id": this.id, "issueDate": this.issueDate, "state": this.state, "products": this.products.convertToObj(),
                "supplierId":this.supplierID, "transportNote":this.transportNote.convertToObj(), "skuItems":this.skuitems.convertToObj()
            });
    };

    convertToObjIssued = () => {
        return (
            {
                "id": this.id, "issueDate": this.issueDate, "state": this.state, "products": this.products.convertToObj(),
                "supplierId": this.supplierID, "skuItems": []
            });
    };

}

class TransportNote {
    constructor(date) {
        this.dateDelivery = date;
    };

    getShipmentDate = () => {
        return this.dateDelivery;
    };
    
    convertToObj = () => {
        return (
            {
                "deliveryDate": this.dateDelivery
            });
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
        return (
            {
                "SKUId": this.SKUId, "description": this.description, "price": this.price, "qty": this.qty
            });
    };
} 