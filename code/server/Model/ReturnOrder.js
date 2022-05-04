var ids = 0;

class ReturnOrder {
    constructor(restockOrder, returnDate) {
        this.restockOrder = restockOrder;
        this.returnDate = returnDate;
        this.id = ids;
        this.skuItems = [];
        ids += 1;
    }

    getID = () => { return this.id; };
    getReturnDate = () => { return this.returnDate; };
    getProducts = () => { return this.products; };

    addSKUItems = (skuItems) => { this.skuItems = skuItems; };

}