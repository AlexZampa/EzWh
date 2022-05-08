'use strict';
const Warehouse = require('../Model/Warehouse');
const RestockOrder = require('../Model/RestockOrder');

const validateCreateRestockOrderjson = (body) => {
    if (body.issueDate !== undefined || body.products !== undefined || body.supplierId !== undefined)
        return true;
    return false;
}

const validateTransportNotejson = (body) => {
    if (body.transportNote !== undefined)
        return true;
    return false;
};

const validateStateRestockOrderjson = (body) => {
    if (bodynewState === "ISSUED" || bodynewState === "DELIVERY" || bodynewState === "DELIVERED" ||
        bodynewState === "TESTED" || bodynewState === "COMPLETEDRETURN" || bodynewState === "COMPLETED")
        return true;
    return false;
};

class ControllerRestockOrder {
    constructor() {
        this.warehouse = new Warehouse();
    };



}

module.exports = ControllerRestockOrder;