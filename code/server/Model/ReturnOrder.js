"use strict"


class ReturnOrder {
    constructor(id, restockOrder, returnDate, products) {
        this.id = id;
        this.restockOrder = restockOrder;
        this.returnDate = returnDate;
        this.products = products;
    }

    getId = () => { return this.id; };
    getReturnDate = () => { return this.returnDate; };
    getProducts = () => { return this.products; };
    getRestickOrderId = () => { return this.restockOrder.getId };
}