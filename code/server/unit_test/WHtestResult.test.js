"use strict";

const Warehouse = require("../Model/Warehouse");
const TestResult = require('../Model/TestResult');
const TestDescriptor = require('../Model/TestDescriptor');
const SKUitem = require('../Model/SKUItem');

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
const TestDescriptorDAO = require("../Database/TestDescriptorDAO");

const wh = new Warehouse(userDAO, skuDAO, skuItemDAO, positionDAO, restockOrderDAO, returnOrderDAO, internalOrderDAO, itemDAO, testDescriptorDAO, testResultDAO);

describe("Test add Test result", () => {

    const skuItem1 = new SKUitem("1234", 1, 3, "2022/02/25");
    const skuItem2 = new SKUitem("2345", 2, 2, "2022/02/25");

    const testDescriptor1 = new TestDescriptor(1, "name1", "description1", 1);

    beforeAll(() => {
        testResultDAO.newTestResult.mockReset();
        testResultDAO.newTestResult.mockReturnValueOnce(1).mockReturnValueOnce(2);
    
        skuItemDAO.getSKUItem.mockReset();
        skuItemDAO.getSKUItem.mockReturnValueOnce(skuItem2).mockReturnValueOnce(skuItem1).mockRejectedValueOnce({err: 404, msg: "SKU not found"}).mockRejectedValueOnce({err: 404, msg: "Test descriptor not found"});
    
        testDescriptorDAO.getTestDescriptor.mockReset();
        testDescriptorDAO.getTestDescriptor.mockReturnValueOnce(testDescriptor1).mockReturnValueOnce(testDescriptor1).mockRejectedValueOnce();
    });

    testAddTestResult("1234", 1, "2022/03/10", "false", 1);
    testAddTestResult("2345", 1, "2022/03/11", "true", 2);
    testAddTestResultError('throw error on non existing sku', "3546", 1, "2022/03/10", "false", {err: 404, msg: "SKU not found"});
    testAddTestResultError('throw err on non existing test descriptor', "1234", 2, "2022/03/10", "false", {err: 404, msg: "Test descriptor not found"});

    function testAddTestResult(rfid, idTestDescriptor, date, res, expectedResult) {
        test('Add Test result', async () => {
            let result = await wh.addTestResult(rfid, idTestDescriptor, date, res);
            expect(result).toBe(expectedResult);
        })
    }

    function testAddTestResultError(testMessage, rfid, idTestDescriptor, date, result, expectedError) {
        test(testMessage, async () => {
            async function invalidAddTestResult(){
               await wh.addTestResult(rfid, idTestDescriptor, date, result);
            }
            await expect(invalidAddTestResult).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get all Test result", () => {

    const skuItem2 = new SKUitem("2345", 2, 2, "2022/02/25");
    
    let testResultList = [];
    testResultList.push(new TestResult(1, "1234", 1, "2022/03/10", "false"));
    testResultList.push(new TestResult(2, "2345", 1, "2022/03/11", "true"));
    testResultList.push(new TestResult(3, "2345", 2, "2022/03/13", "false"));
    
    let expectedList = [];
    const testresult2 = new TestResult(2, "2345", 1, "2022/03/11", "true");
    const testresult3 = new TestResult(3, "2345", 2, "2022/03/13", "false");
    expectedList.push(testresult2);
    expectedList.push(testresult3);
   

    beforeAll(() => {
        testResultDAO.getAllTestResult.mockReset();
        testResultDAO.getAllTestResult.mockReturnValue(testResultList.filter(()=>this.rfid==="2345"));

        skuItemDAO.getSKUItem.mockReset();
        skuItemDAO.getSKUItem.mockReturnValueOnce(skuItem2).mockRejectedValueOnce({ err: 404, msg: "SKUItem not found" });
    });

    testgetAllTestResult("2345", expectedList);
    testgetAllTestResultError("4567", { err: 404, msg: "SKUItem not found" });

    function testgetAllTestResult(rfid, expectedResult) {
        test('Get all Test result', async () => {
            let result = await wh.getTestResults(rfid);
            for(const i in result){
                compareTestResult(result[i], expectedResult[i]);
            }
        })
    }

    function testgetAllTestResultError(rfid, expectedError) {
        test('throw err on Get all Test result', async () => {
            async function invalidGetAllTestResult(){
                await wh.getTestResults(rfid);
            }
            await expect(invalidGetAllTestResult).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get Test result", () => {

    const skuItem2 = new SKUitem("2345", 2, 2, "2022/02/25");

    const testDescriptor1 = new TestDescriptor(1, "name", "desciption", 1);
    const testDescriptor2 = new TestDescriptor(2, "name", "desciption", 3);
    
    let testResultList = [];
    testResultList.push(new TestResult(2, "2345", 1, "2022/03/11", "true"));
    testResultList.push(new TestResult(3, "2345", 2, "2022/03/13", "false"));
    
    const testResult1 = new TestResult(2, "2345", 1, "2022/03/11", "true");
    const testResult2 = new TestResult(3, "2345", 2, "2022/03/13", "false");

    beforeAll(() => {
        testResultDAO.getTestResult.mockReset();
        testResultDAO.getTestResult.mockReturnValueOnce(testResult1).mockReturnValue(testResult2);

        testDescriptorDAO.getTestDescriptor.mockReset();
        testDescriptorDAO.getTestDescriptor.mockReturnValueOnce(testDescriptor1).mockReturnValueOnce(testDescriptor2);

        skuItemDAO.getSKUItem.mockReset();
        skuItemDAO.getSKUItem.mockReturnValueOnce(skuItem2).mockReturnValueOnce(skuItem2).mockRejectedValueOnce({ err: 404, msg: "SKUItem not found" });
    });

    testGetTestResult(2, "2345", testResult1);
    testGetTestResult(3, "2345", testResult2);
    testgetTestResultError(2, "1234", { err: 404, msg: "SKUItem not found" });

    function testGetTestResult(id, rfid, expectedResult) {
        test('Get Test Result by id', async () => {
            let result = await wh.getTestResult(rfid, id);
            compareTestResult(result, expectedResult);
        })
    }

    function testgetTestResultError(id, rfid, expectedError) {
        test('throw err on Get all Test result', async () => {
            async function invalidGetTestResult(){
                await wh.getTestResults(rfid, id);
            }
            await expect(invalidGetTestResult).rejects.toEqual(expectedError);
        })
    }
});


describe("Test modify Test result", () => {

    const skuItem2 = new SKUitem("2345", 2, 2, "2022/02/25");

    const testDescriptor1 = new TestDescriptor(1, "name2", "description1", 2);

    const testResult1 = new TestResult(2, "2345", 1, "2022/03/11", "true");
    const testResult2 = new TestResult(3, "2345", 2, "2022/03/13", "false");

    describe('Test modify', () => {
        beforeAll(() => {
            testResultDAO.getTestResult.mockReset();
            testResultDAO.getTestResult.mockReturnValueOnce(testResult1);
            
            testResultDAO.updateTestResult.mockReset();
            testResultDAO.updateTestResult.mockReturnValue(1);

            skuItemDAO.getSKUItem.mockReset();
            skuItemDAO.getSKUItem.mockReturnValueOnce(skuItem2);

            testDescriptorDAO.getTestDescriptor.mockReset();
            testDescriptorDAO.getTestDescriptor.mockReturnValueOnce(testDescriptor1);
        });

        let expectedResult = 1;
        test('Modify Test result', async () => {
            let result = await wh.modifyTestResult("2345", 2, 1, "2022/03/27", "true");
            expect(result).toBe(expectedResult);
        })
    });

    describe("Test Errors", () => {
        beforeAll(() => {
            testResultDAO.getTestResult.mockReset();
            testResultDAO.getTestResult.mockRejectedValueOnce({err: 404, msg: "Test result not found"});

            skuItemDAO.getSKUItem.mockReset();
            skuItemDAO.getSKUItem.mockRejectedValueOnce({err: 404, msg: "SKUitem not found"}).mockReturnValue(skuItem2);

            testDescriptorDAO.getTestDescriptor.mockReset();
            testDescriptorDAO.getTestDescriptor.mockRejectedValueOnce({err: 404, msg: "Test descriptor not found"}).mockReturnValueOnce(testDescriptor1);
        });    

        testModifyTestResultError("throw error no rfid found", "1234", 2, 1, "2022/03/11", "true", {err: 404, msg: "SKUitem not found"});
        testModifyTestResultError("throw error no test descriptor found", "2345", 2, 7, "2022/03/11", "true", {err: 404, msg: "Test descriptor not found"});
        testModifyTestResultError("throw error no test result found", "2345", 5, 1, "2022/03/11", "true", {err: 404, msg: "Test result not found"});

        function testModifyTestResultError(testMessage, rfid, id, newIdTestDescriptor, newDate, newResult, expectedError){
            test(testMessage, async () => {
                async function invalidModify(){
                    await wh.modifyTestResult(rfid, id, newIdTestDescriptor, newDate, newResult);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }
    });
});


describe("Test delete Test result", () => {
    const testResult1 = new TestResult(1, "2345", 1, "2022/03/11", "true");
    const testResult2 = new TestResult(2, "2345", 2, "2022/03/13", "false");

    beforeAll(() => {
        testResultDAO.getTestResult.mockReset();
        testResultDAO.getTestResult.mockReturnValueOnce(testResult1).mockRejectedValueOnce({err: 404, msg:  "Test result not found"});

        testResultDAO.deleteTestResult.mockReset();
        testResultDAO.deleteTestResult.mockReturnValue(1);
    });

    let id = 1;
    let expectedResult = 1;
    test('Delete Test result', async () => {
        let result = await wh.deleteTestResult(id);
        expect(result).toBe(expectedResult);
    })

    testDeleteTestResultError("throw error on Test result not found", 5, {err: 404, msg:  "Test result not found"});

    function testDeleteTestResultError(testMessage, id, expectedError){
        test(testMessage, async () => {
            async function invalidDelete(){
                await wh.deleteTestResult(id);
            };
            await expect(invalidDelete).rejects.toEqual(expectedError);
        })
    }
});


function compareTestResult(testResult, expectedTestResult){
    expect(testResult.getID()).toStrictEqual(expectedTestResult.getID());
    expect(testResult.getRFID()).toStrictEqual(expectedTestResult.getRFID());
    expect(testResult.getIdTestDescriptor()).toStrictEqual(expectedTestResult.getIdTestDescriptor());
    expect(testResult.getDate()).toStrictEqual(expectedTestResult.getDate());
    expect(testResult.getResult()).toStrictEqual(expectedTestResult.getResult());
};