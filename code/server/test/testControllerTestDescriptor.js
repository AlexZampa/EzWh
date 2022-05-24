'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test Test descriptor apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/test/testDescriptors');
    })

    newTestDescriptor('adding a new td1', 201, "name", "description", 1);
    newTestDescriptor('adding a new td2', 422);
    newTestDescriptor('adding a new td3', 422, 1, "description", 1);
    newTestDescriptor('adding a new td4', 422, "name", 1, 1);
    newTestDescriptor('adding a new td5', 422, "name", "description", 0);
    newTestDescriptor('adding a new td6', 422, "name", "description", "idSKU");
    newTestDescriptor('adding a new td7', 404, "name", "description", 100);

    getTestDescriptors('getting all test descriptor', 200);

    getTestDescriptor('getting single td1', 200, 1);
    getTestDescriptor('getting single td2', 404, 100);
    getTestDescriptor('getting single td3', 422, "id");
    getTestDescriptor('getting single td4', 422, -1);
                                                    
    modifyTestDescriptor('modifing td data1', 200, 1, "newName", "newDescription", 1);
    modifyTestDescriptor('modifing td data2', 404, 100, "newName", "description", 1);
    modifyTestDescriptor('modifing td data2', 404, 1, "newName", "description", 40);
    modifyTestDescriptor('modifing td data4', 422, 0, "newName", "description", 1);
    modifyTestDescriptor('modifing td data5', 422, "id", "newName", "description", 1);
    modifyTestDescriptor('modifing td data6', 422, 1, 1, "newDescription", 1);
    modifyTestDescriptor('modifing td data7', 422, 1, "newName", 2, 1);
    modifyTestDescriptor('modifing td data8', 422, 1, "newName", "description", 0);
    modifyTestDescriptor('modifing td data9', 422, 1, "newName", "description", "newIdSKU");

    deleteTestDescriptor('deleting td1', 204, 1);
    deleteTestDescriptor('deleting td2', 422, "id");
    deleteTestDescriptor('deleting td3', 422, 0);
    deleteTestDescriptor('deleting td4', 422, 100);

});


function newTestDescriptor(testName, expectedHTTPStatus, name, procedureDescription, idSKU) {
    it(testName, function (done) {
        let testDescriptor = {name: name, procedureDescription: procedureDescription, idSKU: idSKU};
        if (name === undefined && procedureDescription === undefined && idSKU === undefined) {
            agent.post('/api/testDescriptor')              //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
            agent.post('/api/sku')
                .send(sku)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/testDescriptor')
                        .send(testDescriptor)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });
        }
    });
}


function getTestDescriptors(testName, expectedHTTPStatus) {
    it(testName, function (done) {

        const testDescriptor1 = { name: "name1", procedureDescription: "procedureDescription1", idSKU: 1 };
        const testDescriptor2 = { name: "name2", procedureDescription: "procedureDescription2", idSKU: 1 };
        const testDescriptor3 = { name: "name3", procedureDescription: "procedureDescription3", idSKU: 1 };

        let expectedResult = [{ "id": 1, "name": "name1", "procedureDescription": "procedureDescription1", "idSKU": 1 },
        { "id": 2, "name": "name2", "procedureDescription": "procedureDescription2", "idSKU": 1 },
        { "id": 3, "name": "name3", "procedureDescription": "procedureDescription3", "idSKU": 1 }];

        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/testDescriptor')
                    .send(testDescriptor1)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/testDescriptor')
                            .send(testDescriptor2)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/testDescriptor')
                                    .send(testDescriptor3)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.get('/api/testDescriptors')
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


function getTestDescriptor(testName, expectedHTTPStatus, id) {
    it(testName, function (done) {
        const testDescriptor = { name: "name1", procedureDescription: "procedureDescription1", idSKU: 1 };
        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
        const expectedResult = { "id": 1, "name": "name1", "procedureDescription": "procedureDescription1", "idSKU": 1 };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/testDescriptor')
                    .send(testDescriptor)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.get('/api/testDescriptors/' + id)
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


function modifyTestDescriptor(testName, expectedHTTPStatus, id, newName, newProcedureDescription, newIdSKU) {
    it(testName, function (done) {
        const testDescriptor = { name: "name1", procedureDescription: "procedureDescription1", idSKU: 1 };
        let data = { "newName":newName, "newProcedureDescription": newProcedureDescription, "newIdSKU" : newIdSKU};
        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/testDescriptor')
                    .send(testDescriptor)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.put('/api/testDescriptor/' + id)
                            .send(data)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });

    });
}


function deleteTestDescriptor(testName, expectedHTTPStatus, id) {
    it(testName, function (done) {
        const testDescriptor = { name: "name1", procedureDescription: "procedureDescription1", idSKU: 1 };
        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/testDescriptor')
                    .send(testDescriptor)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.delete('/api/testDescriptor/' + id)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });
    });
}
