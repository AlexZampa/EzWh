'use strict';

const dayjs = require("dayjs");
const TestResultDAO = require('../Database/TestResultDAO');
const TestResult = require('../Model/TestResult');
const SKU = require('../Model/Sku');
const TestDescriptor = require('../Model/TestDescriptor');
const SKUItem = require('../Model/SKUItem');

const  testResultDAO = new TestResultDAO();

const sku = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");

const skuItem1 = new SKUItem("1", sku.getID(), 1, null, undefined);
const skuItem2 = new SKUItem("2", sku2.getID(), 1, dayjs('2022-05-18'), undefined);

const td1 = new TestDescriptor(1, "name1", "procedure1", 1);
const td2 = new TestDescriptor(2, "name2", "procedure2", 2);

describe('Test Create and Get TestResult', () => {
    beforeAll(async () => {
        await testResultDAO.resetTable();
    });

    afterAll(async () => {
        await testResultDAO.resetTable();
    });
    
    const expectedTestResult1 = new TestResult(1, "1234", 1, "2022/03/12", "true");
    const expectedTestResult2 = new TestResult(2, "1234", 2, "2022/03/14", "false");

    testCreateTestResult("1234", 1, "2022/03/12", "true", 1);
    testGetTestResult(1, "1234", expectedTestResult1);

    testCreateTestResult("1234", 2, "2022/03/14", "false", 2);
    testGetTestResult(2, "1234", expectedTestResult2);
});

describe('Test throw err on get TestResult', () => {
    beforeAll(async () => {
        await testResultDAO.resetTable();
        await testResultDAO.newTestResult(1, "1234", 1, "2022/03/12", "true");
    });

    afterAll(async () => {
        await testResultDAO.resetTable();
    });

    testGetTestResultError(3, {err: 404, msg:  "Test result not found"});
});

describe('Test Get All TestResult', () => {
    beforeAll(async () => {
        await testResultDAO.resetTable();
        await testResultDAO.newTestResult("1234", 1, "2022/03/12", "true");
        await testResultDAO.newTestResult("1234", 2, "2022/03/14", "false");
        await testResultDAO.newTestResult("5678", 3, "2022/03/14", "false");
    });

    afterAll(async () => {
        await testResultDAO.resetTable();
    });

    const testResultList = [];
    testResultList.push(new TestResult(1, "1234", 1, "2022/03/12", "true"));
    testResultList.push(new TestResult(2, "1234", 2, "2022/03/14", "false"));
    testGetAllTestResult(testResultList);
});


describe('Test Update TestResult', () => {
    beforeAll(async () => {
        await testResultDAO.resetTable();
        await testResultDAO.newTestResult("1234", 1, "2022/03/12", "true");
    });

    afterAll(async () => {
        await testResultDAO.resetTable();
    });

    const expectedTestResult = new TestResult(1, "1234", 2, "2022/03/14", "false");
    const expectedChanges = 1;
    testUpdateTestResult(1, "1234", 2, "2022/03/14", "false", expectedChanges);
    testGetTestResult(1, "1234", expectedTestResult);
});


describe('Test Delete TestResult', () => {
    beforeAll(async () => {
        await testResultDAO.resetTable();
        await testResultDAO.newTestResult("1234", 1, "2022/03/12", "true");
        await testResultDAO.newTestResult("1234", 2, "2022/03/14", "false");
        await testResultDAO.newTestResult("5678", 3, "2022/03/14", "false");
    });

    afterAll(async () => {
        await testResultDAO.resetTable();
    });

    const testResultList = [];
    testResultList.push(new TestResult(1, "1234", 1, "2022/03/12", "true"));
    let expectedChanges = 1
    testDeleteTestResult(2, expectedChanges);
    testGetAllTestResult(testResultList);
});


function testCreateTestResult(rfid, idTestDescriptor, date, result, expectedID) {
    test('create new TestResult', async () => {
        let id = await testResultDAO.newTestResult(rfid, idTestDescriptor, date, result);
        expect(id).toStrictEqual(expectedID);
    });
}

function testGetTestResult(id, rfid, expectedTestResult) {
    test('get TestResult', async () => {
        let res = await testResultDAO.getTestResult(rfid, id);
        compareTestResult(res, expectedTestResult);
    });
}

function testGetTestResultError(id, expectedError){
    test('throw on get TestResult', async () => {
        async function getNonExistentTestResult(){
            await testResultDAO.getTestResult("1234", id); 
        };
        await expect(getNonExistentTestResult).rejects.toEqual(expectedError);
    });
}

function testGetAllTestResult(expectedList) {
    test('get All TestResult', async () => {
        let res = await testResultDAO.getAllTestResult("1234");
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareTestResult(res[i], expectedList[i]);
        }
    });
}


function testUpdateTestResult(id, rfid, newIdTestDescriptor, newDate, newResult, expectedChanges) {
    test('update TestResult', async () => {
        let res = await testResultDAO.updateTestResult(id, rfid, newIdTestDescriptor, newDate, newResult);
        expect(res).toStrictEqual(expectedChanges);
    });
}


function testDeleteTestResult(id, expectedChanges) {
    test('delete TestResult', async () => {
        let res = await testResultDAO.deleteTestResult(id, "1234");
        expect(res).toStrictEqual(expectedChanges);
    });
}


function compareTestResult(testResult, expectedTestResult){
    expect(testResult.getID()).toStrictEqual(expectedTestResult.getID());
    expect(testResult.getRFID()).toStrictEqual(expectedTestResult.getRFID());
    expect(testResult.getIdTestDescriptor()).toStrictEqual(expectedTestResult.getIdTestDescriptor());
    expect(testResult.getDate()).toStrictEqual(expectedTestResult.getDate());
    expect(testResult.getResult()).toStrictEqual(expectedTestResult.getResult());
};