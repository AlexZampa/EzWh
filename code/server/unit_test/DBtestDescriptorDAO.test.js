'use strict';

const TestDescriptorDAO = require('../Database/TestDescriptorDAO');
const TestDescriptor = require('../Model/TestDescriptor');
const SKU = require('../Model/Sku');

const  testDescriptorDAO = new TestDescriptorDAO();

const sku1 = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");
const sku3 = new SKU(3, "description 3", 40, 40, "notes 3", 15.99, 20, null);

describe('Test Create and Get TestDescriptor', () => {
    beforeAll(async () => {
        await testDescriptorDAO.resetTable();
    });

    afterAll(async () => {
        await testDescriptorDAO.resetTable();
    });
    
    const expectedTestDescriptor1 = new TestDescriptor(1, "name1", "description1", 2);
    const expectedTestDescriptor2 = new TestDescriptor(2, "name2", "description2", 3);

    testCreateTestDescriptor("name1", "description1", 2, 1);
    testGetTestDescriptor(1, expectedTestDescriptor1);

    testCreateTestDescriptor("name2", "description2", 3, 2);
    testGetTestDescriptor(2, expectedTestDescriptor2);
});

describe('Test throw err on get TestDescriptor', () => {
    beforeAll(async () => {
        await testDescriptorDAO.resetTable();
        await testDescriptorDAO.newTestDescriptor(2, "name2", "description2", 3);
    });

    afterAll(async () => {
        await testDescriptorDAO.resetTable();
    });

    testGetTestDescriptorError(3, {err: 404, msg:  "Test descriptor not found"});
});

describe('Test Get All TestDescriptor', () => {
    beforeAll(async () => {
        await testDescriptorDAO.resetTable();
        await testDescriptorDAO.newTestDescriptor("name1", "description1", 2);
        await testDescriptorDAO.newTestDescriptor("name2", "description2", 3);
        await testDescriptorDAO.newTestDescriptor("name3", "description3", 1);
    });

    afterAll(async () => {
        await testDescriptorDAO.resetTable();
    });

    const TestDescriptorList = [];
    TestDescriptorList.push(new TestDescriptor(1, "name1", "description1", 2));
    TestDescriptorList.push(new TestDescriptor(2, "name2", "description2", 3));
    TestDescriptorList.push(new TestDescriptor(3, "name3", "description3", 1));
    testGetAllTestDescriptor(TestDescriptorList);
});


describe('Test Update TestDescriptor', () => {
    beforeAll(async () => {
        await testDescriptorDAO.resetTable();
        await testDescriptorDAO.newTestDescriptor(1, "name2", "description2", 3);
    });

    afterAll(async () => {
        await testDescriptorDAO.resetTable();
    });

    const expectedTestDescriptor = new TestDescriptor(1, "name1", "description1", 2);
    const expectedChanges = 1;
    testUpdateTestDescriptor(1, "name1", "description1", 2, expectedChanges);
    testGetTestDescriptor(1, expectedTestDescriptor);
});


describe('Test Delete TestDescriptor', () => {
    beforeAll(async () => {
        await testDescriptorDAO.resetTable();
        await testDescriptorDAO.newTestDescriptor("name1", "description1", 2);
        await testDescriptorDAO.newTestDescriptor("name2", "description2", 3);
        await testDescriptorDAO.newTestDescriptor("name3", "description3", 1);
    });

    afterAll(async () => {
        await testDescriptorDAO.resetTable();
    });
    
    const TestDescriptorList = [];
    TestDescriptorList.push(new TestDescriptor(1, "name1", "description1", 2));
    TestDescriptorList.push(new TestDescriptor(3, "name3", "description3", 1));
    let expectedChanges = 1
    testDeleteTestDescriptor(2, expectedChanges);
    testGetAllTestDescriptor(TestDescriptorList);
});




function testCreateTestDescriptor(name, procedureDescription, SKUid, expectedID) {
    test('create new TestDescriptor', async () => {
        let id = await testDescriptorDAO.newTestDescriptor(name, procedureDescription, SKUid);
        expect(id).toStrictEqual(expectedID);
    });
}

function testGetTestDescriptor(id, expectedTestDescriptor) {
    test('get TestDescriptor', async () => {
        let res = await testDescriptorDAO.getTestDescriptor(id);
        compareTestDescriptor(res, expectedTestDescriptor);
    });
}

function testGetTestDescriptorError(id, expectedError){
    test('throw on get TestDescriptor', async () => {
        async function getNonExistentTestDescriptor(){
            await testDescriptorDAO.getTestDescriptor(id); 
        };
        await expect(getNonExistentTestDescriptor).rejects.toEqual(expectedError);
    });
}

function testGetAllTestDescriptor(expectedList) {
    test('get All TestDescriptor', async () => {
        let res = await testDescriptorDAO.getAllTestDescriptor();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareTestDescriptor(res[i], expectedList[i]);
        }
    });
}


function testUpdateTestDescriptor(id, newName, newProcedureDescription, newSKUid, expectedChanges) {
    test('update TestDescriptor', async () => {
        let res = await testDescriptorDAO.updateTestDescriptor(id, newName, newProcedureDescription, newSKUid);
        expect(res).toStrictEqual(expectedChanges);
    });
}


function testDeleteTestDescriptor(id, expectedChanges) {
    test('delete TestDescriptor', async () => {
        let res = await testDescriptorDAO.deleteTestDescriptor(id);
        expect(res).toStrictEqual(expectedChanges);
    });
}


function compareTestDescriptor(TestDescriptor, expectedTestDescriptor){
    expect(TestDescriptor.getID()).toStrictEqual(expectedTestDescriptor.getID());
    expect(TestDescriptor.getName()).toStrictEqual(expectedTestDescriptor.getName());
    expect(TestDescriptor.getprocedureDescription()).toStrictEqual(expectedTestDescriptor.getprocedureDescription());
    expect(TestDescriptor.getSKUid()).toStrictEqual(expectedTestDescriptor.getSKUid());
};