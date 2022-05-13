"use strict";

class Mock_returnOrderDAO {
    newReturnOrder = (products, restockOrderId, returnDate) => jest.fn();
    getReturnOrderById = (returnOrderID) => jest.fn();
    getAllReturnOrders = () => jest.fn();
    deleteReturnOrder = (returnOrderID) => jest.fn();
}

module.exports = Mock_returnOrderDAO;