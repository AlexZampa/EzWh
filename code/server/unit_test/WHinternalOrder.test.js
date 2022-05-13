"use strict";

const Warehouse = require("../Model/Warehouse");

describe("Add internal order test", () => {

    let id = 0;

    const wh = new Warehouse();
    wh.initTest(); //sets all DAO to the corresponding mock db

    beforeEach(() => {
        wh.internalOrderDAO.newInternalOrder.mockReset();
        wh.internalOrderDAO.newInternalOrder.mockReturnValue(id);
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

    const wh = new Warehouse();
    wh.initTest(); //sets all DAO to the corresponding mock db

    beforeEach(() => {
        wh.internalOrderDAO.getAllInternalOrders.mockReset();
        wh.internalOrderDAO.getAllInternalOrders.mockReturnValue(list);
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

    const wh = new Warehouse();
    wh.initTest(); //sets all DAO to the corresponding mock db

    beforeEach(() => {
        wh.internalOrderDAO.getAllIssued.mockReset();
        wh.internalOrderDAO.getAllIssued.mockReturnValue(list);
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

    const wh = new Warehouse();
    wh.initTest(); //sets all DAO to the corresponding mock db

    beforeEach(() => {
        wh.internalOrderDAO.getAllAccepted.mockReset();
        wh.internalOrderDAO.getAllAccepted.mockReturnValue(list);
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

    const wh = new Warehouse();
    wh.initTest(); //sets all DAO to the corresponding mock db

    beforeEach(() => {
        wh.internalOrderDAO.getInternalOrder.mockReset();
        wh.internalOrderDAO.getInternalOrder.mockReturnValue(internalOrder);
    });

    testGetInternalOrder(1, internalOrder);

    function testGetInternalOrder(id, expectedResult) {
        test('Get one Internal Order by id', async () => {
            let result = await wh.getInternalOrder(id);
            expect(result).toBe(expectedResult);
        })
    }
});

describe("Delete internal order test", () => {
    const wh = new Warehouse();
    wh.initTest(); //sets all DAO to the corresponding mock db

    beforeEach(() => {
        wh.internalOrderDAO.deleteInternalOrder.mockReset();
        wh.internalOrderDAO.deleteInternalOrder.mockReturnValue(0);
    });

    testDeleteInternalOrder(1, 0);

    function testDeleteInternalOrder(id, expectedResult) {
        test('Delete one Internal Order by id', async () => {
            let result = await wh.deleteInternalOrder(id);
            expect(result).toBe(expectedResult);
        })
    }
});




