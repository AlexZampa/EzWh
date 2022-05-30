"use strict";

const Warehouse = require("../Model/Warehouse");
const TestDescriptor = require('../Model/TestDescriptor');
const SKU = require('../Model/Sku');

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

describe("Test add Test descriptor", () => {

    const sku1 = new SKU(1, "description1", 3, 3, "notes1", 3, 3, 1);
    const sku2 = new SKU(2, "description2", 1, 4, "notes2", 3, 3, 2);

    beforeAll(() => {
        testDescriptorDAO.newTestDescriptor.mockReset();
        testDescriptorDAO.newTestDescriptor.mockReturnValueOnce(1).mockReturnValueOnce(2);
    
        skuDAO.getSKU.mockReset();
        skuDAO.getSKU.mockReturnValueOnce(sku2).mockReturnValueOnce(sku1).mockRejectedValueOnce({err: 404, msg: "SKU not found"});
    });

    testAddTestDescriptor("name1", "description 1", 2, 1);
    testAddTestDescriptor("name2", "description 2", 1, 2);
    testAddTestDescriptorError('throw error on inexistent sku', "name1", "description 1", 6, {err: 404, msg: "SKU not found"});

    function testAddTestDescriptor(name, procedureDescription, idSKU, expectedResult) {
        test('Add Test descriptor', async () => {
            let result = await wh.addTestDescriptor(name, procedureDescription, idSKU);
            expect(result).toBe(expectedResult);
        })
    }

    function testAddTestDescriptorError(testMessage, name, procedureDescription, idSKU, expectedError) {
        test(testMessage, async () => {
            async function invalidAddTestDescriptor(){
               await wh.addTestDescriptor(name, procedureDescription, idSKU);
            }
            await expect(invalidAddTestDescriptor).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get all Test descriptor", () => {
    
    let testDescriptorList = [];
    testDescriptorList.push(new TestDescriptor(1, "name1", "description 1", 2));
    testDescriptorList.push(new TestDescriptor(2, "name2", "description 2", 1));
    testDescriptorList.push(new TestDescriptor(3, "name3", "description 3", 3));
    
    let expectedList = [];
    const testdescriptor1 = new TestDescriptor(1, "name1", "description 1", 2);
    const testdescriptor2 = new TestDescriptor(2, "name2", "description 2", 1);
    const testdescriptor3 = new TestDescriptor(3, "name3", "description 3", 3);
    expectedList.push(testdescriptor1);
    expectedList.push(testdescriptor2);
    expectedList.push(testdescriptor3);
   

    beforeAll(() => {
        testDescriptorDAO.getAllTestDescriptor.mockReset();
        testDescriptorDAO.getAllTestDescriptor.mockReturnValue(testDescriptorList);
    });

    testgetAllTestDescriptor(expectedList);

    function testgetAllTestDescriptor(expectedResult) {
        test('Get all Test descriptor', async () => {
            let result = await wh.getTestDescriptors();
            for(const i in result){
                compareTestDescriptor(result[i], expectedResult[i]);
            }
        })
    }
});


describe("Test get Test descriptor", () => {
    
    let testDescriptorList = [];
    testDescriptorList.push(new TestDescriptor(1, "name1", "description 1", 2));
    testDescriptorList.push(new TestDescriptor(2, "name2", "description 2", 1));
    
    const testdescriptor1 = new TestDescriptor(1, "name1", "description 1", 2);
    const testdescriptor2 = new TestDescriptor(2, "name2", "description 2", 1);

    beforeAll(() => {
        testDescriptorDAO.getTestDescriptor.mockReset();
        testDescriptorDAO.getTestDescriptor.mockReturnValueOnce(testdescriptor1).mockReturnValue(testdescriptor2);
    });

    testGetTestDescriptor(1, testdescriptor1);
    testGetTestDescriptor(2, testdescriptor2);

    function testGetTestDescriptor(id, expectedResult) {
        test('Get Test descriptor by id', async () => {
            let result = await wh.getTestDescriptor(id);
            compareTestDescriptor(result, expectedResult);
        })
    }
});


describe("Test modify Test descriptor", () => {
    const testdescriptor1 = new TestDescriptor(1, "name1", "description 1", 2);

    const sku2 = new SKU(2, "description2", 1, 4, "notes2", 3, 3, 2);

    describe('Test modify', () => {
        beforeAll(() => {
            testDescriptorDAO.getTestDescriptor.mockReset();
            testDescriptorDAO.getTestDescriptor.mockReturnValueOnce(testdescriptor1);
            
            testDescriptorDAO.updateTestDescriptor.mockReset();
            testDescriptorDAO.updateTestDescriptor.mockReturnValue(1);

            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValueOnce(sku2);
        });

        let expectedResult = 1;
        test('Modify Test descriptor', async () => {
            let result = await wh.modifyTestDescriptor(1, "newName", "newProcedureDescription", 2);
            expect(result).toBe(expectedResult);
        })
    });

    describe("Test Errors", () => {
        beforeAll(() => {
            testDescriptorDAO.getTestDescriptor.mockReset();
            testDescriptorDAO.getTestDescriptor.mockRejectedValueOnce({err: 404, msg: "Test descriptor not found"});

            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockRejectedValueOnce({err: 404, msg: "SKU not found"});
        });    

        testModifyTestDescriptorError("throw error no test descriptor found", 1, "newName", "newDescription1", 2, {err: 404, msg: "Test descriptor not found"});

        function testModifyTestDescriptorError(testMessage, id, newName, newProcedureDescription, newIdSKU, expectedError){
            test(testMessage, async () => {
                async function invalidModify(){
                    await wh.modifyTestDescriptor(id, newName, newProcedureDescription, newIdSKU);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }

        testModifyTestDescriptorError("throw error no SKUid found", 1, "newName", "newDescription1", 7, {err: 404, msg: "SKU not found"});

        function testModifyTestDescriptorError(testMessage, id, newName, newProcedureDescription, newIdSKU, expectedError){
            test(testMessage, async () => {
                async function invalidModify(){
                    await wh.modifyTestDescriptor(id, newName, newProcedureDescription, newIdSKU);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }
    });
});


describe("Test delete Test descriptor", () => {
    const testDescriptor1 = new TestDescriptor(1, "name1", "description 1", 2);
    const testDescriptor2 = new TestDescriptor(2, "name2", "description 2", 1);

    beforeAll(() => {
        testDescriptorDAO.getTestDescriptor.mockReset();
        testDescriptorDAO.getTestDescriptor.mockReturnValueOnce(testDescriptor1).mockRejectedValueOnce({err: 404, msg:  "Test descriptor not found"});

        testDescriptorDAO.deleteTestDescriptor.mockReset();
        testDescriptorDAO.deleteTestDescriptor.mockReturnValue(1);
    });

    let id = 1;
    let expectedResult = 1;
    test('Delete Test descriptor', async () => {
        let result = await wh.deleteTestDescriptor(id);
        expect(result).toBe(expectedResult);
    })

    testDeleteTestDescriptorError("throw error on Test descriptor not found", 5, {err: 404, msg:  "Test descriptor not found"});

    function testDeleteTestDescriptorError(testMessage, id, expectedError){
        test(testMessage, async () => {
            async function invalidDelete(){
                await wh.deleteTestDescriptor(id);
            };
            await expect(invalidDelete).rejects.toEqual(expectedError);
        })
    }
});


function compareTestDescriptor(TestDescriptor, expectedTestDescriptor){
    expect(TestDescriptor.getID()).toStrictEqual(expectedTestDescriptor.getID());
    expect(TestDescriptor.getName()).toStrictEqual(expectedTestDescriptor.getName());
    expect(TestDescriptor.getprocedureDescription()).toStrictEqual(expectedTestDescriptor.getprocedureDescription());
    expect(TestDescriptor.getSKUid()).toStrictEqual(expectedTestDescriptor.getSKUid());
};