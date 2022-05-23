"use strict"


class ReturnOrder {
    constructor(id, restockOrder, returnDate, products) {
        this.id = id;
        this.restockOrderId = restockOrder;
        this.returnDate = returnDate;
        this.products = products;
    }

    getId = () => { return this.id; };
    getReturnDate = () => { return this.returnDate; };
    getProducts = () => { return this.products; };
    getRestockOrderId = () => { return this.restockOrderId };
}

module.exports = ReturnOrder;