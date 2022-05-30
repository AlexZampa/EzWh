'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test SKUItem apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/test/skuitems');
        await agent.delete('/api/test/skus');
    })

    newSKUItem(201, "1f", 1, "2022/02/22");
    newSKUItem(422);
    newSKUItem(422, "12f", 2, "2002-12-12");

    getSKUItems(200);

    getSKUItemByRFID(200, "1");
    getSKUItemByRFID(404, "1f");
    getSKUItemByID(200, 1);

    modifySKUItem(200, "1", "1f", 1, "2022/09/18");
    modifySKUItem(404, "2", "2f", 0, "2022/02/18");
    modifySKUItem(422, "1", "1f", 1, "2022-02-22");

    deleteSKUItem(204, "1");
    deleteSKUItem(422, "id");

});


function newSKUItem(expectedHTTPStatus, rfid, skuId, dateOfStock) {
    it('adding a new SKUItem', function (done) {
        let skuItem = { RFID: rfid, SKUId: skuId, DateOfStock: dateOfStock };
        if (rfid === undefined && skuId === undefined) {
            agent.post('/api/skuitem')              //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
            agent.post('/api/sku')
                .send(sku)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/skuitem')
                        .send(skuItem)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });

                });
        }
    });
}


function getSKUItems(expectedHTTPStatus) {
    it('getting all SKUItems', function (done) {

        const skuItem1 = { RFID: "1", SKUId: 1, DateOfStock: "2022/02/02" };
        const skuItem2 = { RFID: "2", SKUId: 1, DateOfStock: "2022/04/30" };
        const skuItem3 = { RFID: "3", SKUId: 1, DateOfStock: "2022/05/12" };

        let expectedResult = [{ "RFID": "1", "SKUId": 1, "Available": 0, "DateOfStock": "2022/02/02" },
        { "RFID": "2", "SKUId": 1, "Available": 0, "DateOfStock": "2022/04/30" },
        { "RFID": "3", "SKUId": 1, "Available": 0, "DateOfStock": "2022/05/12" }];
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem1)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/skuitem')
                            .send(skuItem2)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem3)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.get('/api/skuitems')
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
    });
}


function getSKUItemByID(expectedHTTPStatus, id) {
    it('getting single SKUItem by ID', function (done) {
        const skuItem = { RFID: "1", SKUId: 1, DateOfStock: "2022/02/02" };
        const data = { "newRFID": "1", "newAvailable": 1, "newDateOfStock": "2022/02/03" };
        const expectedResult = [{ "RFID": "1", "SKUId": 1, "DateOfStock": "2022/02/03" }];
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.put('/api/skuitems/' + "1")
                            .send(data)
                            .then(function (res) {
                                res.should.have.status(200);
                                agent.get('/api/skuitems/sku/' + id)
                                    .then(function (res) {
                                        res.should.have.status(expectedHTTPStatus);
                                        if (expectedHTTPStatus == 200)
                                            res.body.should.be.deep.equal(expectedResult);
                                        done();
                                    });
                            });
                    });
            });
    });
}

function getSKUItemByRFID(expectedHTTPStatus, rfid) {
    it('getting single SKUItem by RFID', function (done) {
        const skuItem = { RFID: "1", SKUId: 1, DateOfStock: "2022/02/02" };
        const expectedResult = { "RFID": "1", "SKUId": 1, "Available": 0, "DateOfStock": "2022/02/02" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.get('/api/skuitems/' + rfid)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                if (expectedHTTPStatus == 200)
                                    res.body.should.be.deep.equal(expectedResult);
                                done();
                            });
                    });
            });
    });
}

function modifySKUItem(expectedHTTPStatus, RFID, newRFID, newAvailable, newDate) {
    it('modifing SKUItem', function (done) {
        const skuItem = { RFID: "1", SKUId: 1, DateOfStock: "2022/02/02" };
        const data = { "newRFID": newRFID, "newAvailable": newAvailable, "newDateOfStock": newDate };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.put('/api/skuitems/' + RFID)
                            .send(data)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });
    });
}

function deleteSKUItem(expectedHTTPStatus, rfid) {
    it('deleting SKUItem', function (done) {
        const skuItem = { RFID: "1", SKUId: 1, DateOfStock: "2022/02/02" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.delete('/api/skuitems/' + rfid)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });
    });
}
