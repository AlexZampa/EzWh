'use strict';
const { use } = require('chai');
const sqlite = require('sqlite3');
const UserDAO = require('../Database/UserDAO');
const User = require('./User');

class Warehouse{

    constructor(){
        this.db = new sqlite.Database('./Database/EzWhDatabase.db', err => { if (err) throw err; });
        this.userDAO = new UserDAO(this.db);
    };

    login = async (username, password) => {
        const userObj = await this.userDAO.loginUser(username, password);
        if(Object.keys(userObj).length === 0)
            return {};
        const user = new User(userObj.id, userObj.name, userObj.surname, userObj.email);
        return {"id": user.getUserID(), "name": user.getName(), "surname": user.getSurname(), "email": user.getEmail(), "type": user.getType()};
    };


}



module.exports = Warehouse;