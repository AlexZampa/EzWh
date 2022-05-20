"use strict";

const Warehouse = require("../Model/Warehouse");
const SKU = require('../Model/Sku');
const TestDescriptor = require('../Model/TestDescriptor');
const Position = require('../Model/Position');

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

describe("Test add SKU", () => {
    let id = 1;
    beforeEach(() => {
        skuDAO.newSKU.mockReset();
        skuDAO.newSKU.mockReturnValue(id);
        id++;
    });

    testAddSKU("description 1", 20, 30, "notes 1", 10.99, 50, 1);
    testAddSKU("description 2", 100, 300, "notes 2", 15.99, 500, 2);
    testAddSKUError('throw error on negative weight', "description", -10, 30, "notes", 10.99, 50, {err: 422, msg: "Invalid data"});
    testAddSKUError('throw error on negative volume', "description", 10, -30, "notes", 10.99, 50, {err: 422, msg: "Invalid data"});
    testAddSKUError('throw error on negative price', "description", 10, 30, "notes", -10, 50, {err: 422, msg: "Invalid data"});
    testAddSKUError('throw error on negative quantity', "description", 10, 30, "notes", 10.99, -50, {err: 422, msg: "Invalid data"});

    function testAddSKU(description, weight, volume, notes, price, availableQty, expectedResult) {
        test('Add SKU', async () => {
            let result = await wh.addSKU(description, weight, volume, notes, price, availableQty);
            expect(result).toBe(expectedResult);
        })
    }

    function testAddSKUError(testMessage, description, weight, volume, notes, price, availableQty, expectedError) {
        test(testMessage, async () => {
            async function invalidAddSKU(){
               await wh.addSKU(description, weight, volume, notes, price, availableQty);
            }
            await expect(invalidAddSKU).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get all SKU", () => {
    
    let skuList = [];
    skuList.push(new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null));
    skuList.push(new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900"));
    skuList.push(new SKU(3, "description 3", 40, 40, "notes 3", 15.99, 20, null));

    let testList = [];
    const test1 = new TestDescriptor(1, "test 1", "procedure 1", 2);
    const test2 = new TestDescriptor(2, "test 2", "procedure 2", 2);
    const test3 = new TestDescriptor(3, "test 3", "procedure 3", 1);
    testList.push(test1);
    testList.push(test2);
    testList.push(test3);
    
    let expectedList = [];
    const sku1 = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
    const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");
    const sku3 = new SKU(3, "description 3", 40, 40, "notes 3", 15.99, 20, null);
    sku1.addTestDescriptor(test3);
    sku2.addTestDescriptor(test1);
    sku2.addTestDescriptor(test2);
    expectedList.push(sku1);
    expectedList.push(sku2);
    expectedList.push(sku3);
   

    beforeAll(() => {
        skuDAO.getAllSKU.mockReset();
        skuDAO.getAllSKU.mockReturnValue(skuList);
        testDescriptorDAO.getAllTestDescriptor.mockReset();
        testDescriptorDAO.getAllTestDescriptor.mockReturnValue(testList);
    });

    testGetAllSKU(expectedList);

    function testGetAllSKU(expectedResult) {
        test('Get all SKU', async () => {
            let result = await wh.getSKUs();
            for(const i in result){
                compareSKU(result[i], expectedResult[i]);
            }
        })
    }
});


describe("Test get SKU", () => {
    
    let testList = [];
    const test1 = new TestDescriptor(1, "test 1", "procedure 1", 2);
    const test2 = new TestDescriptor(2, "test 2", "procedure 2", 2);
    testList.push(test1);
    testList.push(test2);

    const sku1 = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
    const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");

    beforeAll(() => {
        skuDAO.getSKU.mockReset();
        skuDAO.getSKU.mockReturnValueOnce(sku1).mockReturnValue(sku2);
        testDescriptorDAO.getAllTestDescriptor.mockReset();
        testDescriptorDAO.getAllTestDescriptor.mockReturnValue(testList);
    });

    sku2.addTestDescriptor(test1);
    sku2.addTestDescriptor(test2);

    testGetSKU(1, sku1);
    testGetSKU(2, sku2);

    function testGetSKU(skuID, expectedResult) {
        test('Get SKU by id', async () => {
            let result = await wh.getSKU(skuID);
            compareSKU(result, expectedResult);
        })
    }
});


describe("Test modify SKU", () => {
    const sku1 = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
    const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");
    const pos = new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, 2);

    describe('Test modify', () => {
        beforeAll(() => {
            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValueOnce(sku1).mockReturnValue(sku2);
    
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockReturnValue(pos);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);

            skuDAO.updateSKU.mockReset();
            skuDAO.updateSKU.mockReturnValue(1);
        });

        let expectedResult = 1;
        test('Modify SKU without position', async () => {
            let result = await wh.modifySKU(1, "description", 300, 400, "notes 1", 100.99, 50);
            expect(result).toBe(expectedResult);
            expect(positionDAO.updatePosition).not.toHaveBeenCalled();
        })

        test('Modify SKU with Position', async () => {
            const occupiedWeight = 500;
            const occupiedVolume = 750;
            let res = await wh.modifySKU(2, "description", 10, 15, "notes 1", 100.99, 50);
            expect(positionDAO.updatePosition).toHaveBeenCalledWith("123456789900", "123456789900", "1234", "5678", "9900", 1000, 1200, occupiedWeight, occupiedVolume, 2);
        });
    });

    describe("Test Errors", () => {
        beforeAll(() => {
            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockRejectedValueOnce({err: 404, msg: "SKU not found"}).mockReturnValue(sku2);
    
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockReturnValue(pos);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);

            skuDAO.updateSKU.mockReset();
            skuDAO.updateSKU.mockReturnValue(1);
        });    

        testModifySKUError("throw error on SKU not found", 5, "description", 300, 400, "notes", 100.99, 50, {err: 404, msg: "SKU not found"});
        testModifySKUError("throw error on negative weight", 2, "description", -10, 10, "notes", 10.99, 10, {err: 422, msg:  "Invalid data"});
        testModifySKUError("throw error on negative volume", 2, "description", 10, -10, "notes", 10.99, 10, {err: 422, msg:  "Invalid data"});
        testModifySKUError("throw error on negative price", 2, "description", 10, 10, "notes", -10.99, 10, {err: 422, msg:  "Invalid data"});
        testModifySKUError("throw error on negative quantity", 2, "description", 10, 10, "notes", 10.99, -10, {err: 422, msg:  "Invalid data"});
        testModifySKUError("throw error on maxWeight of position", 2, "description", 500, 10, "notes", 10.99, 10, {err: 422, msg:  "Position cannot store the SKU"});
        testModifySKUError("throw error on maxVolume of position", 2, "description", 10, 500, "notes", 10.99, 10, {err: 422, msg:  "Position cannot store the SKU"});
        
        function testModifySKUError(testMessage, skuID, description, weight, volume, notes, price, availableQty, expectedError){
            test(testMessage, async () => {
                async function invalidModify(){
                    await wh.modifySKU(skuID, description, weight, volume, notes, price, availableQty);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }
    });
});


describe("Test modify SKU position", () => {
    const sku1 = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 30, null);
    const sku2 = new SKU(2, "description 2", 20, 30, "notes 2", 20.99, 10, "112233445566");
    const pos1 = new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
    const pos2 = new Position("112233445566", "1122", "3344", "5566", 1500, 2000, 200, 300, 2)

    describe('Test modify SKU without position', () => {
        beforeAll(() => {
            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValueOnce(sku1);
    
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockReturnValue(pos1);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);

            skuDAO.updateSKU.mockReset();
            skuDAO.updateSKU.mockReturnValue(1);
        });

        test('Modify position of SKU', async () => {
            const occupiedWeight = 30 * 30;
            const occupiedVolume = 20 * 30;
            const skuID = 1;
            const expectedResult = 1;
            let result = await wh.modifySKUposition(skuID, "123456789900");
            expect(result).toBe(expectedResult);
            expect(positionDAO.updatePosition).toHaveBeenCalledTimes(1);
            expect(positionDAO.updatePosition).toHaveBeenCalledWith("123456789900", "123456789900", "1234", "5678", "9900", 1000, 1200, occupiedWeight, occupiedVolume, skuID);
        })
    });

    describe('Test modify SKU with position', () => {
        beforeAll(() => {
            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValue(sku2);
    
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockReturnValueOnce(pos1).mockReturnValueOnce(pos2);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);

            skuDAO.updateSKU.mockReset();
            skuDAO.updateSKU.mockReturnValue(1);
        });

        test('Modify position of SKU', async () => {
            const occupiedWeight = 200;
            const occupiedVolume = 300;
            const skuID = 2;
            let res = await wh.modifySKUposition(skuID, "123456789900");
            expect(positionDAO.updatePosition).toHaveBeenCalledTimes(2);
            expect(positionDAO.updatePosition).toHaveBeenNthCalledWith(1, "112233445566", "112233445566", "1122", "3344", "5566", 1500, 2000, 0, 0, null);
            expect(positionDAO.updatePosition).toHaveBeenNthCalledWith(2, "123456789900", "123456789900", "1234", "5678", "9900", 1000, 1200, occupiedWeight, occupiedVolume, skuID);
        });
    });
    
});



describe("Test delete SKU", () => {
    let testList = [];
    const test1 = new TestDescriptor(1, "test 1", "procedure 1", 2);
    const test2 = new TestDescriptor(2, "test 2", "procedure 2", 2);
    testList.push(test1);
    testList.push(test2);

    const sku1 = new SKU(1, "description 1", 30, 20, "notes 1", 10.99, 40, null);
    const sku2 = new SKU(2, "description 2", 20, 50, "notes 2", 20.99, 50, "123456789900");
    const pos = new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 100, 150, 2);

    describe('Test delete', () => {
        beforeAll(() => {
            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValueOnce(sku1).mockReturnValue(sku2);
                
            restockOrderDAO.getAllRestockOrders.mockReset();
            restockOrderDAO.getAllRestockOrders.mockReturnValue([]);
    
            skuItemDAO.getAllSKUItems.mockReset();
            skuItemDAO.getAllSKUItems.mockReturnValue([]);
    
            testDescriptorDAO.getAllTestDescriptor.mockReset();
            testDescriptorDAO.getAllTestDescriptor.mockReturnValue([]);
    
            skuDAO.deleteSKU.mockReset();
            skuDAO.deleteSKU.mockReturnValue(1);
            
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockReturnValue(pos);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);
        });

        let skuID = 1;
        let expectedResult = 1;
        test('Delete SKU without position', async () => {
            let result = await wh.deleteSKU(skuID);
            expect(result).toBe(expectedResult);
            expect(positionDAO.updatePosition).not.toHaveBeenCalled();
        })

        skuID = 2;
        test('Update position after delete SKU', async () => {
            let res = await wh.deleteSKU(skuID);
            expect(positionDAO.updatePosition).toHaveBeenCalledWith("123456789900", "123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
        });
    });

    
    describe("Test Errors", () => {
        beforeAll(() => {
            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValueOnce(sku2).mockRejectedValueOnce({err: 404, msg:  "SKU not found"});
                
            restockOrderDAO.getAllRestockOrders.mockReset();
            restockOrderDAO.getAllRestockOrders.mockReturnValue([]);
    
            skuItemDAO.getAllSKUItems.mockReset();
            skuItemDAO.getAllSKUItems.mockReturnValue([]);
    
            testDescriptorDAO.getAllTestDescriptor.mockReset();
            testDescriptorDAO.getAllTestDescriptor.mockReturnValue(testList);
    
            skuDAO.deleteSKU.mockReset();
            skuDAO.deleteSKU.mockReturnValue(1);
            
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockReturnValue(pos);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);
        });    

        testDeleteSKUError("throw error on TestDescriptor assigned to SKU", 2, {err: 422, msg:  "Cannot delete SKU"});
        testDeleteSKUError("throw error on SKU not found", 5, {err: 404, msg:  "SKU not found"});

        function testDeleteSKUError(testMessage, skuID, expectedError){
            test(testMessage, async () => {
                async function invalidDelete(){
                    await wh.deleteSKU(skuID);
                };
                await expect(invalidDelete).rejects.toEqual(expectedError);
            })
        }
    });
});


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
}