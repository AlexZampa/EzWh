'use strict';

const dayjs = require("dayjs");
const SkuItemDAO = require('../Database/SkuItemDAO');
const SKUItem = require('../Model/SkuItem');
const SKU = require('../Model/Sku');

const skuItemDAO = new SkuItemDAO();

const sku = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");
const sku3 = new SKU(3, "description 3", 40, 40, "notes 3", 15.99, 20, null);

describe('Test Create and Get SKUItem', () => {
    beforeAll(async () => {
        await skuItemDAO.resetTable();
    });

    test('delete table SKUItem', async () => {
        let res = await skuItemDAO.getAllSKUItems();
        expect(res.length).toStrictEqual(0);
    });

    const expectedSKUItem1 = new SKUItem("1", sku.getID(), 1, null, undefined);
    const expectedSKUItem2 = new SKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined);

    testCreateSKUItem("1", sku.getID(), 1, null, null, 1);
    testGetSKUItem("1", expectedSKUItem1);

    testCreateSKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined, 2);
    testGetSKUItem("2", expectedSKUItem2);

    testCreateSKUItemerror("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined, { err: 422, msg: "SKUItem not unique" });


});


describe('Test throw err on get SKUItem', () => {
    beforeAll(async () => {
        await skuItemDAO.resetTable();
        await skuItemDAO.newSKUItem("1", sku.getID(), 1, null, undefined);
    });
    testGetSKUItemerror("3", { err: 404, msg: "SKUItem not found" });
});


describe('Test Get All SKUItems', () => {
    beforeAll(async () => {
        await skuItemDAO.resetTable();
        await skuItemDAO.newSKUItem("1", sku.getID(), 1, null, undefined);
        await skuItemDAO.newSKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined);
        await skuItemDAO.newSKUItem("3", sku3.getID(), 0, dayjs('2022-05-29'), undefined);
    });

    const skuItemList = [];
    skuItemList.push(new SKUItem("1", sku.getID(), 1, null, undefined));
    skuItemList.push(new SKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined));
    skuItemList.push(new SKUItem("3", sku3.getID(), 0, dayjs('2022-05-29'), undefined));
    testGetAllSKUItem(skuItemList);
});


describe('Test Update SKUItem', () => {
    beforeAll(async () => {
        await skuItemDAO.resetTable();
        await skuItemDAO.newSKUItem("1", sku.getID(), 1, null, undefined);
        await skuItemDAO.newSKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined);
    });
    const expectedSKUItem = new SKUItem("1", sku.getID(), 0, dayjs('2022-05-29'), undefined);
    const expectedChanges = 1;
    testUpdateSKUItem("1", "1", 0, dayjs('2022-05-29'), undefined, expectedChanges);
    testGetSKUItem("1", expectedSKUItem);
    testUpdateSKUItemerror("1", "2", 0, dayjs('2022-05-29'), undefined, { err: 422, msg: "RFID not unique" });
});


describe('Test Delete SKUItem', () => {
    beforeAll(async () => {
        await skuItemDAO.resetTable();
        await skuItemDAO.newSKUItem("1", sku.getID(), 1, null, undefined);
        await skuItemDAO.newSKUItem("2", sku2.getID(), 1, dayjs('2022-05-08'), undefined);
        await skuItemDAO.newSKUItem("3", sku3.getID(), 0, dayjs('2022-05-29'), undefined);
    });

    const skuItemList = [];
    skuItemList.push(new SKUItem("1", sku.getID(), 1, null, undefined));
    skuItemList.push(new SKUItem("3", sku3.getID(), 0, dayjs('2022-05-29'), undefined));
    let expectedChanges = 1
    testDeleteSKUItem("2", expectedChanges);
    testGetAllSKUItem(skuItemList);
    testDeleteSKUItemError("4", { err: 404, msg: "SKUItem not found" });
});

function testCreateSKUItem(RFID, sku, available, dateOfStock, restockOrder, expectedID) {
    test('create new SKUItem', async () => {
        let id = await skuItemDAO.newSKUItem(RFID, sku, available, dateOfStock, restockOrder);
        expect(id).toStrictEqual(expectedID);
    });
}

function testCreateSKUItemerror(RFID, sku, available, dateOfStock, restockOrder, expectedError) {
    test('throw on create SKUItem', async () => {
        async function createNonExistentSKUItem() {
            await skuItemDAO.newSKUItem(RFID, sku, available, dateOfStock, restockOrder);
        };
        await expect(createNonExistentSKUItem).rejects.toEqual(expectedError);
    });
}

function testGetSKUItem(skuItemRFID, expectedSKUItem) {
    test('get SKUItem', async () => {
        let res = await skuItemDAO.getSKUItem(skuItemRFID);
        compareSKUItem(res, expectedSKUItem);
    });
}

function testGetSKUItemerror(skuItemRFID, expectedError) {
    test('throw on get SKUItem', async () => {
        async function getNonExistentSKUItem() {
            await skuItemDAO.getSKUItem(skuItemRFID);
        };
        await expect(getNonExistentSKUItem).rejects.toEqual(expectedError);
    });
}

function testGetAllSKUItem(expectedList) {
    test('get All SKUItem', async () => {
        let res = await skuItemDAO.getAllSKUItems();
        expect(res.length).toStrictEqual(expectedList.length);
        for (const i in res) {
            compareSKUItem(res[i], expectedList[i]);
        }
    });
}


function testUpdateSKUItem(oldRFID, newRFID, available, dateOfStock, restockOrder, expectedChanges) {
    test('update SKUItem', async () => {
        let res = await skuItemDAO.updateSKUItem(oldRFID, newRFID, available, dateOfStock, restockOrder);
        expect(res).toStrictEqual(expectedChanges);
    });
}

function testUpdateSKUItemerror(oldRFID, newRFID, available, dateOfStock, restockOrder, expectedError) {
    test('throw on update SKUItem', async () => {
        async function updateNonExistentSKUItem() {
            await await skuItemDAO.updateSKUItem(oldRFID, newRFID, available, dateOfStock, restockOrder);
        };
        await expect(updateNonExistentSKUItem).rejects.toEqual(expectedError);
    });
}


function testDeleteSKUItem(skuItemRFID, expectedChanges) {
    test('delete SKUItem', async () => {
        let res = await skuItemDAO.deleteSKUItem(skuItemRFID);
        expect(res).toStrictEqual(expectedChanges);
    });
}

function testDeleteSKUItemError(skuItemRFID, expectedError) {
    test('throw on delete SKUItem', async () => {
        async function deleteNonExistentSKUItem() {
            await await skuItemDAO.deleteSKUItem(skuItemRFID);
        };
        await expect(deleteNonExistentSKUItem).rejects.toEqual(expectedError);
    });
}

function compareSKUItem(skuItem, expectedSKUItem) {
    expect(skuItem.getRFID()).toStrictEqual(expectedSKUItem.getRFID());
    expect(skuItem.getSKU()).toStrictEqual(expectedSKUItem.getSKU());
    expect(skuItem.getAvailable()).toStrictEqual(expectedSKUItem.getAvailable());
    expect(skuItem.getDateOfStock()).toStrictEqual(expectedSKUItem.getDateOfStock());
    expect(skuItem.getRestockOrder()).toStrictEqual(expectedSKUItem.getRestockOrder());
    expect(skuItem.getTestResults()).toStrictEqual(expectedSKUItem.getTestResults());
};
