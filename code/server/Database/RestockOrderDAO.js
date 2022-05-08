'use strict';
const sqlite = require('sqlite3');
const RestockOrder = require('../Model/RestockOrder');
const ConnectionDB = require('./ConnectionDB');

class RestockOrderDAO {
    constructor(db) {
        this.db = db;
    }

}

module.exports = RestockOrderDAO;