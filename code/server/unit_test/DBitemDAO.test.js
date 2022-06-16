'use strict';

const ItemDAO = require('../Database/ItemDAO');
const Item = require('../Model/Item');

const  itemDAO = new ItemDAO();

describe('Test Create and Get Item', () => {
    beforeAll(async () => {
        await itemDAO.resetTable();
    });

    afterAll(async () => {
        await itemDAO.resetTable();
    });

    test('delete table Item', async () => {
        let res = await itemDAO.getAllItem();
        expect(res.length).toStrictEqual(0);
    });
    
    const expectedItem1 = new Item(1, "description 1", 30.5, 1, 4);
    const expectedItem2 = new Item(2, "description 2", 20, 2, 3);

    testCreateItem(1, "description 1", 30.5, 1, 4, 1);
    testGetItem(1, 4, expectedItem1);

    testCreateItem(2, "description 2", 20, 2, 3, 2);
    testGetItem(2, 3, expectedItem2);
});

describe('Test throw err on create item(id already exists)', () => {
    beforeAll(async () => {
        await itemDAO.resetTable();
        await itemDAO.newItem(1, "description 1", 30.5, 1, 4);
    });

    afterAll(async () => {
        await itemDAO.resetTable();
    });

    testCreateItemError(1, "description 3", 30, 1, 4, { err: 422, msg: "id not unique" });
});

describe('Test throw err on create item(same skuid for same supplier)', () => {
    beforeAll(async () => {
        await itemDAO.resetTable();
        await itemDAO.newItem(1, "description 1", 30.5, 1, 4);
    });

    afterAll(async () => {
        await itemDAO.resetTable();
    });

    testCreateItemError(3, "description 3", 30, 1, 4, { err: 422, msg: "this supplier already sells an item with the same SKUId" });
});

describe('Test throw err on get Item', () => {
    beforeAll(async () => {
        await itemDAO.resetTable();
        await itemDAO.newItem(1, "description 1", 30.5, 1, 4);
    });

    afterAll(async () => {
        await itemDAO.resetTable();
    });

    testGetItemError(3, {err: 404, msg:  "Item not found"});
});

describe('Test Get All Item', () => {
    beforeAll(async () => {
        await itemDAO.resetTable();
        await itemDAO.newItem(1, "description 1", 30.5, 1, 4);
        await itemDAO.newItem(2, "description 2", 20, 3, 5);
        await itemDAO.newItem(3, "description 3", 30.5, 2, 1);
    });

    afterAll(async () => {
        await itemDAO.resetTable();
    });

    const itemList = [];
    itemList.push(new Item(1, "description 1", 30.5, 1, 4));
    itemList.push(new Item(2, "description 2", 20, 3, 5));
    itemList.push(new Item(3, "description 3", 30.5, 2, 1));
    testGetAllItem(itemList);
});


describe('Test Update Item', () => {
    beforeAll(async () => {
        await itemDAO.resetTable();
        await itemDAO.newItem(1, "description 1", 30.5, 1, 4);
    });

    afterAll(async () => {
        await itemDAO.resetTable();
    });
    
    const expectedItem = new Item(1, "description 2", 40, 1, 4);
    const expectedChanges = 1;
    testUpdateItem(1, "description 2", 40, 1, 4, expectedChanges);
    testGetItem(1, 4, expectedItem);
});


describe('Test Delete Item', () => {
    beforeAll(async () => {
        await itemDAO.resetTable();
        await itemDAO.newItem(1, "description 1", 30.5, 1, 4);
        await itemDAO.newItem(2, "description 2", 20, 3, 5);
        await itemDAO.newItem(3, "description 3", 30.5, 2, 1);
    });

    afterAll(async () => {
        await itemDAO.resetTable();
    });

    const itemList = [];
    itemList.push(new Item(1, "description 1", 30.5, 1, 4));
    itemList.push(new Item(3, "description 3", 30.5, 2, 1));
    let expectedChanges = 1
    testDeleteItem(2, 5, expectedChanges);
    testGetAllItem(itemList);
});




function testCreateItem(itemId, description, price, associatedSKU, supplier, expectedID) {
    test('create new Item', async () => {
        let id = await itemDAO.newItem(itemId, description, price, associatedSKU, supplier);
        expect(id).toStrictEqual(expectedID);
    });
}

function testCreateItemError(itemId, description, price, associatedSKU, supplier, expectedError) {
    test('throw on create Item', async () => {
        async function getAlreadyExistentItem(){
            await itemDAO.newItem(itemId, description, price, associatedSKU, supplier); 
        };
        await expect(getAlreadyExistentItem).rejects.toEqual(expectedError);
    });
}

function testGetItem(id, supplierId, expectedItem) {
    test('get Item', async () => {
        let res = await itemDAO.getItem(id, supplierId);
        compareItem(res, expectedItem);
    });
}

function testGetItemError(id, expectedError){
    test('throw on get Item', async () => {
        async function getNonExistentItem(){
            await itemDAO.getItem(id); 
        };
        await expect(getNonExistentItem).rejects.toEqual(expectedError);
    });
}

function testGetAllItem(expectedList) {
    test('get All Item', async () => {
        let res = await itemDAO.getAllItem();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareItem(res[i], expectedList[i]);
        }
    });
}

function testUpdateItem(id, newDescription, newPrice, newAssociatedSKU, newSupplier, expectedChanges) {
    test('update Item', async () => {
        let res = await itemDAO.updateItem(id, newDescription, newPrice, newAssociatedSKU, newSupplier);
        expect(res).toStrictEqual(expectedChanges);
    });
}


function testDeleteItem(id, supplierId, expectedChanges) {
    test('delete Item', async () => {
        let res = await itemDAO.deleteItem(id, supplierId);
        expect(res).toStrictEqual(expectedChanges);
    });
}


function compareItem(item, expectedItem){
    expect(item.getID()).toStrictEqual(expectedItem.getID());
    expect(item.getDescription()).toStrictEqual(expectedItem.getDescription());
    expect(item.getPrice()).toStrictEqual(expectedItem.getPrice());
    expect(item.getAssociatedSKU()).toStrictEqual(expectedItem.getAssociatedSKU());
    expect(item.getSupplier()).toStrictEqual(expectedItem.getSupplier());
};