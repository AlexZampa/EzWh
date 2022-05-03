'use strict';
const { use } = require('chai');
const UserDAO = require('../Database/UserDAO');
const SkuDAO = require('../Database/SkuDAO');
const User = require('./User');
const SKU = require("../Model/Sku");

class Warehouse{

    constructor() {
        if (Warehouse._instance) {
            return Warehouse._instance
        }
        Warehouse._instance = this;
        this.userDAO = new UserDAO();
        this.skuDAO = new SkuDAO();
    };

    login = async (username, password) => {
        const userObj = await this.userDAO.loginUser(username, password);
        if(Object.keys(userObj).length === 0)
            return {};
        const user = new User(userObj.id, userObj.name, userObj.surname, userObj.email);
        return {"id": user.getUserID(), "name": user.getName(), "surname": user.getSurname(), "email": user.getEmail(), "type": user.getType()};
    };

    addSKU = async (description, weight, volume, notes, price, availableQty) => {
        const res = await this.skuDAO.newSKU(description, weight, volume, notes, price, availableQty);
    };

}

const warehouse = new Warehouse();

module.exports = Warehouse;