var ids = 0;

class RestockOrder {
    constructor(supplierID, issueDate) {
        this.supplierID = supplierID;
        this.issueDate = issueDate;
        this.id = ids;
        ids += 1;
    }

    getID = () => { return this.id; };
    getIssueDate = () => { return this.issueDate; };
    getState = () => { return this.state; };
    getTransportNote = () => { return this.TransportNote };
    getSKUItems = () => { return this.SKUItems; };
    getSupplier = () => { return this.supplier; };

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
}

class TransportNote {
    constructor() {
        this.dateDelivery = new Date();
    }

    getShipmentDate = () => {
        return this.dateDelivery;
    }
}