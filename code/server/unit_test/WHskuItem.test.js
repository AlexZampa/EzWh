"use strict";

const dayjs = require("dayjs");
const Warehouse = require("../Model/Warehouse");
const SKU = require('../Model/Sku');
const SKUItem = require('../Model/SKUItem');

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
const TestDescriptor = require("../Model/TestDescriptor");

const wh = new Warehouse(userDAO, skuDAO, skuItemDAO, positionDAO, restockOrderDAO, returnOrderDAO, internalOrderDAO, itemDAO, testDescriptorDAO, testResultDAO);

const sku = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");
const sku3 = new SKU(3, "description 3", 40, 40, "notes 3", 15.99, 20, null);

describe("Test add SKUItem", () => {
    let id = 1;
    beforeEach(() => {
        testDescriptorDAO.getAllTestDescriptor.mockReset();
        testDescriptorDAO.getAllTestDescriptor.mockReturnValueOnce([]);
        skuItemDAO.newSKUItem.mockReset();
        skuItemDAO.newSKUItem.mockReturnValue(id);
        id++;
    });

    testAddSKUItem("1", sku.getID(), null, 1);
    testAddSKUItem("2", sku2.getID(), dayjs('2022-05-18'), 2);
    testAddSKUItemError('throw error on not valid date', "2", sku2.getID(), "Hello", { err: 422, msg: "Invalid Date" });

    function testAddSKUItem(rfid, skuID, dateOfStock, expectedResult) {
        test('Add SKUItem', async () => {
            let result = await wh.addSKUItem(rfid, skuID, dateOfStock);
            expect(result).toBe(expectedResult);
        })
    }

    function testAddSKUItemError(testMessage, rfid, skuID, dateOfStock, expectedError) {
        test(testMessage, async () => {
            async function invalidAddSKU() {
                await wh.addSKUItem(rfid, skuID, dateOfStock);
            }
            await expect(invalidAddSKU).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get all SKUItem", () => {

    const skuItemList = [];
    skuItemList.push(new SKUItem("1", sku.getID(), 1, null, undefined));
    skuItemList.push(new SKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined));
    skuItemList.push(new SKUItem("3", sku3.getID(), 0, dayjs('2022-05-29'), undefined));

    beforeAll(() => {
        skuItemDAO.getAllSKUItems.mockReset();
        skuItemDAO.getAllSKUItems.mockReturnValue(skuItemList);
    });

    testGetAllSKUItems(skuItemList);

    function testGetAllSKUItems(expectedResult) {
        test('Get all SKUItems', async () => {
            let result = await wh.getSKUItems();
            for (const i in result) {
                compareSKUItem(result[i], expectedResult[i]);
            }
        })
    }
});


describe("Test get SKUItem", () => {

    const skuItem1 = new SKUItem("1", sku.getID(), 1, null, undefined);
    const skuItem2 = new SKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined);

    beforeAll(() => {
        skuItemDAO.getSKUItem.mockReset();
        skuItemDAO.getSKUItem.mockReturnValueOnce(skuItem1).mockReturnValue(skuItem2);
    });

    testGetSKUItem("1", skuItem1);
    testGetSKUItem("2", skuItem2);

    function testGetSKUItem(skuID, expectedResult) {
        test('Get SKUItem by id', async () => {
            let result = await wh.getSKUItem(skuID);
            compareSKUItem(result, expectedResult);
        })
    }
});


describe("Test modify SKUItem", () => {

    const skuItem1 = new SKUItem("1", sku.getID(), 1, null, undefined);
    const skuItem2 = new SKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined);

    describe('Test modify', () => {
        beforeAll(() => {
            skuItemDAO.getSKUItem.mockReset();
            skuItemDAO.getSKUItem.mockReturnValueOnce(skuItem1).mockReturnValue(skuItem2);

            skuItemDAO.updateSKUItem.mockReset();
            skuItemDAO.updateSKUItem.mockReturnValue(1);
        });

        let expectedResult = 1;
        test('Modify SKUItem', async () => {
            let result = await wh.modifySKUItem("1", "3", 1, dayjs('2022-06-29'));
            expect(result).toBe(expectedResult);
        })
    });

    describe("Test Errors", () => {
        beforeAll(() => {
            skuItemDAO.getSKUItem.mockReset();
            skuItemDAO.getSKUItem.mockRejectedValueOnce({ err: 404, msg: "SKUItem not found" }).mockReturnValue(sku2);
            skuItemDAO.updateSKUItem.mockReset();
            skuItemDAO.updateSKUItem.mockReturnValue(1);
        });

        testModifySKUItemError("throw error on date invalid", "2", "4", 1, "Hello", { err: 422, msg: "Invalid Date" });

        function testModifySKUItemError(testMessage, rfid, newRFID, newAvailable, newDate, expectedError) {
            test(testMessage, async () => {
                async function invalidModify() {
                    await wh.modifySKUItem(rfid, newRFID, newAvailable, newDate);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }
    });
});


describe("Test delete SKUItem", () => {

    const skuItem1 = new SKUItem("1", sku.getID(), 1, null, undefined);

    beforeAll(() => {
        skuItemDAO.getSKUItem.mockReset();
        skuItemDAO.getSKUItem.mockReturnValueOnce(skuItem1);


        skuItemDAO.deleteSKUItem.mockReset();
        skuItemDAO.deleteSKUItem.mockReturnValue(1);
    });

    let RFID = "1";
    let expectedResult = 1;
    test('Delete SKUItem', async () => {
        let result = await wh.deleteSKUItem(RFID);
        expect(result).toBe(expectedResult);
    })
});


function compareSKUItem(skuItem, expectedSKUItem) {
    expect(skuItem.getRFID()).toStrictEqual(expectedSKUItem.getRFID());
    expect(skuItem.getSKU()).toStrictEqual(expectedSKUItem.getSKU());
    expect(skuItem.getAvailable()).toStrictEqual(expectedSKUItem.getAvailable());
    expect(skuItem.getDateOfStock()).toStrictEqual(expectedSKUItem.getDateOfStock());
    expect(skuItem.getRestockOrder()).toStrictEqual(expectedSKUItem.getRestockOrder());
    expect(skuItem.getTestResults()).toStrictEqual(expectedSKUItem.getTestResults());
};