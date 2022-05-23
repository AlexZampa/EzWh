'use strict';

const dayjs = require('dayjs');
const InternalOrderDAO = require('../Database/InternalOrderDAO');
const InternalOrder = require('../Model/InternalOrder');

const internalOrderDAO = new InternalOrderDAO();

describe('Test Create and Get Internal Order', () => {
    beforeAll(async () => {
        await internalOrderDAO.resetTable();
    });

    test('delete table InternalOrder', async () => {
        let res = await internalOrderDAO.getAllInternalOrders();
        expect(res.length).toStrictEqual(0);
    });
    
    const date = new dayjs()
    const product = {SKUId:2, description:"abc", price:2.99, qty:10};
    const expectedIO = new InternalOrder(1, 1, date, "ISSUED");   
    expectedIO.addProduct(product.SKUId, product.price, product.description, product.qty);
    
    testCreateIO(date, [product], 1, "ISSUED", 1);
    testGetIO(1, expectedIO);
});

describe('Test throw err on get Internal Order', () => {
    beforeAll(async () => {
        await internalOrderDAO.resetTable();
    });

    testGetIOerror(3, {err: 404, msg:  "not found"});
});

describe('Test Get All Internal Orders', () => {

    const date = new dayjs()
    const product = {SKUId:2, description:"abc", price:2.99, qty:10};

    beforeAll(async () => {
        await internalOrderDAO.resetTable();
        await internalOrderDAO.newInternalOrder(date, [product], 1, "ISSUED");
        await internalOrderDAO.newInternalOrder(date, [product], 2, "ACCEPTED")
        await internalOrderDAO.newInternalOrder(date, [product], 3, "ISSUED");
    });

    const expectedList = [];
    expectedList.push(new InternalOrder(1, 1, date, "ISSUED"));
    expectedList.push(new InternalOrder(2, 2, date, "ACCEPTED"));
    expectedList.push(new InternalOrder(3, 3, date, "ISSUED"));
    testGetAllIO(expectedList);
});

describe('Test Get All Internal Orders Issued', () => {

    const date = new dayjs()
    const product = {SKUId:2, description:"abc", price:2.99, qty:10};

    beforeAll(async () => {
        await internalOrderDAO.resetTable();
        await internalOrderDAO.newInternalOrder(date, [product], 1, "ISSUED");
        await internalOrderDAO.newInternalOrder(date, [product], 2, "ACCEPTED")
        await internalOrderDAO.newInternalOrder(date, [product], 3, "ISSUED");
    });

    const expectedList = [];
    expectedList.push(new InternalOrder(1, 1, date, "ISSUED"));
    expectedList.push(new InternalOrder(3, 3, date, "ISSUED"));
    testGetAllIssuedIO(expectedList);
});

describe('Test Get All Internal Orders Accepted', () => {

    const date = new dayjs()
    const product = {SKUId:2, description:"abc", price:2.99, qty:10};

    beforeAll(async () => {
        await internalOrderDAO.resetTable();
        await internalOrderDAO.newInternalOrder(date, [product], 1, "ISSUED");
        await internalOrderDAO.newInternalOrder(date, [product], 2, "ACCEPTED")
        await internalOrderDAO.newInternalOrder(date, [product], 3, "ACCEPTED");
    });

    const expectedList = [];
    expectedList.push(new InternalOrder(2, 2, date, "ACCEPTED"));
    expectedList.push(new InternalOrder(3, 3, date, "ACCEPTED"));
    testGetAllAcceptedIO(expectedList);
});


describe('Test add delivered products to a completed Internal Order', () => {

    const date = new dayjs()
    const product = {SKUId:2, description:"abc", price:2.99, qty:10};

    beforeAll(async () => {
        await internalOrderDAO.resetTable();
        await internalOrderDAO.newInternalOrder(date, [product], 1, "COMPLETED");
    });

    const deliveredProducts = [
        {SKUId:12, description:"a product", price:10.99, RFID:"12345678901234567890123456789016"},
        {SKUId:180, description:"another product", price:11.99, RFID:"12345678901234567890123456789038"}
    ];
    testAddDeliveredProducts(1, deliveredProducts, deliveredProducts);
});

describe('Test update Internal Order state', () => {

    const date = new dayjs()
    const product = {SKUId:2, description:"abc", price:2.99, qty:10};

    beforeAll(async () => {
        await internalOrderDAO.resetTable();
        await internalOrderDAO.newInternalOrder(date, [product], 1, "ISSUED");
    });

    testUpdateInternalOrderState(1, "ACCEPTED", 1);
});

describe('Test Delete Internal Order', () => {

    const date = new dayjs()
    const product = {SKUId:2, description:"abc", price:2.99, qty:10};

    beforeAll(async () => {
        await internalOrderDAO.resetTable();
        await internalOrderDAO.newInternalOrder(date, [product], 1, "ISSUED");
        await internalOrderDAO.newInternalOrder(date, [product], 2, "ACCEPTED")
        await internalOrderDAO.newInternalOrder(date, [product], 3, "ACCEPTED");
    });

    const expectedList = [];
    expectedList.push(new InternalOrder(1, 1, date, "ISSUED"));
    expectedList.push(new InternalOrder(2, 2, date, "ACCEPTED"));
    testDeleteIO(3, 1);
    testGetAllIO(expectedList);
    testDeleteIO(3, 0);
});

function testCreateIO(issueDate, products, customerId, state, expectedID) {
    test('create new Internal Order', async () => {
        let id = await internalOrderDAO.newInternalOrder(issueDate, products, customerId, state);
        expect(id).toStrictEqual(expectedID);
    });
}


function testGetIO(ioID, expectedIO) {
    test('get Internal Order', async () => {
        let res = await internalOrderDAO.getInternalOrder(ioID);
        compareIO(res, expectedIO);
    });
}

function testGetIOerror(ID, expectedError){
    test('throw 404 on get Internal Order', async () => {
        async function getNonExistentIO(){
            await internalOrderDAO.getInternalOrder(ID); 
        };
        await expect(getNonExistentIO).rejects.toEqual(expectedError);
    });
}

function testGetAllIO(expectedList) {
    test('get All Internal Orders', async () => {
        let res = await internalOrderDAO.getAllInternalOrders();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareIO(res[i], expectedList[i]);
        }
    });
}

function testGetAllIssuedIO(expectedList) {
    test('get All Issued Internal Orders', async () => {
        let res = await internalOrderDAO.getAllIssued();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareIO(res[i], expectedList[i]);
        }
    });
}

function testGetAllAcceptedIO(expectedList) {
    test('get All Accepted Internal Orders', async () => {
        let res = await internalOrderDAO.getAllAccepted();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareIO(res[i], expectedList[i]);
        }
    });
}


function testAddDeliveredProducts(ID, productList, expectedProducts) {
    test('Add delivered products for a completed Internal Order', async () => {
        await internalOrderDAO.addDeliveredProducts(ID, productList);
        let res = await internalOrderDAO.getInternalOrder(ID);
        expect(res.products).toStrictEqual(expectedProducts);
    });
}

function testUpdateInternalOrderState(ID, newState, expectedChanges) {
    test('Set Internal Order state', async () => {
        let res = await internalOrderDAO.setStatus(ID, newState);
        expect(res).toStrictEqual(expectedChanges);
    });
}

function testDeleteIO(ID, expectedChanges) {
    test('delete Internal Order', async () => {
        let res = await internalOrderDAO.deleteInternalOrder(ID);
        expect(res).toStrictEqual(expectedChanges);
    });
}

function compareIO(io, expectedIO){
    expect(io.getId()).toStrictEqual(expectedIO.getId());
    expect(io.getIssueDate().format("YYYY/MM/DD HH:MM")).toStrictEqual(expectedIO.getIssueDate().format("YYYY/MM/DD HH:MM"));
    expect(io.getState()).toStrictEqual(expectedIO.getState());
};
