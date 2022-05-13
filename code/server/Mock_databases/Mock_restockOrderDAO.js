"use strict";

class Mock_restockOrderDAO {
    newRestockOrder = (products, supplierID, issueDate) => jest.fn();
    getRestockOrder = (restockOrderID) => jest.fn();
    getRestockOrders =  () => jest.fn();
    updateRestockOrder = (restockOrderID, newState, transportNote=undefined) => jest.fn();
    deleteRestockOrder = (restockOrderID) => jest.fn();
}

module.exports = Mock_restockOrderDAO;