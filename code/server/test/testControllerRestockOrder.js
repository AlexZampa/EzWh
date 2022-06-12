'use strict';

const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test RestockOrder apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/test/users');
        await agent.delete('/api/test/restockOrders');
        await agent.delete('/api/test/skuitems');
        await agent.delete('/api/test/skus');
        await agent.delete('/api/test/skuitems/testResults');
        await agent.delete('/api/test/testDescriptors');
        await agent.delete('/api/test/items');
    })

    after(async () => {
        await agent.delete('/api/test/users');
        await agent.delete('/api/test/restockOrders');
        await agent.delete('/api/test/skuitems');
        await agent.delete('/api/test/skus');
        await agent.delete('/api/test/skuitems/testResults');
        await agent.delete('/api/test/testDescriptors');
        await agent.delete('/api/test/items');
    })

    let products = [{ SKUId: 1, itemId: 10, description: "A product", price: 20, qty: 30 }];

    newRestockOrder(201, products, 1, "2022/02/02");
    newRestockOrder(422);
    newRestockOrder(422, products, 1, "2002-12-12");

    getRestockOrders(200);
    getRestockOrdersIssued(200);

    getRestockOrder(200, 1);
    getRestockOrder(404, 3);

    getSKUItemToReturnFromRestockOrder(200, 1);
    getSKUItemToReturnFromRestockOrder(422, 2);

    addSKUItemToRestockOrder(200, 2, "12345678901234567890123456789019", 1, 10);
    addSKUItemToRestockOrder(404, 3, "1234567890123456789012345678901a", 1, 10);

    addTransportNoteToRestockOrder(200, 1, "2022/03/05");

    changeStateRestockOrder(200, 1, "DELIVERED");

    deleteRestockOrder(204, 2);
    deleteRestockOrder(422, 4);

});

function newRestockOrder(expectedHTTPStatus, products, supplierID, issueDate) {
    it('adding a new RestockOrder', function (done) {
        if (products === undefined && supplierID === undefined && issueDate === undefined) {
            agent.post('/api/restockOrder')              //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };
            const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
            const restockOrder = { issueDate: issueDate, products: products, supplierId: supplierID };
            let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
            const item = { "id": 10, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/sku')
                        .send(sku)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.post('/api/item')
                                .send(item)
                                .then(function (res) {
                                    res.should.have.status(201);
                                    agent.post('/api/skuitem')
                                        .send(skuItem)
                                        .then(function (res) {
                                            res.should.have.status(201);
                                            agent.post('/api/restockOrder')
                                                .send(restockOrder)
                                                .then(function (res) {
                                                    res.should.have.status(expectedHTTPStatus);
                                                    done();
                                                });
                                        });
                                })
                        });
                });
        }
    });
}


function getRestockOrders(expectedHTTPStatus) {
    it('getting all Restock Orders', function (done) {

        let products = [{ SKUId: 1, itemId: 10, description: "A product", price: 20, qty: 30 }];

        const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };

        const restockOrder = { issueDate: "2022/03/03", products: products, supplierId: 1 };
        const restockOrder2 = { issueDate: "2022/04/05", products: products, supplierId: 1 };

        const item = { "id": 10, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

        let expectedResult = [{
            "id": 1, "issueDate": "2022/03/03 00:00", "state": "ISSUED",
            "products": [{ "SKUId": 1, "itemId": 10, "description": "A product", "price": 20, "qty": 30 }],
            "supplierId": 1,
            "skuItems": []
        },
        {
            "id": 2, "issueDate": "2022/04/05 00:00", "state": "ISSUED",
            "products": [{ "SKUId": 1, "itemId": 10, "description": "A product", "price": 20, "qty": 30 }],
            "supplierId": 1,
            "skuItems": []
        }];

        let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/restockOrder')
                                            .send(restockOrder)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.post('/api/restockOrder')
                                                    .send(restockOrder2)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.get('/api/restockOrders')
                                                            .then(function (r) {
                                                                r.should.have.status(expectedHTTPStatus);
                                                                r.body.should.be.an('array');
                                                                r.body.should.be.deep.equal(expectedResult);
                                                                done();
                                                            });
                                                    });
                                            });
                                    });
                            })
                    });
            });
    });

}

function getRestockOrder(expectedHTTPStatus, restockOrderID) {
    it('getting Restock Order by ID', function (done) {

        let products = [{ SKUId: 1, itemId: 10, description: "A product", price: 20, qty: 30 }];

        const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };

        const restockOrder = { issueDate: "2022/03/03", products: products, supplierId: 1 };
        const restockOrder2 = { issueDate: "2022/04/05", products: products, supplierId: 1 };

        const item = { "id": 10, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

        let expectedResult = {
            "issueDate": "2022/03/03 00:00", "state": "ISSUED",
            "products": [{ "SKUId": 1, "itemId": 10, "description": "A product", "price": 20, "qty": 30 }],
            "supplierId": 1,
            "skuItems": []
        };

        let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/restockOrder')
                                            .send(restockOrder)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.post('/api/restockOrder')
                                                    .send(restockOrder2)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.get('/api/restockOrders/' + restockOrderID)
                                                            .then(function (r) {
                                                                r.should.have.status(expectedHTTPStatus);
                                                                if (expectedHTTPStatus == 200)
                                                                    r.body.should.be.deep.equal(expectedResult);
                                                                done();
                                                            });
                                                    });
                                            });
                                    });
                            })
                    });
            });
    });

}

function getRestockOrdersIssued(expectedHTTPStatus) {
    it('getting all Restock Orders Issued', function (done) {

        let products = [{ SKUId: 1, itemId: 10, description: "A product", price: 20, qty: 30 }];

        const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };

        const restockOrder = { issueDate: "2022/03/03", products: products, supplierId: 1 };
        const restockOrder2 = { issueDate: "2022/04/05", products: products, supplierId: 1 };

        const item = { "id": 10, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

        const changeState = { newState: "DELIVERY" };

        let expectedResult = [{
            "id": 1, "issueDate": "2022/03/03 00:00", "state": "ISSUED",
            "products": [{ "SKUId": 1, "itemId": 10, "description": "A product", "price": 20, "qty": 30 }],
            "supplierId": 1,
            "skuItems": []
        }];

        let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/restockOrder')
                                            .send(restockOrder)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.post('/api/restockOrder')
                                                    .send(restockOrder2)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.put('/api/restockOrder/' + 2)
                                                            .send(changeState)
                                                            .then(function (res) {
                                                                res.should.have.status(200);
                                                                agent.get('/api/restockOrdersIssued')
                                                                    .then(function (r) {
                                                                        r.should.have.status(expectedHTTPStatus);
                                                                        r.body.should.be.an('array');
                                                                        r.body.should.be.deep.equal(expectedResult);
                                                                        done();
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            })
                    });
            });
    });

}

function getSKUItemToReturnFromRestockOrder(expectedHTTPStatus, restockOrderID) {
    it('get SKUItem to return from Restock Order', function (done) {

        let products = [{ SKUId: 1, itemId: 10, description: "A product", price: 20, qty: 30 }];

        const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };

        const skuToRO = { "skuItems": [{ rfid: "12345678901234567890123456789019", itemId: 10, SKUId: 1 }] };

        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };

        const restockOrder = { issueDate: "2022/03/03", products: products, supplierId: 1 };
        const restockOrder2 = { issueDate: "2022/04/05", products: products, supplierId: 1 };

        const item = { "id": 10, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

        const changeState = { newState: "DELIVERED" };
        const changeState2 = { newState: "COMPLETEDRETURN" };

        const testDescriptor = { name: "test", procedureDescription: "Description", idSKU: 1 };

        const testResult = { rfid: "12345678901234567890123456789019", idTestDescriptor: 1, Date: "2022/02/02", Result: false };

        let expectedResult = [
            { "RFID": "12345678901234567890123456789019", "itemId": 10, "SKUId": 1 }
        ];

        let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/testDescriptor')
                                            .send(testDescriptor)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.post('/api/skuitems/testResult')
                                                    .send(testResult)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.post('/api/restockOrder')
                                                            .send(restockOrder)
                                                            .then(function (res) {
                                                                res.should.have.status(201);
                                                                agent.post('/api/restockOrder')
                                                                    .send(restockOrder2)
                                                                    .then(function (res) {
                                                                        res.should.have.status(201);
                                                                        agent.put('/api/restockOrder/' + 1)
                                                                            .send(changeState)
                                                                            .then(function (res) {
                                                                                res.should.have.status(200);
                                                                                agent.put('/api/restockOrder/' + 1 + '/skuItems')
                                                                                    .send(skuToRO)
                                                                                    .then(function (res) {
                                                                                        res.should.have.status(200);
                                                                                        agent.put('/api/restockOrder/' + 1)
                                                                                            .send(changeState2)
                                                                                            .then(function (res) {
                                                                                                res.should.have.status(200);
                                                                                                agent.get('/api/restockOrders/' + restockOrderID + '/returnItems')
                                                                                                    .then(function (r) {
                                                                                                        r.should.have.status(expectedHTTPStatus);
                                                                                                        if (expectedHTTPStatus === 200)
                                                                                                            r.body.should.be.deep.equal(expectedResult);
                                                                                                        done();
                                                                                                    });
                                                                                            });
                                                                                    });
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            })
                    });
            });
    });
}


function addSKUItemToRestockOrder(expectedHTTPStatus, restockOrderID, rfid, SKUId, itemId) {
    it('Add skuitem to Restock Order', function (done) {

        let products = [{ SKUId: 1, itemId: itemId, description: "A product", price: 20, qty: 30 }];

        const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };
        const skuToRO = { "skuItems": [{ rfid: rfid, itemId: itemId, SKUId: SKUId }] };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };

        const restockOrder = { issueDate: "2022/03/03", products: products, supplierId: 1 };
        const restockOrder2 = { issueDate: "2022/04/05", products: products, supplierId: 1 };

        const item = { "id": itemId, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

        const changeState = { newState: "DELIVERED" };

        let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/restockOrder')
                                            .send(restockOrder)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.post('/api/restockOrder')
                                                    .send(restockOrder2)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.put('/api/restockOrder/' + 2)
                                                            .send(changeState)
                                                            .then(function (res) {
                                                                res.should.have.status(200);
                                                                agent.put('/api/restockOrder/' + restockOrderID + '/skuItems')
                                                                    .send(skuToRO)
                                                                    .then(function (res) {
                                                                        res.should.have.status(expectedHTTPStatus);
                                                                        done();
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            })
                    });
            });
    });

}

function changeStateRestockOrder(expectedHTTPStatus, restockOrderID, newState) {
    it('Change State of Restock Order', function (done) {

        let products = [{ SKUId: 1, itemId: 10, description: "A product", price: 20, qty: 30 }];

        const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };

        const changeState = { newState: newState };

        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };

        const restockOrder = { issueDate: "2022/03/03", products: products, supplierId: 1 };

        const item = { "id": 10, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

        let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/restockOrder')
                                            .send(restockOrder)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.put('/api/restockOrder/' + restockOrderID)
                                                    .send(changeState)
                                                    .then(function (res) {
                                                        res.should.have.status(expectedHTTPStatus);
                                                        done();
                                                    });
                                            });
                                    });
                            })
                    });
            });
    });

}

function addTransportNoteToRestockOrder(expectedHTTPStatus, restockOrderID, dateDelivery) {
    it('Add Transport Note to Restock Order', function (done) {

        let products = [{ SKUId: 1, itemId: 10, description: "A product", price: 20, qty: 30 }];

        const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };
        const transportNote = { transportNote: { deliveryDate: dateDelivery } };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };

        const changeState = { newState: "DELIVERY" };

        const restockOrder = { issueDate: "2022/03/03", products: products, supplierId: 1 };

        const item = { "id": 10, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

        let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/restockOrder')
                                            .send(restockOrder)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.put('/api/restockOrder/' + restockOrderID)
                                                    .send(changeState)
                                                    .then(function (res) {
                                                        res.should.have.status(expectedHTTPStatus);
                                                        agent.put('/api/restockOrder/' + restockOrderID + '/transportNote')
                                                            .send(transportNote)
                                                            .then(function (res) {
                                                                res.should.have.status(expectedHTTPStatus);
                                                                done();
                                                            });
                                                    });
                                            });
                                    });
                            })
                    });
            });
    });

}


function deleteRestockOrder(expectedHTTPStatus, restockOrderID) {
    it('delete Restock Order by ID', function (done) {

        let products = [{ SKUId: 1, itemId: 10, description: "A product", price: 20, qty: 30 }];

        const skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2022/01/01" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };

        const restockOrder = { issueDate: "2022/03/03", products: products, supplierId: 1 };
        const restockOrder2 = { issueDate: "2022/04/05", products: products, supplierId: 1 };

        const item = { "id": 10, "description": "a new item", "price": 10.99, "SKUId": 1, "supplierId": 1 }

        let user = { username: "user1@ezwh.com", name: "name", surname: "surname", password: "password12345", type: "supplier" }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/restockOrder')
                                            .send(restockOrder)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.post('/api/restockOrder')
                                                    .send(restockOrder2)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.delete('/api/restockOrder/' + restockOrderID)
                                                            .then(function (r) {
                                                                r.should.have.status(expectedHTTPStatus);
                                                                done();
                                                            });
                                                    });
                                            });
                                    });
                            })
                    });
            });
    });

}
