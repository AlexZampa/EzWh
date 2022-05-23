'use strict';

const dayjs = require('dayjs');
const ReturnOrderDAO = require('../Database/ReturnOrderDAO');
const {RestockOrder} = require('../Model/RestockOrder');
const ReturnOrder = require('../Model/ReturnOrder');

const returnOrderDAO = new ReturnOrderDAO();

describe('Test Create and Get Return Order', () => {

    const restockOrderId = 15;

    const returnDate = dayjs();

    const products = [
        {SKUId:12, description:"a product", price:10.99, RFID:"12345678901234567890123456789016"},
        {SKUId:180, description:"another product", price:11.99, RFID:"12345678901234567890123456789038"}
    ];


    beforeAll(async () => {
        await returnOrderDAO.resetTable();
    });

    /*
    test('delete table ReturnOrder', async () => {
        let res = await returnOrderDAO.getAllReturnOrders();
        expect(res.length).toStrictEqual(0);
    });
    */
    
    const expectedRetOrd = new ReturnOrder(1, restockOrderId, returnDate, products);

    testCreateReturnOrder(products, restockOrderId, returnDate, 1);
    testGetReturnOrder(1, expectedRetOrd);
});

describe('Test throw err on get Return Order', () => {
    beforeAll(async () => {
        await returnOrderDAO.resetTable();
    });
    testGetReturnOrderError(3, {err: 404, msg:  "ReturnOrder not found"});
});

describe('Test Get All Return Orders', () => {

    const returnDate1 = dayjs();

    const products1 = [
        {SKUId:12, description:"a product", price:10.99, RFID:"12345678901234567890123456789016"},
        {SKUId:180, description:"another product", price:11.99, RFID:"12345678901234567890123456789038"}
    ];

    const returnDate2 = dayjs();

    const products2 = [
        {SKUId:14, description:"a product", price:0.99, RFID:"12345670901234567890123456789016"},
        {SKUId:150, description:"another product", price:11.97, RFID:"13345678901234567890123456789038"}
    ];

    beforeAll(async () => {
        await returnOrderDAO.resetTable();
        await returnOrderDAO.newReturnOrder(products1, 2, returnDate1);
        await returnOrderDAO.newReturnOrder(products2, 5, returnDate2);
    });

    const expectedList = [];
    expectedList.push(new ReturnOrder(1, 2, returnDate1, products1));
    expectedList.push(new ReturnOrder(2, 5, returnDate2, products2));
    
    testGetAllReturnOrder(expectedList);
});


describe('Test Delete Return Order', () => {

    const returnDate1 = dayjs();

    const products1 = [
        {SKUId:12, description:"a product", price:10.99, RFID:"12345678901234567890123456789016"},
        {SKUId:180, description:"another product", price:11.99, RFID:"12345678901234567890123456789038"}
    ];

    const returnDate2 = dayjs();

    const products2 = [
        {SKUId:14, description:"a product", price:0.99, RFID:"12345670901234567890123456789016"},
        {SKUId:150, description:"another product", price:11.97, RFID:"13345678901234567890123456789038"}
    ];

    beforeAll(async () => {
        await returnOrderDAO.resetTable();
        await returnOrderDAO.newReturnOrder(products1, 2, returnDate1);
        await returnOrderDAO.newReturnOrder(products2, 5, returnDate2);
    });

    testDeleteReturnOrder(2, 1);
    testDeleteReturnOrderError(2, { err: 404, msg: "ReturnOrder not found" });
});



function testCreateReturnOrder(products, restockOrderId, returnDate, expectedID) {
    test('create new Return Order', async () => {
        let res = await returnOrderDAO.newReturnOrder(products, restockOrderId, returnDate);
        expect(res.lastID).toStrictEqual(expectedID);
    });
}

function testGetReturnOrder(ID, expectedRetOrd) {
    test('get Return Order', async () => {
        let res = await returnOrderDAO.getReturnOrderById(ID);
        compareReturnOrder(res, expectedRetOrd);
    });
}

function testGetReturnOrderError(ID, expectedError){
    test('throw 404 not found on get Return Order', async () => {
        async function getNonExistentReturnOrder(){
            await returnOrderDAO.getReturnOrderById(ID); 
        };
        await expect(getNonExistentReturnOrder).rejects.toEqual(expectedError);
    });
}

function testGetAllReturnOrder(expectedList) {
    test('get All Return Orders', async () => {
        let res = await returnOrderDAO.getAllReturnOrders();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareReturnOrder(res[i], expectedList[i]);
        }
    });
}

function testDeleteReturnOrder(ID, expectedChanges) {
    test('delete Return Order', async () => {
        let res = await returnOrderDAO.deleteReturnOrder(ID);
        expect(res).toStrictEqual(expectedChanges);
    });
}

function testDeleteReturnOrderError(ID, expectedError) {
    test('delete non existing Return Order', async () => {
        async function deleteNonExistentReturnOrder(){
            await returnOrderDAO.deleteReturnOrder(ID); 
        };
        await expect(deleteNonExistentReturnOrder).rejects.toEqual(expectedError);
    });
}

function compareReturnOrder(a, b){
    expect(a.getId()).toStrictEqual(b.getId());
    expect(a.getReturnDate().format("YYYY-MM-DD HH:MM")).toEqual(b.getReturnDate().format("YYYY-MM-DD HH:MM"));
    expect(a.getRestockOrderId()).toStrictEqual(b.getRestockOrderId());
};
