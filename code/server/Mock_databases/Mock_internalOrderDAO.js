"use strict";

class Mock_internalOrderDAO {
    newInternalOrder = (issueDate, products, customerId, state) => jest.fn();
    getAllInternalOrders = () => jest.fn();
    getAllIssued = () => jest.fn();
    getAllAccepted = () => jest.fn();
    getInternalOrder = (ID) => jest.fn();
    addDeliveredProducts = (ID, SKUItemList) => jest.fn();
    setStatus = (ID, newState) => jest.fn();
    deleteInternalOrder = (ID) => jest.fn();
}

module.exports = Mock_internalOrderDAO