'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test Internal Order apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/test/internalOrders');
    })

    const products = [
        {SKUId:2, description: "abc", price:2.99, qty:10},
        {SKUId:1, description: "def", price:3.99, qty:11},
        {SKUId:37, description: "ghi", price:99.99, qty:7},
    ];

    const wrongProducts = [
        {SkuId:2, description: "abc", price:2.99, qty:10},
        {SKUId:1, price:3.99, qty:11},
        {SKUId:37.45, description: "ghi", price:99.99, qty:7},
    ];

    const deliveredProducts = [
        {SkuID:1, RFID:"12345678901234567890123456789016"},
        {SkuID:1, RFID:"12345678901234567890123456789038"}
    ];

    newInternalOrder("Adding a new InternalOrder 1", 201, "2022/05/24 09:51", products, 1);
    newInternalOrder("Adding a new InternalOrder 2", 422, "2022/05/24 09:51", products, -1);
    newInternalOrder("Adding a new InternalOrder 3", 422, "2022/05/24 09:51", undefined, 1);
    newInternalOrder("Adding a new InternalOrder 4", 422, "2022-05-24 09:51", products, 1);
    newInternalOrder("Adding a new InternalOrder 5", 422, "2022/05/24 09:51", wrongProducts, 1);
    newInternalOrder("Adding a new InternalOrder 6", 422);

    getInternalOrders("Get all InternalOrders", 200); //InternalOrder products are returned ordered by SKUId

    getInternalOrder("Get single InternalOrder 1", 200, 1);
    getInternalOrder("Get single InternalOrder 2", 404, 2);
    getInternalOrder("Get single InternalOrder 3", 422, 0);
    getInternalOrder("Get single InternalOrder 4", 422, -2);
    getInternalOrder("Get single InternalOrder 5", 422, "id");

    modifyInternalOrderStatus("Modify InternalOrderStatus to 'ACCEPTED'", 200, 1, "ACCEPTED");
    modifyInternalOrderStatus("Modify InternalOrderStatus to 'COMPLETED'", 200, 1, "COMPLETED", deliveredProducts);
    modifyInternalOrderStatus("Modify non existing InternalOrder Status", 404, 2, "ACCEPTED");
    modifyInternalOrderStatus("Modify InternalOrder with wrongStatus", 422, 1, "RANDOM_STRING");

    deleteInternalOrder("Delete internal order", 204, 1);
    deleteInternalOrder("Delete non existing internal order", 422, 2);
    deleteInternalOrder("Delete impossible internal order", 422, -2);
});

function newInternalOrder(testName, expectedHTTPStatus, issueDate, products, customerId) {
    it(testName, function (done) {
        let internalOrder = {
            issueDate: issueDate,
            products: products,
            customerId : customerId
        }

        if (issueDate === undefined && products === undefined && customerId === undefined) {
            agent.post('/api/internalOrders')              //we are not sending any data
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        } else {
            agent.post('/api/internalOrders')
            .send(internalOrder)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}

function getInternalOrders(testName, expectedHTTPStatus) {
    it(testName, function (done) {

        const products1 = [
            {SKUId:5, description: "def", price:3.99, qty:11},
            {SKUId:2, description: "abc", price:2.99, qty:10},
            {SKUId:37, description: "ghi", price:99.99, qty:7}
        ];

        const products2 = [
            {SKUId:3, description: "jkl", price:2.99, qty:10},
            {SKUId:4, description: "mno", price:3.99, qty:11},
            {SKUId:14, description: "pqr", price:99.99, qty:7}
        ];

        const io1 = {issueDate:"2021/11/29 09:33", products:products1, customerId:1};
        const io2 = {issueDate:"2021/11/30 19:33", products:products2, customerId:1};
        
        let expectedResult = [
            {
                "id":1,
                "issueDate":"2021/11/29 09:33",
                "state": "ISSUED",
                "products": [
                    {"SKUId":2, "description":"abc", "price":2.99, "qty":10},
                    {"SKUId":5, "description":"def", "price":3.99, "qty":11},
                    {"SKUId":37, "description":"ghi", "price":99.99, "qty":7}
                ],
                "customerId" : 1
            },
            {
                "id":2,
                "issueDate":"2021/11/30 19:33",
                "state": "ISSUED",
                "products": [
                    {"SKUId":3, "description":"jkl", "price":2.99, "qty":10},
                    {"SKUId":4, "description":"mno", "price":3.99, "qty":11},
                    {"SKUId":14, "description":"pqr", "price":99.99, "qty":7}
                ],
                "customerId" : 1
            },
        ]
    
        agent.post('/api/internalOrders')
            .send(io1)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/internalOrders')
                .send(io2)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/internalOrders')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.should.be.an('array');
                        r.body.should.be.deep.equal(expectedResult);
                        done();
                    });
                });
            });
    });   
}

function getInternalOrder(testName, expectedHTTPStatus, id) {
    it(testName, function (done) {
        const io = {
            issueDate:"2021/11/29 09:33",
            products: [
                {SKUId:12, description:"a product", price:10.99, qty:3},
                {SKUId:180, description:"another product", price:11.99, qty:3}
            ],
            "customerId" : 1
        };
        const expectedResult = {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ISSUED",
            "products": [
                {"SKUId":12,"description":"a product","price":10.99,"qty":3},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}
            ],
            "customerId" : 1
        };

        agent.post('/api/internalOrders')
        .send(io)
        .then(function (res) {
            res.should.have.status(201);
            agent.get('/api/internalOrders/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus == 200)
                    res.body.should.be.deep.equal(expectedResult);
                done();
            });
        });
    });
}

function modifyInternalOrderStatus(testName, expectedHTTPStatus, id, newState, products) {
    it(testName, function (done) {
        const io = {
            issueDate:"2021/11/29 09:33",
            products: [
                {SKUId:12, description:"a product", price:10.99, qty:3},
                {SKUId:180, description:"another product", price:11.99, qty:3}
            ],
            "customerId" : 1
        };
        let body = undefined;
        if(products) {
            body = {newState:newState, products:products};
        } else {
            body = {newState:newState};
        }
        agent.post('/api/internalOrders')
        .send(io)
        .then(function (res) {
            res.should.have.status(201);
            agent.put('/api/internalOrders/' + id)
            .send(body)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            });
        });
    });
}

function deleteInternalOrder(testName, expectedHTTPStatus, id) {
    it(testName, function (done) {
        const io = {
            issueDate:"2021/11/29 09:33",
            products: [
                {SKUId:1, description:"a product", price:10.99, qty:3},
                {SKUId:180, description:"another product", price:11.99, qty:3}
            ],
            "customerId" : 1
        };
        agent.post('/api/internalOrders')
        .send(io)
        .then(function (res) {
            res.should.have.status(201);
            agent.delete('/api/internalOrders/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    });
}