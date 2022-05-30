"use strict";

const Warehouse = require("../Model/Warehouse");
const dayjs = require("dayjs");
const {RestockOrder} = require('../Model/RestockOrder');
const ReturnOrder = require('../Model/ReturnOrder');
const {User} = require('../Model/User');

const userDAO = require('../Mock_databases/Mock_userDAO');
const skuDAO = require('../Mock_databases/Mock_skuDAO');
const skuItemDAO = require('../Mock_databases/Mock_skuItemDAO');
const positionDAO = require('../Mock_databases/Mock_positionDAO');
const restockOrderDAO = require('../Mock_databases/Mock_restockOrderDAO');
const returnOrderDAO = require('../Mock_databases/Mock_returnOrderDAO');
const internalOrderDAO = require('../Mock_databases/Mock_internalOrderDAO');
const itemDAO = require('../Mock_databases/Mock_itemDAO');
const testDescriptorDAO = require('../Mock_databases/Mock_testDescriptorDAO');
const testResultDAO = require('../Mock_databases/Mock_testResultDAO');

const wh = new Warehouse(userDAO, skuDAO, skuItemDAO, positionDAO, restockOrderDAO, returnOrderDAO, internalOrderDAO, itemDAO, testDescriptorDAO, testResultDAO);

describe("Add return order test", () => {

    let id = 1;

    beforeEach(() => {
        returnOrderDAO.newReturnOrder.mockReset();
        returnOrderDAO.newReturnOrder.mockReturnValue({changes: 1, lastID: id});
        restockOrderDAO.getRestockOrder.mockReset();
        restockOrderDAO.getRestockOrder
            .mockReturnValueOnce(new RestockOrder(11, "2022/04/04 09:06", new User(1, "a", "supplier", "asupplier@ezwh.com", "SUPPLIER"), "DELIVERED", undefined))
            .mockReturnValue(new RestockOrder(22, "2021/11/11 11:11", new User(1, "a", "supplier", "asupplier@ezwh.com", "SUPPLIER"), "DELIVERED", undefined));
        returnOrderDAO.getReturnOrderById.mockReset();
        returnOrderDAO.getReturnOrderById
            .mockReturnValueOnce( new ReturnOrder(1, 11, date1, products1))
            .mockReturnValue(new ReturnOrder(2, 22, date2, products2));
        id++;
    });

    const date1 = dayjs();
    let products1 = [
        {SKUId:12, description:"a product", price:10.99, RFID:"12345678901234567890123456789016"},
        {SKUId:180, description:"another product", price:11.99, RFID:"12345678901234567890123456789038"}
    ];

    const date2 = dayjs("2021/11/30 03:33");
    let products2 = [
        {SKUId:15, description:"a product", price:10.99, RFID:"32145678901234567890123456789016"},
        {SKUId:150, description:"another product", price:11.99, RFID:"32145678901234567890123456789038"}
    ];


    testAddReturnOrder(products1, date1, 11, 1);
    testAddReturnOrder(products2, date2, 22, 2);

    function testAddReturnOrder(products, returnDate, restockOrderId, expectedResult) {
        test('Add Return Order', async () => {
            let result = await wh.addReturnOrder(products, restockOrderId, returnDate)
            expect(result.lastID).toBe(expectedResult);
        })
    }
});

describe("Get all return orders test", () => {

    const date1 = dayjs();
    let products1 = [
        {SKUId:12, description:"a product", price:10.99, RFID:"12345678901234567890123456789016"},
        {SKUId:180, description:"another product", price:11.99, RFID:"12345678901234567890123456789038"}
    ];

    const date2 = dayjs("2021/11/30 03:33");
    let products2 = [
        {SKUId:15, description:"a product", price:10.99, RFID:"32145678901234567890123456789016"},
        {SKUId:150, description:"another product", price:11.99, RFID:"32145678901234567890123456789038"}
    ];

    const date3 = dayjs();
    let products3 = [
        {SKUId:15, description:"a product", price:10.99, RFID:"32165478901234567890123456789016"},
        {SKUId:150, description:"another product", price:11.99, RFID:"32165478901234567890123456789038"}
    ];

    let list = [];
    list.push(new ReturnOrder(1, 11, date1, products1));
    list.push(new ReturnOrder(2, 22, date2, products2));
    list.push(new ReturnOrder(3, 33, date3, products3));

    beforeEach(() => {
        returnOrderDAO.getAllReturnOrders.mockReset();
        returnOrderDAO.getAllReturnOrders.mockReturnValue(list);
    });

    testGetAllReturnOrders(list);

    function testGetAllReturnOrders(expectedResult) {
        test('Get all Return Orders', async () => {
            let result = await wh.getReturnOrders();
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Get return order test", () => {

    const date1 = dayjs();
    let products1 = [
        {SKUId:12, description:"a product", price:10.99, RFID:"12345678901234567890123456789016"},
        {SKUId:180, description:"another product", price:11.99, RFID:"12345678901234567890123456789038"}
    ];

    let returnOrder = new ReturnOrder(1, 11, date1, products1);

    beforeEach(() => {
        returnOrderDAO.getReturnOrderById.mockReset();
        returnOrderDAO.getReturnOrderById.mockReturnValue(returnOrder);
    });

    testGetReturnOrder(1, returnOrder);

    function testGetReturnOrder(id, expectedResult) {
        test('Get one Return Order by id', async () => {
            let result = await wh.getReturnOrderById(id);
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Delete return order test", () => {

    beforeEach(() => {
        returnOrderDAO.deleteReturnOrder.mockReset();
        returnOrderDAO.deleteReturnOrder.mockReturnValue(0);
    });

    testDeleteInternalOrder(1, 0);

    function testDeleteInternalOrder(id, expectedResult) {
        test('Delete one Return Order by id', async () => {
            let result = await wh.deleteReturnOrder(id);
            expect(result).toBe(expectedResult);
        })
    }
});





