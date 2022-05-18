'use strict';

const PositionDAO = require('../Database/PositionDAO');
const Position = require('../Model/Position');

const positionDAO = new PositionDAO();

describe('Test Create and Get Position', () => {
    beforeAll(async () => {
        await positionDAO.resetTable();
    });

    test('delete table Position', async () => {
        let res = await positionDAO.getAllPosition();
        expect(res.length).toStrictEqual(0);
    });
    
    const expectedPosition1 = new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
    const expectedPosition2 = new Position("112233445566", "1122", "3344", "5566", 1500, 1500, 0, 0, 2);

    let expectedID = "123456789900";
    testCreatePosition("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null, expectedID);
    testGetPosition("123456789900", expectedPosition1);

    expectedID = "112233445566";
    testCreatePosition("112233445566", "1122", "3344", "5566", 1500, 1500, 0, 0, 2, expectedID);
    testGetPosition("112233445566", expectedPosition2);
});


describe('Test throw err on get Position', () => {
    beforeAll(async () => {
        await positionDAO.resetTable();
        await positionDAO.newPosition("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
    });

    testGetPositionError("1234", "404");
});


describe('Test Get All Position', () => {
    beforeAll(async () => {
        await positionDAO.resetTable();
        await positionDAO.newPosition("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
        await positionDAO.newPosition("112233445566", "1122", "3344", "5566", 1500, 1500, 0, 0, 2);
        await positionDAO.newPosition("102938475656", "1029", "3847", "5656", 800, 800, 10, 10, null);
    });

    const positionList = [];
    positionList.push(new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null));
    positionList.push(new Position("112233445566", "1122", "3344", "5566", 1500, 1500, 0, 0, 2));
    positionList.push(new Position("102938475656", "1029", "3847", "5656", 800, 800, 10, 10, null));

    testGetAllPosition(positionList);
});


describe('Test Update Position', () => {
    beforeAll(async () => {
        await positionDAO.resetTable();;
        await positionDAO.newPosition("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
    });
    
    const expectedPosition = new Position("098765432211", "0987", "6543", "2211", 1200, 1200, 0, 0, null);
    const expectedChanges = 1;
    testUpdatePosition("123456789900", "098765432211", "0987", "6543", "2211", 1200, 1200, 0, 0, null, expectedChanges);
    testGetPosition("098765432211", expectedPosition);

});


describe('Test Delete Position', () => {
    beforeAll(async () => {
        await positionDAO.resetTable();
        await positionDAO.newPosition("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null);
        await positionDAO.newPosition("112233445566", "1122", "3344", "5566", 1500, 1500, 0, 0, 2);
        await positionDAO.newPosition("102938475656", "1029", "3847", "5656", 800, 800, 10, 10, null);
    });

    const positionList = [];
    positionList.push(new Position("123456789900", "1234", "5678", "9900", 1000, 1200, 0, 0, null));
    positionList.push(new Position("102938475656", "1029", "3847", "5656", 800, 800, 10, 10, null));
    let expectedChanges = 1;
    testDeletePosition("112233445566", expectedChanges);
    testGetAllPosition(positionList);
});



function testCreatePosition(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid, expectedID) {
    test('create new Position', async () => {
        let id = await positionDAO.newPosition(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid);
        expect(id).toStrictEqual(expectedID);
    });
}

function testGetPosition(positionID, expectedPosition) {
    test('get Position', async () => {
        let res = await positionDAO.getPosition(positionID);
        comparePosition(res, expectedPosition);
    });
}

function testGetPositionError(positionID, expectedError){
    test('throw 404 on get Position', async () => {
        async function getNonExistentPosition(){
            await positionDAO.getPosition(positionDAO); 
        };
        await expect(getNonExistentPosition).rejects.toThrowError(expectedError);
    });
}

function testGetAllPosition(expectedList) {
    test('get All Position', async () => {
        let res = await positionDAO.getAllPosition();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            comparePosition(res[i], expectedList[i]);
        }
    });
}


function testUpdatePosition(oldPositionID, newPositionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, skuID, expectedChanges) {
    test('update Position', async () => {
        let res = await positionDAO.updatePosition(oldPositionID, newPositionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, skuID)
        expect(res).toStrictEqual(expectedChanges);
    });
}


function testDeletePosition(positionID, expectedChanges) {
    test('delete Position', async () => {
        let res = await skuDAO.deleteSKU(skuID);
        expect(res).toStrictEqual(expectedChanges);
    });
}


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
;