"use strict";

class Mock_userDAO {
    newUser = (username, name, surname, password, type) => jest.fn();
    getAllUsers = (type) => jest.fn();
    getAllUsersByType = (type) => jest.fn();
    getUser = (username, type) => jest.fn();
    updateUser = (username, oldType, newType) => jest.fn();
    loginUser = (username, password, type) => jest.fn();
    deleteUser = (username, type) => jest.fn();
}

module.exports = Mock_userDAO;