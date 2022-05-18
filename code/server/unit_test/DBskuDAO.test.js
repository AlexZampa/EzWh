'use strict';

const SkuDAO = require('../Database/SkuDAO');
const SKU = require('../Model/Sku');

const skuDAO = new SkuDAO();

describe('Test Create and Get SKU', () => {
    beforeAll(async () => {
        await skuDAO.resetTable();
    });

    test('delete db', async () => {
        let res = await skuDAO.getAllSKU();
        expect(res.length).toStrictEqual(0);
    });
    
    const expectedSKU1 = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
    const expectedSKU2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");

    testCreateSKU("description 1", 30, 20, "notes 1", 10.99, 40, null, 1);
    testGetSKU(1, expectedSKU1);
    testCreateSKU("description 2", 20, 50, "notes 2", 20.99, 50, "123456789900", 2);
    testGetSKU(2, expectedSKU2);
});


describe('Test throw err on get SKU', () => {
    beforeAll(async () => {
        await skuDAO.resetTable();
        await skuDAO.newSKU("description 1", 30, 20, "notes 1", 10.99, 40, null);
    });
    
    testGetSKUerror(33);
});


describe('Test Get All SKU', () => {
    beforeAll(async () => {
        await skuDAO.resetTable();
        await skuDAO.newSKU("description 1", 30, 20, "notes 1", 10.99, 40, null);
        await skuDAO.newSKU("description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");
        await skuDAO.newSKU("description 3", 40, 40, "notes 3", 15.99, 20, null);
    });

    const skuList = [];
    skuList.push(new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null));
    skuList.push(new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900"));
    skuList.push(new SKU(3, "description 3", 40, 40, "notes 3", 15.99, 20, null));
    testGetAllSKU(skuList);
});


describe('Test Update SKU', () => {
    beforeAll(async () => {
        await skuDAO.resetTable();
        await skuDAO.newSKU("description 1", 30, 20, "notes 1", 10.99, 40, null);
    });
    testUpdateSKU(1, "description 2", 40, 20, "notes 2", 10.99, 50, null);
    
});


describe('Test Delete SKU', () => {
    beforeAll(async () => {
        await skuDAO.resetTable();
        await skuDAO.newSKU("description 1", 30, 20, "notes 1", 10.99, 40, null);
        await skuDAO.newSKU("description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");
        await skuDAO.newSKU("description 3", 40, 40, "notes 3", 15.99, 20, null);
    });

    const skuList = [];
    skuList.push(new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null));
    skuList.push(new SKU(3, "description 3", 40, 40, "notes 3", 15.99, 20, null));
    testDeleteSKU(2, skuList);
});



function testCreateSKU(description, weight, volume, notes, price, availableQty, position, expectedID) {
    test('create new SKU', async () => {
        let id = await skuDAO.newSKU(description, weight, volume, notes, price, availableQty, position);
        expect(id).toStrictEqual(expectedID);
    });
}

function testGetSKU(skuID, expectedSKU) {
    test('get SKU', async () => {
        let res = await skuDAO.getSKU(skuID);
        compareSKU(res, expectedSKU);
    });
}

function testGetSKUerror(skuID, expectedError){
    test('throw on get SKU', async () => {
        async function getUnexistingSKU(){
            await skuDAO.getSKU(skuID); 
        };
        // expect(getUnexistingSKU).toThrowError({err : 404, msg : "SKU not found"});
        await expect(() => skuDAO.getSKU(skuID)).rejects.toThrowError();
    });
}


function testGetAllSKU(expectedList) {
    test('get All SKU', async () => {
        let res = await skuDAO.getAllSKU();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareSKU(res[i], expectedList[i]);
        }
    });
}


function testUpdateSKU(skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, newPositionID) {
    test('update SKU', async () => {
        const expectedSKU = new SKU(skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, newPositionID);
        let res = await skuDAO.updateSKU(skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, newPositionID);
        res = await skuDAO.getSKU(skuID);
        compareSKU(res, expectedSKU);
    });
}


function testDeleteSKU(skuID, expectedList) {
    test('delete SKU', async () => {
        let res = await skuDAO.deleteSKU(skuID);
        res = await skuDAO.getAllSKU();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareSKU(res[i], expectedList[i]);
        }
    });
}


function compareSKU(sku, expectedSKU){
    expect(sku.getID()).toStrictEqual(expectedSKU.getID());
    expect(sku.getDescription()).toStrictEqual(expectedSKU.getDescription());
    expect(sku.getWeight()).toStrictEqual(expectedSKU.getWeight());
    expect(sku.getVolume()).toStrictEqual(expectedSKU.getVolume());
    expect(sku.getNotes()).toStrictEqual(expectedSKU.getNotes());
    expect(sku.getPrice()).toStrictEqual(expectedSKU.getPrice());
    expect(sku.getAvailableQuantity()).toStrictEqual(expectedSKU.getAvailableQuantity());
    expect(sku.getPosition()).toStrictEqual(expectedSKU.getPosition());
    expect(sku.getTestDescriptors()).toStrictEqual(expectedSKU.getTestDescriptors());
};
