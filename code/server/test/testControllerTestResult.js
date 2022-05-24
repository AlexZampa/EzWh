'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test Test result apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/test/testResults');
    })

    newTestResult('adding a new tr1', 201, "1234", 1, "2022/04/12", "true");
    newTestResult('adding a new tr2', 422);
    newTestResult('adding a new tr3', 422, 1234, 1, "2022/04/12", "true");
    newTestResult('adding a new tr4', 404, "3456", 1, "2022/04/12", "true");
    newTestResult('adding a new tr5', 422, "1234", "idTestDescriptor", "2022/04/12", "true");
    newTestResult('adding a new tr6', 404, "1234", 100, "2022/04/12", "true");
    newTestResult('adding a new tr7', 422, "1234", 0, "2022/04/12", "true");
    newTestResult('adding a new tr8', 422, "1234", 1, 2022, "true");
    newTestResult('adding a new tr9', 422, "1234", 1, "2022/04/12", 1);

    getTestResults('getting all test result1', 200, "5678");
    getTestResults('getting all test result2', 404, "3456");
    //getTestResults('getting all test result3', 422, 1234); non si può verificare

    getTestResult('getting single tr1', 200, "1234", 1);
    getTestResult('getting single tr2', 404, "5678", 1);
    //getTestResult('getting single tr', 422, 1234, 1); non si può verificare
    getTestResult('getting single tr3', 404, "1234", 100);
    getTestResult('getting single tr4', 422, "1234", "id");
    getTestResult('getting single tr5', 422, "1234", -1);

    modifyTestResult('modifing tr data1', 200, "1234", 1, 1, "2022/04/12", "true");
    //modifyTestResult('modifing tr data2', 404, 1234, 1, 1, "2022/04/12", "true"); non si può verificare
    modifyTestResult('modifing tr data3', 404, "5678", 1, 1, "2022/04/12", "true");
    modifyTestResult('modifing tr data4', 404, "1234", 100, 1, "2022/04/12", "true");
    modifyTestResult('modifing tr data5', 422, "1234", "id", 1, "2022/04/12", "true");
    modifyTestResult('modifing tr data6', 422, "1234", -1, 1, "2022/04/12", "true");
    modifyTestResult('modifing tr data6', 404, "1234", 1, 100, "2022/04/12", "true");
    modifyTestResult('modifing tr data7', 422, "1234", 1, "idTestDesc", "2022/04/12", "true");
    modifyTestResult('modifing tr data8', 422, "1234", 1, -1, "2022/04/12", "true");
    modifyTestResult('modifing tr data9', 422, "1234", 1, 1, 2022, "true");
    modifyTestResult('modifing tr data10', 422, "1234", 1, 1, "2022/04/12", 1);

    deleteTestResult('deleting tr1', 204, "1234", 1);
    deleteTestResult('deleting tr2', 422, "5678", 1);
    //deleteTestResult('deleting tr3', 422, 1234, 1); non si può verificare
    deleteTestResult('deleting tr4', 422, "1234", 100);
    deleteTestResult('deleting tr5', 422, "1234", "id");
    deleteTestResult('deleting tr6', 422, "1234", -1);

});


function newTestResult(testName, expectedHTTPStatus, rfid, idTestDescriptor, date, result) {
    it(testName, function (done) {
        let testResult = { rfid: rfid, idTestDescriptor: idTestDescriptor, Date: date, Result: result };
        if (rfid === undefined && idTestDescriptor === undefined && date === undefined && result === undefined) {
            agent.post('/api/skuitems/testResult')              //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            let testDescriptor = { name: "name", procedureDescription: "description", idSKU: 1 };
            let skuItem = { RFID: "1234", SKUId: 1, DateOfStock: "2022/04/05" };
            let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
            agent.post('/api/sku')
                .send(sku)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/skuItem')
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
                                            res.should.have.status(expectedHTTPStatus);
                                            done();
                                        });
                                });
                        });
                })
        }
    });
}


function getTestResults(testName, expectedHTTPStatus, rfid) {
    it(testName, function (done) {

        const testResult1 = { rfid: "1234", idTestDescriptor: 1, Date: "2022/03/09", Result: "false" };
        const testResult2 = { rfid: "5678", idTestDescriptor: 2, Date: "2022/03/10", Result: "true" };
        const testResult3 = { rfid: "5678", idTestDescriptor: 1, Date: "2022/03/09", Result: "true" };

        let expectedResult = [{ "id": 2, "idTestDescriptor": 2, "Date": "2022/03/10", "Result": "true" },
        { "id": 3, "idTestDescriptor": 1, "Date": "2022/03/09", "Result": "true" }];

        let testDescriptor1 = { name: "name1", procedureDescription: "description1", idSKU: 1 };
        let testDescriptor2 = { name: "name2", procedureDescription: "description2", idSKU: 1 };
        let skuItem1 = { RFID: "5678", SKUId: 1, DateOfStock: "2022/04/05" };
        let skuItem2 = { RFID: "1234", SKUId: 1, DateOfStock: "2022/04/07" };
        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };

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
                                agent.post('/api/testDescriptor')
                                    .send(testDescriptor1)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.post('/api/testDescriptor')
                                            .send(testDescriptor2)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                agent.post('/api/skuitems/testResult')
                                                    .send(testResult1)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.post('/api/skuitems/testResult')
                                                            .send(testResult2)
                                                            .then(function (res) {
                                                                res.should.have.status(201);
                                                                agent.post('/api/skuitems/testResult')
                                                                    .send(testResult3)
                                                                    .then(function (res) {
                                                                        res.should.have.status(201);
                                                                        agent.get('/api/skuitems/' + rfid + '/testResults/')
                                                                            .then(function (r) {
                                                                                r.should.have.status(expectedHTTPStatus);
                                                                                if (expectedHTTPStatus == 200) {
                                                                                    r.body.should.be.an('array');
                                                                                    r.body.should.be.deep.equal(expectedResult);
                                                                                }
                                                                                done();
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            })
                                    });
                            })
                    })
            });
    });
}


function getTestResult(testName, expectedHTTPStatus, rfid, id) {
    it(testName, function (done) {
        const testResult = { rfid: "1234", idTestDescriptor: 1, Date: "2022/03/09", Result: "false" };

        let expectedResult = { "id": 1, "idTestDescriptor": 1, "Date": "2022/03/09", "Result": "false" };

        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
        let testDescriptor = { name: "name1", procedureDescription: "description1", idSKU: 1 };
        let skuItem = { RFID: "1234", SKUId: 1, DateOfStock: "2022/04/05" };

        agent.post('/api/sku')
            .send(sku)
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
                                        agent.get('/api/skuitems/' + rfid + '/testResults/' + id)
                                            .then(function (res) {
                                                res.should.have.status(expectedHTTPStatus);
                                                if (expectedHTTPStatus == 200)
                                                    res.body.should.be.deep.equal(expectedResult);
                                                done();
                                            });
                                    })
                            })
                    });
            });

    });
}


function modifyTestResult(testName, expectedHTTPStatus, rfid, id, newIdTestDescriptor, newDate, newResult) {
    it(testName, function (done) {
        const testResult = { rfid: "1234", idTestDescriptor: 1, Date: "2022/03/09", Result: "false" };

        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
        let testDescriptor = { name: "name1", procedureDescription: "description1", idSKU: 1 };
        let skuItem = { RFID: "1234", SKUId: 1, DateOfStock: "2022/04/05" };

        let data = { "newIdTestDescriptor": newIdTestDescriptor, "newDate": newDate, "newResult": newResult };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/testDescriptor')
                    .send(testDescriptor)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/skuItem')
                            .send(skuItem)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitems/testResult')
                                    .send(testResult)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.put('/api/skuitems/' + rfid + ' /testResult/' + id)
                                            .send(data)
                                            .then(function (res) {
                                                res.should.have.status(expectedHTTPStatus);
                                                done();
                                            });
                                    })
                            })
                    });
            });

    });
}


function deleteTestResult(testName, expectedHTTPStatus, rfid, id) {
    it(testName, function (done) {
        const testResult = { rfid: "1234", idTestDescriptor: 1, Date: "2022/03/09", Result: "false" };

        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
        let testDescriptor = { name: "name1", procedureDescription: "description1", idSKU: 1 };
        let skuItem = { RFID: "1234", SKUId: 1, DateOfStock: "2022/04/05" };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/testDescriptor')
                    .send(testDescriptor)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/skuItem')
                            .send(skuItem)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitems/testResult')
                                    .send(testResult)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.delete('/api/skuitems/' + rfid + ' /testResult/' + id)
                                            .then(function (res) {
                                                res.should.have.status(expectedHTTPStatus);
                                                done();
                                            });
                                    })
                            })
                    });
            });
    });
}
