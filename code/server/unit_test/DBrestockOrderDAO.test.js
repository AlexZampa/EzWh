'use strict';

const dayjs = require("dayjs");
const RestockOrderDAO = require('../Database/RestockOrderDAO');
const { RestockOrder } = require('../Model/RestockOrder');

const restockOrderDAO = new RestockOrderDAO();

describe('Test Create and Get RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
    });

    afterAll(async () => {
        await restockOrderDAO.resetTable();
    });

    test('delete table RestockOrder', async () => {
        let res = await restockOrderDAO.getAllRestockOrders();
        expect(res.length).toStrictEqual(0);
    });

    const expectedRestockOrder1 = new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined);
    expectedRestockOrder1.addProduct(12, "object", 20, 30);
    expectedRestockOrder1.addProduct(15, "object 2", 2, 550)
    const expectedRestockOrder2 = new RestockOrder(2, '2022/02/19', 2, "DELIVERED", '2022/02/20');

    let arrayProducts = [];
    arrayProducts.push({SKUId: 12, description: "object", price: 20, qty: 30});
    arrayProducts.push({SKUId: 15, description: "object 2", price: 2, qty: 550});

    testCreateRestockOrder(arrayProducts, '2022/05/18', 2, "ISSUED", null,  1);
    testGetRestockOrder(1, expectedRestockOrder1);

    testCreateRestockOrder([], '2022/02/19', 2, "DELIVERED", '2022/02/20', 2);
    testGetRestockOrder(2, expectedRestockOrder2);
});


describe('Test throw err on get RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
        await restockOrderDAO.newRestockOrder([], "ISSUED", 2, '2022/05/18', null);
    });

    afterAll(async () => {
        await restockOrderDAO.resetTable();
    });

    testGetRestockOrdererror(3, { err: 404, msg: "RestockOrder not found" });
});


describe('Test Get All RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
        await restockOrderDAO.newRestockOrder([], "ISSUED", 2, '2022/05/18', null);
        await restockOrderDAO.newRestockOrder([], "DELIVERED", 2, '2022/02/18','2022/02/20');
        await restockOrderDAO.newRestockOrder([], "COMPLETED", 2, '2022/03/19', '2022/04/20');
    });

    afterAll(async () => {
        await restockOrderDAO.resetTable();
    });

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList.push(new RestockOrder(2, '2022/02/18', 2, "DELIVERED", '2022/02/20'));
    restockOrderList.push(new RestockOrder(3, '2022/03/19', 2, "COMPLETED", '2022/04/20'));
    testGetAllRestockOrder(restockOrderList);
});

describe('Test Loop Coverage Restock Order', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
    });

    afterAll(async () => {
        await restockOrderDAO.resetTable();
    });

    const restockOrderList0 = [];
    const restockOrderList1 = [];
    restockOrderList1.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    const restockOrderList2 = [];
    restockOrderList2.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList2.push(new RestockOrder(2, '2022/02/18', 2, "DELIVERED", '2022/02/20'));
    const restockOrderList3 = [];
    restockOrderList3.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList3.push(new RestockOrder(2, '2022/02/18', 2, "DELIVERED", '2022/02/20'));
    restockOrderList3.push(new RestockOrder(3, '2022/03/19', 2, "COMPLETED", '2022/04/20'));
    

    testGetAllRestockOrder(restockOrderList0);
    testCreateRestockOrder([], '2022/05/18', 2, "ISSUED", null, 1);
    testGetAllRestockOrder(restockOrderList1);
    testCreateRestockOrder([], '2022/02/18', 2, "DELIVERED", '2022/02/20', 2);
    testGetAllRestockOrder(restockOrderList2);
    testCreateRestockOrder([], '2022/03/19', 2, "COMPLETED", '2022/04/20', 3);
    testGetAllRestockOrder(restockOrderList3);

});


describe('Test Update RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
        await restockOrderDAO.newRestockOrder([], "ISSUED", 2, '2022/05/18', null);
    });

    afterAll(async () => {
        await restockOrderDAO.resetTable();
    });

    const expectedRestockOrder = new RestockOrder(1, '2022/05/18', 2, "DELIVERED", '2022/02/20');
    const expectedChanges = true;
    testUpdateRestockOrder(1, "DELIVERED", '2022/02/20', expectedChanges);
    testGetRestockOrder(1, expectedRestockOrder);
});


describe('Test Delete RestockOrder', () => {
    beforeAll(async () => {
        await restockOrderDAO.resetTable();
        await restockOrderDAO.newRestockOrder([], "ISSUED", 2, '2022/05/18', null);
        await restockOrderDAO.newRestockOrder([], "DELIVERED", 2, '2022/02/18', '2022/02/20');
        await restockOrderDAO.newRestockOrder([], "COMPLETED", 2, '2022/03/19', '2022/04/20');
    });

    afterAll(async () => {
        await restockOrderDAO.resetTable();
    });

    const restockOrderList = [];
    restockOrderList.push(new RestockOrder(1, '2022/05/18', 2, "ISSUED", undefined));
    restockOrderList.push(new RestockOrder(3, '2022/03/19', 2, "COMPLETED", '2022/04/20'));
    let expectedChanges = 1;
    testDeleteRestockOrder(2, expectedChanges);
    testGetAllRestockOrder(restockOrderList);
});

function testCreateRestockOrder(products, issueDate, supplierID, state,  transportNote, expectedID) {
    test('create new RestockOrder', async () => {
        let res = await restockOrderDAO.newRestockOrder(products, state, supplierID, issueDate, transportNote);
        expect(res).toStrictEqual(expectedID);
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
