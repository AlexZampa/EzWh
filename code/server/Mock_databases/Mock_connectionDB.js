"use strict"

class Mock_connectionDB {
    DBget = (query, params) => jest.fn();
    DBgetAll = (query, params) => jest.fn();
    DBexecuteQuery = (query, params) => jest.fn();
}

module.exports = Mock_connectionDB;