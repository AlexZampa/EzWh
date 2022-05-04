"use strict"

id=0;

class InternalOrder{
    constructor(customer, issueDate){
        this.id = id++;
        this.issueDate = issueDate;
        this.products = [];
        this.deliveredProducts = [];
        this.internalCustomer = customer;
        this.state = "ISSUED";
    }

    

    getId = () => {return this.id;}
    getIssueDate = () => {return this.issueDate;}
    getProducts = () => {return this.products;}
    getDeliveredProducts = () => {return this.deliveredProducts;}
    getState = () => {return this.state;}
    addSKU = (SKU, qty) => {
        this.products.concat([{"SKU": SKU, "qty": qty}]);
    }
    addDeliveredProducts = () => {/*TO DO*/}
    setStatus = (newState) => {
        if (newState === "ISSUED" || newState === "ACCEPTED"
            || newState === "REFUSED" || newState === "CANCELED"
            || newState === "COMPLETED") {
        
            this.state = newState;

            //da completare
        }
    }

}