"use strict";

const Warehouse = require("../Model/Warehouse");
const Position = require('../Model/Position');
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

describe("Test add Position", () => {
    let id = 1;
    beforeEach(() => {
        positionDAO.newPosition.mockReset();
        positionDAO.newPosition.mockReturnValue(id);
        id++;
    });

    testAddPosition("123456789900", "1234", "5678", "9900", 1000, 1200, 1);
    testAddPosition("112233445566", "1122", "3344", "5566", 1500, 1500, 2);

    testAddPositionError('throw error on invalid positionID', "111122223333", "1111", "3333", "2222", 1000, 1200, {err: 422, msg: "Invalid Position data"});
    testAddPositionError('throw error on invalid positionID', "111122223333", "2222", "1111", "3333", 1000, 1200, {err: 422, msg: "Invalid Position data"});
    testAddPositionError('throw error on invalid positionID', "111122223333", "3333", "2222", "1111", 1000, 1200, {err: 422, msg: "Invalid Position data"});
    testAddPositionError('throw error on negative maxWeight', "112233445566", "1122", "3344", "5566", -1500, 1500, {err: 422, msg: "Invalid Position data"});
    testAddPositionError('throw error on negative maxVolume', "112233445566", "1122", "3344", "5566", 1500, -1500, {err: 422, msg: "Invalid Position data"});
    testAddPositionError('throw error on not numeric positionID', "abcdefghilmo", "1122", "3344", "5566", 1500, -1500, {err: 422, msg: "Invalid Position data"});
    testAddPositionError('throw error on length of positionID', "112233445566111111", "abcd", "efgh", "ilmo", 1500, 1500, {err: 422, msg: "Invalid Position data"});
    testAddPositionError('throw error on length of aisle, row and col', "111122223333", "111122", "2233", "33", 1500, 1500, {err: 422, msg: "Invalid Position data"});

    function testAddPosition(positionID, aisle, row, col, maxWeight, maxVolume, expectedResult) {
        test('Add SKU', async () => {
            let result = await wh.addPosition(positionID, aisle, row, col, maxWeight, maxVolume);
            expect(result).toBe(expectedResult);
        })
    }

    function testAddPositionError(testMessage, positionID, aisle, row, col, maxWeight, maxVolume, expectedError) {
        test(testMessage, async () => {
            async function invalidAddPosition(){
               await wh.addPosition(positionID, aisle, row, col, maxWeight, maxVolume);
            }
            await expect(invalidAddPosition).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get all Position", () => {

    let positionList = [];
    positionList.push(new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null));
    positionList.push(new Position("112233445566", "1122", "3344", "5566", 1500, 1500, 500, 100, 1));
    positionList.push(new Position("111122223333", "1111", "2222", "3333", 2000, 1500, 1000, 900, 2));
   
    beforeAll(() => {
        positionDAO.getAllPosition.mockReset();
        positionDAO.getAllPosition.mockReturnValue(positionList);
    });

    testGetAllposition(positionList);

    function testGetAllposition(expectedResult) {
        test('Get all Position', async () => {
            let result = await wh.getPositions();
            for(const i in result){
                comparePosition(result[i], expectedResult[i]);
            }
        })
    }
});



describe("Test modify Position", () => {
    const sku1 = new SKU(1, "description", 100, 90, "notes", 20.99, 10, "111122223333");
    const pos1 = new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
    const pos2 = new Position("111122223333", "1111", "2222", "3333", 2000, 1500, 1000, 900, 1);

    describe('Test modify', () => {
        beforeAll(() => {
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockReturnValueOnce(pos1).mockReturnValue(pos2);

            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValue(sku1);
    
            skuDAO.updateSKU.mockReset();
            skuDAO.updateSKU.mockReturnValue(1);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);
        });

        let expectedResult = 1;
        test('Modify Position without SKU', async () => {
            let result = await wh.modifyPosition("123456789900", "9999", "8888", "7777", 1000, 1200, 0, 0);
            expect(result).toBe(expectedResult);
            expect(skuDAO.updateSKU).not.toHaveBeenCalled();
            expect(positionDAO.updatePosition).toHaveBeenCalledWith("123456789900", "999988887777", "9999", "8888", "7777", 1000, 1200, 0, 0, null);
        })

        test('Modify Position with SKU', async () => {
            let result = await wh.modifyPosition("111122223333", "2222", "3333", "4444", 3000, 3000, 1000, 1000);
            expect(result).toBe(expectedResult);
            expect(skuDAO.updateSKU).toHaveBeenCalledWith(1, "description", 100, 90, "notes", 20.99, 10, "222233334444");
            expect(positionDAO.updatePosition).toHaveBeenCalledWith("111122223333", "222233334444", "2222", "3333", "4444", 3000, 3000, 1000, 1000, 1);
        });
    });

    describe("Test Errors", () => {
        beforeAll(() => {
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockRejectedValueOnce({err: 404, msg: "Position not found"}).mockReturnValue(pos1);

            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValue(sku1);
    
            skuDAO.updateSKU.mockReset();
            skuDAO.updateSKU.mockReturnValue(1);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);
        });    

        testModifyPositionError("throw error on Position not found", "000011119999", "1234", "5678", "9900", 1000, 1200, 0, 0, {err: 404, msg: "Position not found"});
        testModifyPositionError("throw error on negative maxWeight", "123456789900", "1234", "5678", "9900", -1000, 1200, 0, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on negative maxVolume", "123456789900", "1234", "5678", "9900", 1000, -1200, 0, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on negative occupiedWeight", "123456789900", "1234", "5678", "9900", 1000, 1200, -10, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on negative occupiedVolume", "123456789900", "1234", "5678", "9900", 1000, 1200, 0, -10, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on maxWeight less than occupiedWeight", "123456789900", "1234", "5678", "9900", 1000, 1200, 2000, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on maxVolume less than occupiedVolume", "123456789900", "1234", "5678", "9900", 1000, 1200, 0, 2000, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on not numeric aisle", "123456789900", "abcd", "5678", "9900", 1000, 1200, 0, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on not numeric row", "123456789900", "1234", "abcd", "9900", 1000, 1200, 0, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on not numeric col", "123456789900", "abcd", "5678", "abcd", 1000, 1200, 0, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on aisle length", "123456789900", "111111", "5678", "1234", 1000, 1200, 0, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on row length", "123456789900", "1111", "567888", "1234", 1000, 1200, 0, 0, {err: 422, msg: "Invalid Position data"});
        testModifyPositionError("throw error on col length", "123456789900", "1111", "5678", "123444", 1000, 1200, 0, 0, {err: 422, msg: "Invalid Position data"});
        
        function testModifyPositionError(testMessage, positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, expectedError){
            test(testMessage, async () => {
                async function invalidModify(){
                    await wh.modifyPosition(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }
    });
});


describe("Test modify positionID of Position", () => {
    const sku1 = new SKU(1, "description", 100, 90, "notes", 20.99, 10, "111122223333");
    const pos1 = new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
    const pos2 = new Position("111122223333", "1111", "2222", "3333", 2000, 1500, 1000, 900, 1);

    describe('Test modify', () => {
        beforeAll(() => {
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockReturnValueOnce(pos1).mockReturnValue(pos2);

            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValue(sku1);
    
            skuDAO.updateSKU.mockReset();
            skuDAO.updateSKU.mockReturnValue(1);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockReturnValue(1);
        });

        test('Modify Position without SKU', async () => {
            const expectedResult = 1;
            let result = await wh.modifyPositionID("123456789900", "999988887777");
            expect(result).toBe(expectedResult);
            expect(skuDAO.updateSKU).not.toHaveBeenCalled();
            expect(positionDAO.updatePosition).toHaveBeenCalledWith("123456789900", "999988887777", "9999", "8888", "7777", 1000, 1200, 0, 0, null);
        })

        test('Modify Position with SKU', async () => {
            let res = await wh.modifyPositionID("111122223333", "999988887777");
            expect(skuDAO.updateSKU).toHaveBeenCalled();
            expect(skuDAO.updateSKU).toHaveBeenCalledWith(1, "description", 100, 90, "notes", 20.99, 10, "999988887777");
            expect(positionDAO.updatePosition).toHaveBeenCalledWith("111122223333", "999988887777", "9999", "8888", "7777", 2000, 1500, 1000, 900, 1);
        });
    });

    describe('Test Errors', () => {
        beforeAll(() => {
            positionDAO.getPosition.mockReset();
            positionDAO.getPosition.mockRejectedValueOnce({err: 404, msg: "Position not found"}).mockReturnValue(pos2);

            skuDAO.getSKU.mockReset();
            skuDAO.getSKU.mockReturnValue(sku1);
    
            skuDAO.updateSKU.mockReset();
            skuDAO.updateSKU.mockReturnValue(1);
            
            positionDAO.updatePosition.mockReset();
            positionDAO.updatePosition.mockRejectedValueOnce({err: 422, msg:  "positionID not unique"});
        });

        testModifyPositionIDError("throw error on Position not found", "000099998888", "112233445566", {err: 404, msg: "Position not found"});
        testModifyPositionIDError("throw error on not numeric newPositionID", "111122223333", "abcdefghilmn", {err: 422, msg:  "Invalid Position data"});
        testModifyPositionIDError("throw error on length of newPositionID", "111122223333", "1122334455666666", {err: 422, msg:  "Invalid Position data"});
        testModifyPositionIDError('throw error on newPositionID not unique', "111122223333", "123456789900", {err: 422, msg:  "positionID not unique"});

        function testModifyPositionIDError(testMessage, oldPositionID, newPositionID, expectedError){
            test(testMessage, async () => {
                async function invalidModify(){
                    await wh.modifyPositionID(oldPositionID, newPositionID);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }
    });
    
});


describe("Test delete Position", () => {  
    const pos1 = new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
    const pos2 = new Position("111122223333", "1111", "2222", "3333", 2000, 1500, 1000, 900, 1);

    beforeAll(() => {
        positionDAO.deletePosition.mockReset();
        positionDAO.deletePosition.mockReturnValue(1);
    });

    let expectedResult = 1;
    test('Delete Position', async () => {
        let result = await wh.deletePosition("123456789900");
        expect(result).toBe(expectedResult);
    })

});


function comparePosition(position, expectedPosition){
    expect(position.getPositionID()).toStrictEqual(expectedPosition.getPositionID());
    expect(position.getAisle()).toStrictEqual(expectedPosition.getAisle());
    expect(position.getRow()).toStrictEqual(expectedPosition.getRow());
    expect(position.getCol()).toStrictEqual(expectedPosition.getCol());
    expect(position.getMaxWeight()).toStrictEqual(expectedPosition.getMaxWeight());
    expect(position.getMaxVolume()).toStrictEqual(expectedPosition.getMaxVolume());
    expect(position.getOccupiedWeight()).toStrictEqual(expectedPosition.getOccupiedWeight());
    expect(position.getOccupiedVolume()).toStrictEqual(expectedPosition.getOccupiedVolume());
    expect(position.getAssignedSKU()).toStrictEqual(expectedPosition.getAssignedSKU());
};