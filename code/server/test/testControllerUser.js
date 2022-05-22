'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test user apis', () => {

    beforeEach(async () => {
        await agent.delete('/api/test/users');
    })

    newUser(201, "user1@ezwh.com", "Mary", "Red", "testpassword", "customer");
    newUser(422);
    newUser(422, "user1@ezwh.com", "Mary", "Red", "testpassword", "invalidType");
    newUser(422, "user1@ezwh.com", "Mary", "Red", "short", "customer");
    newUser(422, "manager1@ezwh.com", "Mary", "Red", "testpassword", "manager");
    newUser(422, "manager1@ezwh.com", "Mary", "Red", "testpassword", "administrator");
    newUserConfilct(409);

    getUsers(200);
    getSuppliers(200);

    modifyUserRights(200, "user1@ezwh.com", "customer",  "user1@ezwh.com", "supplier");
    modifyUserRights(422, "user1@ezwh.com", "customer");
    modifyUserRights(422, "user1@ezwh.com", "customer", "user1@ezwh.com", "manager");
    modifyUserRights(422, "user1@ezwh.com", "customer", "user1@ezwh.com", "administrator");
    modifyUserRights(422, "user1@ezwh.com", "customer", "user1@ezwh.com", "invalidType");
    modifyUserRights(404, "user1@ezwh.com", "customer", "nonExistentUser@ezwh.com", "supplier");
    
    deleteUser(204, "user1@ezwh.com", "customer", "user1@ezwh.com", "customer");
    deleteUser(422, "user1@ezwh.com", "customer", "nonExistentUser@ezwh.com", "customer");
    deleteUser(422, "user1@ezwh.com", "customer", "user1@ezwh.com", "supplier");

    customerSessions(200, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "testpassword");
    customerSessions(401, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "invalidPassword");
    customerSessions(401, "user1@ezwh.com", "testpassword", "invalidUsername@ezwh.com", "testpassword");

    supplierSessions(200, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "testpassword");
    supplierSessions(401, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "invalidPassword");
    supplierSessions(401, "user1@ezwh.com", "testpassword", "invalidUsername@ezwh.com", "testpassword");

    deliveryEmployeeSessions(200, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "testpassword");
    deliveryEmployeeSessions(401, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "invalidPassword");
    deliveryEmployeeSessions(401, "user1@ezwh.com", "testpassword", "invalidUsername@ezwh.com", "testpassword");

    qualityEmployeeSessions(200, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "testpassword");
    qualityEmployeeSessions(401, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "invalidPassword");
    qualityEmployeeSessions(401, "user1@ezwh.com", "testpassword", "invalidUsername@ezwh.com", "testpassword");

    clerkSessions(200, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "testpassword");
    clerkSessions(401, "user1@ezwh.com", "testpassword", "user1@ezwh.com", "invalidPassword");
    clerkSessions(401, "user1@ezwh.com", "testpassword", "invalidUsername@ezwh.com", "testpassword");

});


function newUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('adding a new user', function (done) {
        if (username !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/newUser') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
    });
}


function newUserConfilct(expectedHTTPStatus) {
    it('adding existent user', function (done) {
        let user = { username: "user1@ezwh.com", name: "Mary", surname: "Red", password: "testpassword", type: "customer" };
        agent.post('/api/newUser')
        .send(user)
        .then(function (res) {
            res.should.have.status(201);
            agent.post('/api/newUser')
            .send(user)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    });
}


function getUsers(expectedHTTPStatus) {
    it('getting all users excluding managers', function (done) {
        let user1 = { username: "user1@ezwh.com", name: "Mary", surname: "Red", password: "testpassword", type: "customer" };
        let user2 = { username: "qualityEmployee1@ezwh.com", name: "John", surname: "Smith", password: "testpassword", type: "qualityEmployee" };
        let user3 = { username: "supplier1@ezwh.com", name: "Luke", surname: "Yellow", password: "testpassword", type: "supplier" };
        let expectedResult = [{"id": 1, "name":"Mary", "surname":"Red", "email":"user1@ezwh.com", "type":"customer"},
            {"id":2, "name":"John", "surname":"Smith", "email":"qualityEmployee1@ezwh.com", "type":"qualityEmployee"},
            {"id":3, "name":"Luke", "surname":"Yellow", "email":"supplier1@ezwh.com", "type":"supplier"} ];
    
        agent.post('/api/newUser')
            .send(user1)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/newUser')
                .send(user2)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/newUser')
                    .send(user3)
                    .then(function(res){
                        res.should.have.status(201);
                        agent.get('/api/users')
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
}


function getSuppliers(expectedHTTPStatus) {
    it('getting all suppliers', function (done) {
        let user1 = { username: "supplier1@ezwh.com", name: "Mary", surname: "Red", password: "testpassword", type: "supplier" };
        let user2 = { username: "qualityEmployee1@ezwh.com", name: "John", surname: "Smith", password: "testpassword", type: "qualityEmployee" };
        let user3 = { username: "supplier2@ezwh.com", name: "Luke", surname: "Yellow", password: "testpassword", type: "supplier" };
        let expectedResult = [{"id": 1, "name":"Mary", "surname":"Red", "email":"supplier1@ezwh.com", "type":"supplier"},
            {"id":3, "name":"Luke", "surname":"Yellow", "email":"supplier2@ezwh.com", "type":"supplier"} ];
        agent.post('/api/newUser')
            .send(user1)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/newUser')
                .send(user2)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/newUser')
                    .send(user3)
                    .then(function(res){
                        res.should.have.status(201);
                        agent.get('/api/suppliers')
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
}


function modifyUserRights(expectedHTTPStatus, originalUsername, oldType, username, newType) {
    it('modifing user rights', function (done) {
        let user = { username: originalUsername, name: "Mary", surname: "Red", password: "testpassword", type: oldType };
        let data = {oldType : oldType, newType : newType};
        agent.post('/api/newUser')
        .send(user)
        .then(function (res) {
            res.should.have.status(201);
            if (username !== undefined) {
                agent.put('/api/users/' + username)
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
            } else {
                agent.put('/api/users/' + originalUsername)          //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
            }
        });
    });
}


function deleteUser(expectedHTTPStatus, originalUsername, originalType, username, type) {
    it('adding existent user', function (done) {
        let user =  { username: originalUsername, name: "Mary", surname: "Red", password: "testpassword", type: originalType };
        agent.post('/api/newUser')
        .send(user)
        .then(function (res) {
            res.should.have.status(201);
            agent.delete(`/api/users/${username}/${type}`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    });
}


function customerSessions(expectedHTTPStatus, originalUsername, originalPassword, username, password) {
    it('login customer', function (done) {
        let user = { username: originalUsername, name: "Mary", surname: "Red", password: originalPassword, type: "customer" };
        let data = { username: username, password: password };
        let expectedResult = {id: 1, username: originalUsername, name: "Mary" }; 
        agent.post('/api/newUser')
        .send(user)
        .then(function (res) {
            res.should.have.status(201);
            agent.post('/api/customerSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus == 200){
                    res.body.id.should.equal(1);
                    res.body.username.should.equal(originalUsername);
                    res.body.name.should.equal("Mary");
                    res.body.should.be.deep.equal(expectedResult);
                }
                done();
            });
        });
    });
}


function supplierSessions(expectedHTTPStatus, originalUsername, originalPassword, username, password) {
    it('login customer', function (done) {
        let user = { username: originalUsername, name: "Mary", surname: "Red", password: originalPassword, type: "supplier" };
        let data = { username: username, password: password };
        let expectedResult = {id: 1, username: originalUsername, name: "Mary" }; 
        agent.post('/api/newUser')
        .send(user)
        .then(function (res) {
            res.should.have.status(201);
            agent.post('/api/supplierSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus == 200){
                    res.body.id.should.equal(1);
                    res.body.username.should.equal(originalUsername);
                    res.body.name.should.equal("Mary");
                    res.body.should.be.deep.equal(expectedResult);
                }
                done();
            });
        });
    });
}


function clerkSessions(expectedHTTPStatus, originalUsername, originalPassword, username, password) {
    it('login customer', function (done) {
        let user = { username: originalUsername, name: "Mary", surname: "Red", password: originalPassword, type: "clerk" };
        let data = { username: username, password: password };
        let expectedResult = {id: 1, username: originalUsername, name: "Mary" }; 
        agent.post('/api/newUser')
        .send(user)
        .then(function (res) {
            res.should.have.status(201);
            agent.post('/api/clerkSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus == 200){
                    res.body.id.should.equal(1);
                    res.body.username.should.equal(originalUsername);
                    res.body.name.should.equal("Mary");
                    res.body.should.be.deep.equal(expectedResult);
                }
                done();
            });
        });
    });
}


function qualityEmployeeSessions(expectedHTTPStatus, originalUsername, originalPassword, username, password) {
    it('login customer', function (done) {
        let user = { username: originalUsername, name: "Mary", surname: "Red", password: originalPassword, type: "qualityEmployee" };
        let data = { username: username, password: password };
        let expectedResult = {id: 1, username: originalUsername, name: "Mary" }; 
        agent.post('/api/newUser')
        .send(user)
        .then(function (res) {
            res.should.have.status(201);
            agent.post('/api/qualityEmployeeSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus == 200){
                    res.body.id.should.equal(1);
                    res.body.username.should.equal(originalUsername);
                    res.body.name.should.equal("Mary");
                    res.body.should.be.deep.equal(expectedResult);
                }
                done();
            });
        });
    });
}


function deliveryEmployeeSessions(expectedHTTPStatus, originalUsername, originalPassword, username, password) {
    it('login customer', function (done) {
        let user = { username: originalUsername, name: "Mary", surname: "Red", password: originalPassword, type: "deliveryEmployee" };
        let data = { username: username, password: password };
        let expectedResult = {id: 1, username: originalUsername, name: "Mary" }; 
        agent.post('/api/newUser')
        .send(user)
        .then(function (res) {
            res.should.have.status(201);
            agent.post('/api/deliveryEmployeeSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus == 200){
                    res.body.id.should.equal(1);
                    res.body.username.should.equal(originalUsername);
                    res.body.name.should.equal("Mary");
                    res.body.should.be.deep.equal(expectedResult);
                }
                done();
            });
        });
    });
}