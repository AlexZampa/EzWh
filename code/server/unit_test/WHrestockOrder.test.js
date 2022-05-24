"use strict";

const dayjs = require('dayjs');
const Warehouse = require("../Model/Warehouse");
const { RestockOrder, Product, TransportNote } = require('../Model/RestockOrder');
const SKUItem = require('../Model/SkuItem');
const { User } = require('../Model/User');

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
const TestResult = require('../Model/TestResult');

const wh = new Warehouse(userDAO, skuDAO, skuItemDAO, positionDAO, restockOrderDAO, returnOrderDAO, internalOrderDAO, itemDAO, testDescriptorDAO, testResultDAO);

describe("Test add RestockOrder", () => {

    const user1 = new User(1, "Mary", "Red", "user1@ezwh.com", "supplier");

    let id = 1;
    beforeEach(() => {
        restockOrderDAO.newRestockOrder.mockReset();
        restockOrderDAO.newRestockOrder.mockReturnValue(id);
        userDAO.getAllUsers.mockReset();
        userDAO.getAllUsers.mockReturnValue([user1]);
        id++;
    });


    const productList = [];
    productList.push(new Product(1, "Object", 30, 20));
    productList.push(new Product(3, "Object 3", 2, 240));

    testAddRestockOrder(productList, 1, "2022/01/12", 1);
    testAddRestockOrder([], 1, "2022/01/22", 2);
    testAddRestockOrderError('throw error on supplier not found', [], 2, "2022/01/22", { err: 422, msg: "Supplier Not Found" });
    testAddRestockOrderError('throw error on wrong date', productList, 1, "Hello", { err: 422, msg: "Invalid Date" });

    function testAddRestockOrder(products, supplierID, issueDate, expectedResult) {
        test('Add RestockOrder', async () => {
            let result = await wh.addRestockOrder(products, supplierID, issueDate);
            expect(result).toBe(expectedResult);
        })
    }

    function testAddRestockOrderError(testMessage, products, supplierID, issueDate, expectedError) {
        test(testMessage, async () => {
            async function invalidAddRestockOrder() {
                await wh.addRestockOrder(products, supplierID, issueDate);
            }
            await expect(invalidAddRestockOrder).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get all RestockOrders", () => {

    const user1 = new User(1, "Mary", "Red", "user1@ezwh.com", "supplier");
    const user2 = new User(2, "Mary", "Red", "user1@ezwh.com", "supplier");

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList.push(new RestockOrder(2, '2022/02/18', 1, "DELIVERED", new TransportNote('2022/02/20')));


    let arrayProducts = [];
    arrayProducts.push(new Product(12, "object", 20, 30));
    arrayProducts.push(new Product(15, "object 2", 2, 550));

    restockOrderList[0].addProduct(12, "object", 20, 30);
    restockOrderList[0].addProduct(15, "object 2", 2, 550);

    const skuItem1 = new SKUItem("1", 12, 1, null, undefined);
    const skuItem2 = new SKUItem("2", 15, 1, '2022/05/18', undefined);

    beforeAll(() => {
        restockOrderDAO.getAllRestockOrders.mockReset();
        restockOrderDAO.getAllRestockOrders.mockReturnValue(restockOrderList);
        userDAO.getAllUsers.mockReset();
        userDAO.getAllUsers.mockReturnValue([user1, user2]);
        skuItemDAO.getAllSKUItems.mockReset();
        skuItemDAO.getAllSKUItems.mockReturnValue([skuItem1, skuItem2]);
    });

    testGetAllRestockOrders(restockOrderList);

    function testGetAllRestockOrders(expectedResult) {
        test('Get all RestockOrders', async () => {
            let result = await wh.getRestockOrders();
            for (const i in result) {
                compareRestockOrder(result[i], expectedResult[i]);
            }
        })
    }
});

describe("Test get RestockOrders Issued", () => {

    const user1 = new User(1, "Mary", "Red", "user1@ezwh.com", "supplier");
    const user2 = new User(2, "Mary", "Red", "user1@ezwh.com", "supplier");

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList.push(new RestockOrder(2, '2022/02/18', 1, "DELIVERED", new TransportNote('2022/02/20')));


    let arrayProducts = [];
    arrayProducts.push(new Product(12, "object", 20, 30));
    arrayProducts.push(new Product(15, "object 2", 2, 550));

    restockOrderList[0].addProduct(12, "object", 20, 30);
    restockOrderList[0].addProduct(15, "object 2", 2, 550);

    const skuItem1 = new SKUItem("1", 12, 1, null, undefined);
    const skuItem2 = new SKUItem("2", 15, 1, '2022/05/18', undefined);

    beforeAll(() => {
        restockOrderDAO.getAllRestockOrders.mockReset();
        restockOrderDAO.getAllRestockOrders.mockReturnValue(restockOrderList);
        userDAO.getAllUsers.mockReset();
        userDAO.getAllUsers.mockReturnValue([user1, user2]);
        skuItemDAO.getAllSKUItems.mockReset();
        skuItemDAO.getAllSKUItems.mockReturnValue([skuItem1, skuItem2]);
    });

    testGetRestockOrdersIssued([restockOrderList[0]]);

    function testGetRestockOrdersIssued(expectedResult) {
        test('Get RestockOrders Issued', async () => {
            let result = await wh.getRestockOrdersIssued();
            for (const i in result) {
                compareRestockOrder(result[i], expectedResult[i]);
            }
        })
    }
});


describe("Test get RestockOrder", () => {

    const user1 = new User(1, "Mary", "Red", "user1@ezwh.com", "supplier");
    const user2 = new User(2, "Mary", "Red", "user1@ezwh.com", "supplier");

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList.push(new RestockOrder(2, '2022/02/18', 1, "DELIVERED", new TransportNote('2022/02/20')));


    let arrayProducts = [];
    arrayProducts.push(new Product(12, "object", 20, 30));
    arrayProducts.push(new Product(15, "object 2", 2, 550));

    restockOrderList[0].addProduct(12, "object", 20, 30);
    restockOrderList[0].addProduct(15, "object 2", 2, 550);

    const skuItem1 = new SKUItem("1", 12, 1, null, undefined);
    const skuItem2 = new SKUItem("2", 15, 1, '2022/05/18', undefined);

    beforeAll(() => {
        restockOrderDAO.getRestockOrder.mockReset();
        restockOrderDAO.getRestockOrder.mockReturnValueOnce(restockOrderList[0]).mockReturnValueOnce(restockOrderList[1]);
        userDAO.getAllUsers.mockReset();
        userDAO.getAllUsers.mockReturnValue([user1, user2]);
        skuItemDAO.getAllSKUItems.mockReset();
        skuItemDAO.getAllSKUItems.mockReturnValue([skuItem1, skuItem2]);
    });

    testGetRestockOrder(1, restockOrderList[0]);
    testGetRestockOrder(2, restockOrderList[1]);

    function testGetRestockOrder(restockOrderID, expectedResult) {
        test('Get RestockOrder', async () => {
            let result = await wh.getRestockOrder(restockOrderID);
            compareRestockOrder(result, expectedResult);
        })
    }
});


describe("Test modify RestockOrder", () => {
    const restockOrder1 = new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined);
    const restockOrder2 = new RestockOrder(2, '2022/02/18', 2, "DELIVERED", new TransportNote('2022/02/20'));

    const skuItem1 = new SKUItem("1", 12, 1, null, undefined);
    const skuItem2 = new SKUItem("2", 15, 1, '2022/05/18', undefined);

    restockOrder1.addProduct(12, "object", 20, 30);

    describe('Test modify', () => {
        beforeAll(() => {
            restockOrderDAO.getRestockOrder.mockReset();
            restockOrderDAO.getRestockOrder.mockReturnValueOnce(restockOrder1).mockReturnValueOnce(restockOrder1).mockReturnValue(restockOrder2);

            skuItemDAO.getAllSKUItems.mockReset();
            skuItemDAO.getAllSKUItems.mockReturnValue([skuItem1, skuItem2]);

            restockOrderDAO.updateRestockOrder.mockReset();
            restockOrderDAO.updateRestockOrder.mockReturnValue(1);

        });

        let expectedResult = 1;
        test('Modify RestockOrder', async () => {
            let result = await wh.modifyRestockOrderState(1, "DELIVERED");
            expect(result).toBe(expectedResult);
        })

        test('Add TransportNote to RestockOrder', async () => {
            let result = await wh.restockOrderAddTransportNote(1, '2022/05/20');
            expect(result).toBe(expectedResult);
        })

        let expectedResult2 = restockOrder2;
        expectedResult2.addProduct(12, "object", 20, 30);
        expectedResult2.addProduct(15, "object", 20, 30);
        test('Add SKUItems to RestockOrder', async () => {
            let result = await wh.restockOrderAddSKUItems(1, [{ "skuID": 12, "rfid": "1" }, { "skuID": 15, "rfid": "2" }]);
            expect(result).toBe(expectedResult2);
        })

    });

    describe("Test Errors", () => {
        beforeAll(() => {
            skuDAO.getSKU.mockReset();
            restockOrderDAO.getRestockOrder.mockReset();
            restockOrderDAO.getRestockOrder.mockReturnValueOnce(restockOrder1).mockReturnValueOnce(restockOrder1).mockReturnValue(restockOrder2);

            skuItemDAO.getAllSKUItems.mockReset();
            skuItemDAO.getAllSKUItems.mockReturnValue([skuItem1, skuItem2]);

            restockOrderDAO.updateRestockOrder.mockReset();
            restockOrderDAO.updateRestockOrder.mockReturnValue(1);
        });

        testModifyRestockOrderError("throw error on invalid state", 1, "OBTAINED", { err: 422, msg: "newState invalid" });
        testAddTransportNoteError("throw error on wrong date format", 1, '2022-02-20', { err: 422, msg: "Invalid date" });
        testAddTransportNoteError("throw error on date before actual", 1, '2022/02/20', { err: 422, msg: "Invalid date: deliveryDate is before issueDate" });
        testrestockOrderAddSKUItemsError("throw error on not delivered state", 2, [{ "skuID": 12, "rfid": "1" }, { "skuID": 15, "rfid": "2" }], { err: 422, msg: "Restock Order not in DELIVERED state" });
        testrestockOrderAddSKUItemsError("throw error on Invalid SKUItem", 2, [{ "skuID": 13, "rfid": "1" }, { "skuID": 15, "rfid": "2" }], { err: 422, msg: "Invalid SKUItem" });

        function testModifyRestockOrderError(testMessage, restockOrderID, newState, expectedError) {
            test(testMessage, async () => {
                async function invalidModify() {
                    await wh.modifyRestockOrderState(restockOrderID, newState);
                }
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }

        function testAddTransportNoteError(testMessage, restockOrderID, date, expectedError) {
            test(testMessage, async () => {
                async function invalidModify() {
                    await wh.restockOrderAddTransportNote(restockOrderID, date,);
                }
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }

        function testrestockOrderAddSKUItemsError(testMessage, restockOrderID, SKUItemIdList, expectedError) {
            test(testMessage, async () => {
                async function invalidModify() {
                    await wh.restockOrderAddSKUItems(restockOrderID, SKUItemIdList);
                }
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }

    });

});

describe("Test return Items From RestockOrder", () => {

    const user1 = new User(1, "Mary", "Red", "user1@ezwh.com", "supplier");
    const user2 = new User(2, "Mary", "Red", "user1@ezwh.com", "supplier");

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "COMPLETEDRETURN", undefined));
    restockOrderList.push(new RestockOrder(2, '2022/02/18', 1, "DELIVERED", new TransportNote('2022/02/20')));

    restockOrderList[0].addProduct(12, "object", 20, 30);
    restockOrderList[0].addProduct(15, "object 2", 2, 550);

    const test1 = new TestResult(1, "1", 1, '2022/05/19', false);
    const test2 = new TestResult(2, "2", 2, '2022/05/19', true);

    const skuItem1 = new SKUItem("1", 12, 1, null, undefined);
    const skuItem2 = new SKUItem("2", 15, 1, '2022/05/18', undefined);

    skuItem1.addTestResult(test1);
    skuItem2.addTestResult(test2);

    restockOrderList[0].addSKUItems([skuItem1, skuItem2]);

    beforeAll(() => {
        restockOrderDAO.getRestockOrder.mockReset();
        restockOrderDAO.getRestockOrder.mockReturnValueOnce(restockOrderList[0]).mockReturnValueOnce(restockOrderList[1]);
        userDAO.getAllUsers.mockReset();
        userDAO.getAllUsers.mockReturnValue([user1, user2]);
        testResultDAO.getAllTestResult.mockReset();
        testResultDAO.getAllTestResult.mockRejectedValue([test1, test2]);
    });

    testReturnItemsFromRestockOrder(1, [skuItem1, skuItem2]);

    testReturnItemsFromRestockOrderError("throw error on invalid state", 2, { err: 422, msg: "Restock Order not in COMPLETEDRETURN state" });

    function testReturnItemsFromRestockOrder(restockOrderID, expectedResult) {
        test('Get items to Return', async () => {
            let result = await wh.returnItemsFromRestockOrder(restockOrderID);
            for (let i = 0; i < result.length; i++) {
                compareSKUItem(result[i], expectedResult[i]);
            }
        })
    }

    function testReturnItemsFromRestockOrderError(testMessage, restockOrderID, expectedError) {
        test(testMessage, async () => {
            async function invalidModify() {
                await wh.returnItemsFromRestockOrder(restockOrderID);
            }
            await expect(invalidModify).rejects.toEqual(expectedError);
        })
    }

});

describe("Test delete RestockOrder", () => {

    const user1 = new User(1, "Mary", "Red", "user1@ezwh.com", "supplier");
    const user2 = new User(2, "Mary", "Red", "user1@ezwh.com", "supplier");

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList.push(new RestockOrder(2, '2022/02/18', 1, "DELIVERED", new TransportNote('2022/02/20')));

    restockOrderList[1].addProduct(12, "object", 20, 30);
    restockOrderList[1].addProduct(15, "object 2", 2, 550);

    const skuItem1 = new SKUItem("1", 12, 1, null, 2);
    const skuItem2 = new SKUItem("2", 15, 1, '2022/05/18', 2);

    beforeAll(() => {
        restockOrderDAO.getRestockOrder.mockReset();
        restockOrderDAO.getRestockOrder.mockReturnValueOnce(restockOrderList[0]).mockReturnValueOnce(restockOrderList[1]).mockRejectedValueOnce({ err: 404, msg: "RestockOrder not found" });

        userDAO.getAllUsers.mockReset();
        userDAO.getAllUsers.mockReturnValue([user1, user2]);

        restockOrderDAO.deleteRestockOrder.mockReset();
        restockOrderDAO.deleteRestockOrder.mockReturnValue(1);

        skuItemDAO.getAllSKUItems.mockReset();
        skuItemDAO.getAllSKUItems.mockReturnValue([skuItem1, skuItem2]);
    });

    let restockOrderID = 1;
    let expectedResult = 1;
    test('Delete RestockOrder', async () => {
        let result = await wh.deleteRestockOrder(restockOrderID);
        expect(result).toBe(expectedResult);
    })

    testDeleteRestockOrderError("throw error on RestockOrder present in SKUItem", 2, { err: 422, msg: "Cannot delete Restock Order" });
    testDeleteRestockOrderError("throw error on RestockOrder not found", 5, { err: 404, msg: "RestockOrder not found" });

    function testDeleteRestockOrderError(testMessage, restockOrderID, expectedError) {
        test(testMessage, async () => {
            async function invalidDelete() {
                await wh.deleteRestockOrder(restockOrderID);
            };
            await expect(invalidDelete).rejects.toEqual(expectedError);
        })
    }
});


function compareRestockOrder(restockOrder, expectedRestockOrder) {
    expect(restockOrder.getID()).toStrictEqual(expectedRestockOrder.getID());
    expect(restockOrder.getIssueDate()).toStrictEqual(expectedRestockOrder.getIssueDate());
    compareProducts(restockOrder.getProducts(), expectedRestockOrder.getProducts());
    expect(restockOrder.getState()).toStrictEqual(expectedRestockOrder.getState());
    expect(restockOrder.getTransportNote()).toStrictEqual(expectedRestockOrder.getTransportNote());
    expect(restockOrder.getSKUItems()).toStrictEqual(expectedRestockOrder.getSKUItems());
    expect(restockOrder.getSupplier()).toStrictEqual(expectedRestockOrder.getSupplier());
};


function compareProducts(productList, expectedProductList) {
    expect(productList.length).toStrictEqual(expectedProductList.length);
    for (var i = 0; i < productList.length; i++) {
        expect(productList[i].SKUId).toStrictEqual(expectedProductList[i].SKUId);
        expect(productList[i].description).toStrictEqual(expectedProductList[i].description);
        expect(productList[i].price).toStrictEqual(expectedProductList[i].price);
        expect(productList[i].qty).toStrictEqual(expectedProductList[i].qty);
    }
}

function compareSKUItem(skuItem, expectedSKUItem) {
    expect(skuItem.getRFID()).toStrictEqual(expectedSKUItem.getRFID());
    expect(skuItem.getSKU()).toStrictEqual(expectedSKUItem.getSKU());
    expect(skuItem.getAvailable()).toStrictEqual(expectedSKUItem.getAvailable());
    expect(skuItem.getDateOfStock()).toStrictEqual(expectedSKUItem.getDateOfStock());
    expect(skuItem.getRestockOrder()).toStrictEqual(expectedSKUItem.getRestockOrder());
    expect(skuItem.getTestResults()).toStrictEqual(expectedSKUItem.getTestResults());
};