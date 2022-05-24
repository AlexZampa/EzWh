"use strict";

const Warehouse = require("../Model/Warehouse");
const internalOrderDAO = require('../Mock_databases/Mock_internalOrderDAO');

const wh = new Warehouse(undefined, undefined, undefined, undefined, undefined, undefined, internalOrderDAO);

describe("Add internal order test", () => {

    let id = 0;

    beforeEach(() => {
        internalOrderDAO.newInternalOrder.mockReset();
        internalOrderDAO.newInternalOrder.mockReturnValue(id);
        id++;
    });

    let products = [
        { SKUId: 12, description: "a product", price: 10.99, qty: 3 },
        { SKUId: 180, description: "another product", price: 11.99, qty: 3 }
    ];

    testAddInternalOrder("2021/11/29 09:33", products, 1, 0);
    testAddInternalOrder("2021/11/30 03:33", products, 1, 1);

    function testAddInternalOrder(issueDate, products, customerId, expectedResult) {
        test('Add Internal Order', async () => {
            let result = await wh.addInternalOrder(products, customerId, issueDate);
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Get all internal orders test", () => {

    let list = [
        {
            id: 1,
            issueDate: "2021/11/29 09:33",
            state: "ACCEPTED",
            products: [
                {
                    SKUId: 12,
                    description: "a product",
                    price: 10.99,
                    qty: 3
                },
                {
                    SKUId: 180,
                    description: "another product",
                    price: 11.99,
                    qty: 3
                }
            ],
            customerId: 1
        },
        {
            id: 2,
            issueDate: "2021/11/29 09:33",
            state: "ISSUED",
            products: [
                {
                    SKUId: 12,
                    description: "a product",
                    price: 10.99,
                    qty: 3
                },
                {
                    SKUId: 180,
                    description: "another product",
                    price: 11.99,
                    qty: 3
                }
            ],
            customerId: 2
        }
    ]

    beforeEach(() => {
        internalOrderDAO.getAllInternalOrders.mockReset();
        internalOrderDAO.getAllInternalOrders.mockReturnValue(list);
    });

    testGetAllInternalOrders(list);

    function testGetAllInternalOrders(expectedResult) {
        test('Get all Internal Orders', async () => {
            let result = await wh.getInternalOrders();
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Get all issued internal orders test", () => {

    let list = [
        {
            id: 1,
            issueDate: "2021/11/29 09:33",
            state: "ISSUED",
            products: [
                {
                    SKUId: 12,
                    description: "a product",
                    price: 10.99,
                    qty: 3
                },
                {
                    SKUId: 180,
                    description: "another product",
                    price: 11.99,
                    qty: 3
                }
            ],
            customerId: 1
        },
        {
            id: 2,
            issueDate: "2021/11/29 09:33",
            state: "ISSUED",
            products: [
                {
                    SKUId: 12,
                    description: "a product",
                    price: 10.99,
                    qty: 3
                },
                {
                    SKUId: 180,
                    description: "another product",
                    price: 11.99,
                    qty: 3
                }
            ],
            customerId: 2
        }
    ]

    beforeEach(() => {
        internalOrderDAO.getAllIssued.mockReset();
        internalOrderDAO.getAllIssued.mockReturnValue(list);
    });

    testGetAllIssuedInternalOrders(list);

    function testGetAllIssuedInternalOrders(expectedResult) {
        test('Get all issued Internal Orders', async () => {
            let result = await wh.getInternalOrderIssued();
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Get all accepted internal orders test", () => {

    let list = [
        {
            id: 1,
            issueDate: "2021/11/29 09:33",
            state: "ACCEPTED",
            products: [
                {
                    SKUId: 12,
                    description: "a product",
                    price: 10.99,
                    qty: 3
                },
                {
                    SKUId: 180,
                    description: "another product",
                    price: 11.99,
                    qty: 3
                }
            ],
            customerId: 1
        },
        {
            id: 2,
            issueDate: "2021/11/29 09:33",
            state: "ACCEPTED",
            products: [
                {
                    SKUId: 12,
                    description: "a product",
                    price: 10.99,
                    qty: 3
                },
                {
                    SKUId: 180,
                    description: "another product",
                    price: 11.99,
                    qty: 3
                }
            ],
            customerId: 2
        }
    ]

    beforeEach(() => {
        internalOrderDAO.getAllAccepted.mockReset();
        internalOrderDAO.getAllAccepted.mockReturnValue(list);
    });

    testGetAllAcceptedInternalOrders(list);

    function testGetAllAcceptedInternalOrders(expectedResult) {
        test('Get all accepted Internal Orders', async () => {
            let result = await wh.getAcceptedInternalOrders();
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Get internal order test", () => {

    let internalOrder =
    {
        id: 1,
        issueDate: "2021/11/29 09:33",
        state: "ACCEPTED",
        products: [
            {
                SKUId: 12,
                description: "a product",
                price: 10.99,
                qty: 3
            },
            {
                SKUId: 180,
                description: "another product",
                price: 11.99,
                qty: 3
            }
        ],
        customerId: 1
    }

    beforeEach(() => {
        internalOrderDAO.getInternalOrder.mockReset();
        internalOrderDAO.getInternalOrder.mockReturnValue(internalOrder);
    });

    testGetInternalOrder(1, internalOrder);

    function testGetInternalOrder(id, expectedResult) {
        test('Get one Internal Order by id', async () => {
            let result = await wh.getInternalOrder(id);
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Update Internal Order status test", () => {

    const deliveredProducts = [
        {SKUId:12, description:"a product", price:10.99, RFID:"12345678901234567890123456789016"},
        {SKUId:180, description:"another product", price:11.99, RFID:"12345678901234567890123456789038"}
    ];

    beforeEach(() => {
        internalOrderDAO.addDeliveredProducts.mockReset();
        internalOrderDAO.setStatus.mockReset();
        internalOrderDAO.addDeliveredProducts.mockReturnValue(undefined);
        internalOrderDAO.setStatus.mockReturnValue(undefined);
    });

    testUpdateInternalOrderStatus(1, "COMPLETED", deliveredProducts, undefined);
    testUpdateInternalOrderStatus(2, "CANCELED", undefined, undefined);

    function testUpdateInternalOrderStatus(id, status, products, expectedResult) {
        test('set Internal Order Status', async () => {
            let result = await wh.setIOStatus(id, status, products)
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Delete internal order test", () => {

    beforeEach(() => {
        internalOrderDAO.deleteInternalOrder.mockReset();
        internalOrderDAO.deleteInternalOrder.mockReturnValue(0);
    });

    testDeleteInternalOrder(1, 0);

    function testDeleteInternalOrder(id, expectedResult) {
        test('Delete one Internal Order by id', async () => {
            let result = await wh.deleteInternalOrder(id);
            expect(result).toBe(expectedResult);
        })
    }
});




