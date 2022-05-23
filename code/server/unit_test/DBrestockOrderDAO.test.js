'use strict';

const dayjs = require("dayjs");
const RestockOrderDAO = require('../Database/RestockOrderDAO');
const { RestockOrder, TransportNote, Product } = require('../Model/RestockOrder');

const restockOrderDAO = new RestockOrderDAO();

describe('Test Create and Get RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
    });

    test('delete table RestockOrder', async () => {
        let res = await restockOrderDAO.getAllRestockOrders();
        expect(res.length).toStrictEqual(0);
    });

    const expectedRestockOrder1 = new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined);
    expectedRestockOrder1.addProduct(12, "object", 20, 30);
    expectedRestockOrder1.addProduct(15, "object 2", 2, 550)
    const expectedRestockOrder2 = new RestockOrder(2, '2022/02/19', 2, "DELIVERED", new TransportNote('2022/02/20'));

    let arrayProducts = [];
    arrayProducts.push(new Product(12, "object", 20, 30));
    arrayProducts.push(new Product(15, "object 2", 2, 550));

    testCreateRestockOrder(arrayProducts, '2022/05/18', 2, "ISSUED", undefined,  1);
    testGetRestockOrder(1, expectedRestockOrder1);

    testCreateRestockOrder([], '2022/02/19', 2, "DELIVERED", new TransportNote('2022/02/20'), 2);
    testGetRestockOrder(2, expectedRestockOrder2);


});


describe('Test throw err on get RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
        await restockOrderDAO.newRestockOrder([], "ISSUED", 2, '2022/05/18', undefined);
    });
    testGetRestockOrdererror(3, { err: 404, msg: "RestockOrder not found" });
});


describe('Test Get All RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
        await restockOrderDAO.newRestockOrder([], "ISSUED", 2, '2022/05/18', undefined);
        await restockOrderDAO.newRestockOrder([], "DELIVERED", 2, '2022/02/18', new TransportNote('2022/02/20'));
        await restockOrderDAO.newRestockOrder([], "COMPLETED", 2, '2022/03/19', new TransportNote('2022/04/20'));
    });

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList.push(new RestockOrder(2, '2022/02/18', 2, "DELIVERED", new TransportNote('2022/02/20')));
    restockOrderList.push(new RestockOrder(3, '2022/03/19', 2, "COMPLETED", new TransportNote('2022/04/20')));
    testGetAllRestockOrder(restockOrderList);
});


describe('Test Update RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
        await restockOrderDAO.newRestockOrder([], "ISSUED", 2, '2022/05/18', undefined);
    });
    const expectedRestockOrder = new RestockOrder(1, '2022/05/18', 2, "DELIVERED", new TransportNote('2022/02/20'));
    const expectedChanges = true;
    testUpdateRestockOrder(1, "DELIVERED", new TransportNote('2022/02/20'), expectedChanges);
    testGetRestockOrder(1, expectedRestockOrder);
});


describe('Test Delete RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
        await restockOrderDAO.newRestockOrder([], "ISSUED", 2, '2022/05/18', undefined);
        await restockOrderDAO.newRestockOrder([], "DELIVERED", 2, '2022/02/18', new TransportNote('2022/02/20'));
        await restockOrderDAO.newRestockOrder([], "COMPLETED", 2, '2022/03/19', new TransportNote('2022/04/20'));
    });

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList.push(new RestockOrder(3, '2022/03/19', 2, "COMPLETED", new TransportNote('2022/04/20')));
    let expectedChanges = 1;
    testDeleteRestockOrder(2, expectedChanges);
    testGetAllRestockOrder(restockOrderList);
});

function testCreateRestockOrder(products, issueDate, supplierID, state,  transportNote, expectedID) {
    test('create new RestockOrder', async () => {
        let res = await restockOrderDAO.newRestockOrder(products, state, supplierID, issueDate, transportNote);
        expect(res.lastID).toStrictEqual(expectedID);
    });
}

function testGetRestockOrder(restockOrderID, expectedrestockOrder) {
    test('get RestockOrder', async () => {
        let res = await restockOrderDAO.getRestockOrder(restockOrderID);
        compareRestockOrder(res, expectedrestockOrder);
    });
}

function testGetRestockOrdererror(restockOrderID, expectedError) {
    test('throw on get RestockOrder', async () => {
        async function getNonExistentRestockOrder() {
            await restockOrderDAO.getRestockOrder(restockOrderID);
        };
        await expect(getNonExistentRestockOrder).rejects.toEqual(expectedError);
    });
}

function testGetAllRestockOrder(expectedList) {
    test('get All RestockOrder', async () => {
        let res = await restockOrderDAO.getAllRestockOrders();
        expect(res.length).toStrictEqual(expectedList.length);
        for (const i in res) {
            compareRestockOrder(res[i], expectedList[i]);
        }
    });
}


function testUpdateRestockOrder(restockOrderID, newState, transportNote, expectedChanges) {
    test('update RestockOrder', async () => {
        let res = await restockOrderDAO.updateRestockOrder(restockOrderID, newState, transportNote);
        expect(res).toStrictEqual(expectedChanges);
    });
}


function testDeleteRestockOrder(restockOrderID, expectedChanges) {
    test('delete RestockOrder', async () => {
        let res = await restockOrderDAO.deleteRestockOrder(restockOrderID);
        expect(res).toStrictEqual(expectedChanges);
    });
}


function compareRestockOrder(restockOrder, expectedRestockOrder) {
    expect(restockOrder.getID()).toStrictEqual(expectedRestockOrder.getID());
    expect(restockOrder.getIssueDate()).toStrictEqual(expectedRestockOrder.getIssueDate());
    compareProducts(restockOrder.getProducts(), expectedRestockOrder.getProducts());
    expect(restockOrder.getState()).toStrictEqual(expectedRestockOrder.getState());
    expect(restockOrder.getTransportNote()).toStrictEqual(expectedRestockOrder.getTransportNote());
    expect(restockOrder.getSKUItems()).toStrictEqual(expectedRestockOrder.getSKUItems());
    expect(restockOrder.getSupplier()).toStrictEqual(expectedRestockOrder.getSupplier());
};


function compareProducts(productList, expectedProductList) {
    expect(productList.length).toStrictEqual(expectedProductList.length);
    for (var i = 0; i < productList.length; i++) {
        expect(productList[i].SKUId).toStrictEqual(expectedProductList[i].SKUId);
        expect(productList[i].description).toStrictEqual(expectedProductList[i].description);
        expect(productList[i].price).toStrictEqual(expectedProductList[i].price);
        expect(productList[i].qty).toStrictEqual(expectedProductList[i].qty);
    }
}
