'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test Return Order apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/test/returnOrders');
        //await prepareEnvironment();
    })

    const products = [
        { SKUId: 12, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" },
        { SKUId: 180, description: "another product", price: 11.99, RFID: "12345678901234567890123456789038" }
    ];

    newReturnOrder("New returnOrder OK", 201, "2021/11/29 09:33", products, 1);
    newReturnOrder("New returnOrder wrong date", 422, "2021/25/29 09:33", products, 1);
    newReturnOrder("New returnOrder wrong restockOrderId", 422, "2021/11/29 09:33", products, -1);

    getReturnOrders("Get all returnOrders", 200);

    getReturnOrder("Get a single returnOrder 1", 200, 1);
    getReturnOrder("Get a single returnOrder 2", 422, -1);
    getReturnOrder("Get a single returnOrder 3", 404, 5);

    deleteReturnOrder("Delete returnOrder 1", 204, 1);
    deleteReturnOrder("Delete returnOrder 2", 404, 10);
    deleteReturnOrder("Delete returnOrder 3", 422, "ciao");

    
















})

function newReturnOrder(testName, expectedHTTPStatus, returnDate, products, restockOrderId) {
    it(testName, function (done) {

        let returnOrder = {
            returnDate: returnDate,
            products: products,
            restockOrderId: restockOrderId
        }

        //const restockOrder = agent.get("api/restockOrders/" + 1);
        //console.log(restockOrder.body);

        if (returnDate === undefined && products === undefined && restockOrderId === undefined) {
            agent.post('/api/returnOrder')              //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/returnOrder')
                .send(returnOrder)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();

                });
        }
    }
    )
}

function getReturnOrders(testName, expectedHTTPStatus) {
    it(testName, function (done) {

        const products = [{SKUId:12,description:"a product",price:10.99,RFID:"12345678901234567890123456789016"},
        {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}]

        const ro1 = {returnDate:"2021/11/29 09:33", products:products, restockOrderId:1};

        const expectedResult = [
            {
                "id":1,
                "returnDate":"2021/11/29 09:33",
                "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                            {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
                "restockOrderId" : 1
            },
            {
                "id":2,
                "returnDate":"2021/11/29 09:33",
                "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                            {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
                "restockOrderId" : 1
            }
        ]
    
    
        agent.post('/api/returnOrder')
            .send(ro1)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/returnOrder')
                .send(ro1)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.get('/api/returnOrders')
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

function getReturnOrder(testName, expectedHTTPStatus, id) {
    it(testName, function (done) {

        const products = [{SKUId:12,description:"a product",price:10.99,RFID:"12345678901234567890123456789016"},
        {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}]

        const ro = {returnDate:"2021/11/29 09:33", products:products, restockOrderId:1};
        const expectedResult = {
            "id":1,
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            "restockOrderId" : 1
        };

        agent.post('/api/returnOrder')
        .send(ro)
        .then(function (res) {
            res.should.have.status(201);
            agent.get('/api/returnOrders/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus == 200)
                    res.body.should.be.deep.equal(expectedResult);
                done();
            });
        });
    });
}

function deleteReturnOrder(testName, expectedHTTPStatus, id) {
    it(testName, function (done) {

        const products = [{SKUId:12,description:"a product",price:10.99,RFID:"12345678901234567890123456789016"},
        {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}]

        const ro = {returnDate:"2021/11/29 09:33", products:products, restockOrderId:1};

        agent.post('/api/returnOrder')
        .send(ro)
        .then(function (res) {
            res.should.have.status(201);
            agent.delete('/api/returnOrder/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    });
}

async function prepareEnvironment() {

    await agent.delete('/api/test/users');
    await agent.delete('/api/test/restockOrders');
    await agent.delete('/api/test/skuitems');
    await agent.delete('/api/test/skus');
    await agent.delete('/api/test/skuitems/testResults');
    await agent.delete('/api/test/testDescriptors');

    let restockProducts = [{ SKUId: 1, description: "A product", price: 20, qty: 30 }];

    const skuItem = { RFID: "1", SKUId: 1, DateOfStock: "2022/01/01" };
    const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
    const restockOrder = { issueDate: "2022/03/03", products: restockProducts, supplierId: 1 };
    let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }

    await agent.post('/api/newUser').send(user);
    await agent.post('/api/sku').send(sku);
    await agent.post('/api/skuitem').send(skuItem);
    await agent.post('/api/restockOrder').send(restockOrder);
}