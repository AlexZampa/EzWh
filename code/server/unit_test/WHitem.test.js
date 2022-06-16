"use strict";

const Warehouse = require("../Model/Warehouse");
const Item = require('../Model/Item');
const SKU = require('../Model/Sku');
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

describe("Test add Item", () => {

    const sku1 = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
    const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");

    beforeAll(() => {
        itemDAO.newItem.mockReset();
        itemDAO.newItem.mockReturnValueOnce(1).mockReturnValueOnce(2);
        
        skuDAO.getSKU.mockReset();
        skuDAO.getSKU.mockReturnValueOnce(sku1).mockReturnValueOnce(sku2).mockRejectedValueOnce({err: 404, msg: "SKU not found"});
    });

    testAddItem(1, "description 1", 30.5, 1, 4, 1);
    testAddItem(2, "description 2", 20, 2, 3, 2);
    testAddItemError('throw error on negative price', 1, "description 1", -30.5, 1, 4, {err: 422, msg: "Invalid data"});
    testAddItemError('throw error on not existing SKU', 1, "description 1", 30, 8, 4, {err: 404, msg: "SKU not found"});

    function testAddItem(id, description, price, SKUId, supplierId, expectedResult) {
        test('Add Item', async () => {
            let result = await wh.addItem(id, description, price, SKUId, supplierId);
            expect(result).toBe(expectedResult);
        })
    }

    function testAddItemError(testMessage, id, description, price, SKUId, supplierId, expectedError) {
        test(testMessage, async () => {
            async function invalidAddItem(){
               await wh.addItem(id, description, price, SKUId, supplierId);
            }
            await expect(invalidAddItem).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get all Item", () => {
    
    let itemList = [];
    itemList.push(new Item(1, "description 1", 30.5, 1, 4));
    itemList.push(new Item(2, "description 2", 20, 2, 3));
    itemList.push(new Item(3, "description 3", 15, 3, 3));
    
    let expectedList = [];
    const item1 = new Item(1, "description 1", 30.5, 1, 4);
    const item2 = new Item(2, "description 2", 20, 2, 3);
    const item3 = new Item(3, "description 3", 15, 3, 3);
    expectedList.push(item1);
    expectedList.push(item2);
    expectedList.push(item3);
   

    beforeAll(() => {
        itemDAO.getAllItem.mockReset();
        itemDAO.getAllItem.mockReturnValue(itemList);
    });

    testgetAllItem(expectedList);

    function testgetAllItem(expectedResult) {
        test('Get all Item', async () => {
            let result = await wh.getItems();
            for(const i in result){
                compareItem(result[i], expectedResult[i]);
            }
        })
    }
});


describe("Test get Item", () => {

    const item1 = new Item(1, "description 1", 30.5, 1, 4);
    const item2 = new Item(2, "description 2", 20, 2, 3);

    beforeAll(() => {
        itemDAO.getItem.mockReset();
        itemDAO.getItem.mockReturnValueOnce(item1).mockReturnValueOnce(item2);
    });

    testGetItem(1, 4, item1);
    testGetItem(2, 3, item2);

    function testGetItem(id, supplierId, expectedResult) {
        test('Get Item by id', async () => {
            let result = await wh.getItem(id, supplierId);
            compareItem(result, expectedResult);
        })
    }
});


describe("Test modify Item", () => {
    const item1 = new Item(1, "description 1", 30.5, 1, 4);

    describe('Test modify', () => {
        beforeAll(() => {
            itemDAO.getItem.mockReset();
            itemDAO.getItem.mockReturnValueOnce(item1);
            
            itemDAO.updateItem.mockReset();
            itemDAO.updateItem.mockReturnValue(1);
        });

        let expectedResult = 1;
        test('Modify Item', async () => {
            let result = await wh.modifyItem(1, 4, "newDescription", 300);
            expect(result).toBe(expectedResult);
        })
    });

    describe("Test Errors", () => {
        beforeAll(() => {
            itemDAO.getItem.mockReset();
            itemDAO.getItem.mockRejectedValueOnce({ err: 404, msg: "Item not found" });
        });    

        testModifyItemError("throw error on negative price", 2, 3, "newDescription", -30, {err: 422, msg:  "Invalid data"});
        testModifyItemError("throw error on non existing Item", 1, 4, "newDescription", 30, { err: 404, msg: "Item not found" });

        function testModifyItemError(testMessage, id, supplierId, newDescription, newPrice, expectedError){
            test(testMessage, async () => {
                async function invalidModify(){
                    await wh.modifyItem(id, supplierId, newDescription, newPrice);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }
    });
});


describe("Test delete Item", () => {
    const item1 = new Item(1, "description 1", 30.5, 1, 4);
    const item2 = new Item(2, "description 2", 20, 2, 3);

    beforeAll(() => {
        itemDAO.getItem.mockReset();
        itemDAO.getItem.mockReturnValueOnce(item1).mockRejectedValueOnce({err: 404, msg:  "Item not found"});
        
        itemDAO.deleteItem.mockReset();
        itemDAO.deleteItem.mockReturnValue(1);
    });

    let itemID = 1;
    let supplierId = 4;
    let expectedResult = 1;
    test('Delete Item', async () => {
        let result = await wh.deleteItem(itemID, supplierId);
        expect(result).toBe(expectedResult);
    })
});


function compareItem(item, expectedItem){
    expect(item.getID()).toStrictEqual(expectedItem.getID());
    expect(item.getDescription()).toStrictEqual(expectedItem.getDescription());
    expect(item.getPrice()).toStrictEqual(expectedItem.getPrice());
    expect(item.getAssociatedSKU()).toStrictEqual(expectedItem.getAssociatedSKU());
    expect(item.getSupplier()).toStrictEqual(expectedItem.getSupplier());
};