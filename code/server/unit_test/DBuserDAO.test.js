'use strict';

const UserDAO = require('../Database/UserDAO');
const {User} = require('../Model/User');

const userDAO = new UserDAO();
userDAO.init(false);

describe('Test Create and Get User', () => {
    beforeAll(async () => {
        await userDAO.resetTable();
    });

    afterAll(async () => {
        await userDAO.resetTable();
        await userDAO.init(true);
    });

    test('delete table User', async () => {
        let res = await userDAO.getAllUsers();
        expect(res.length).toStrictEqual(0);
    });
    
    const expectedUser1 = new User(1, "John", "Smith", "manager1@ezwh.com", "manager");
    const expectedUser2 = new User(2, "Mary", "Red", "user1@ezwh.com", "customer");

    let expectedID = 1;
    testCreateUser("manager1@ezwh.com", "John", "Smith", "testpassword", "manager", expectedID);
    testGetUser("manager1@ezwh.com", "manager", expectedUser1);

    expectedID = 2;
    testCreateUser("user1@ezwh.com", "Mary", "Red", "testpassword", "customer", expectedID);
    testGetUser("user1@ezwh.com", "customer", expectedUser2);
});


describe('Test throw err on new User', () => {
    beforeAll(async () => {
        await userDAO.resetTable();
        await userDAO.newUser("manager1@ezwh.com", "John", "Smith", "testpassword", "manager");
    });

    afterAll(async () => {
        await userDAO.resetTable();
        await userDAO.init(true);
    });

    testCreateUserError("manager1@ezwh.com", "John", "Smith", "testpassword", "manager", {err: 409, msg: "User already exists"});   
});


describe('Test Get All User', () => {
    beforeAll(async () => {
        await userDAO.resetTable();
        await userDAO.newUser("manager1@ezwh.com" , "John", "Smith", "testpassword", "manager");
        await userDAO.newUser("user1@ezwh.com", "Mary", "Red", "testpassword", "customer");
        await userDAO.newUser("qualityEmployee1@ezwh.com", "Frank", "White", "testpassword", "qualityEmployee");
        await userDAO.newUser("user2@ezwh.com", "Luke", "Yellow", "testpassword", "customer");
    });

    afterAll(async () => {
        await userDAO.resetTable();
        await userDAO.init(true);
    });

    const userList = [];
    userList.push(new User(1, "John", "Smith", "manager1@ezwh.com", "manager"));
    userList.push(new User(2, "Mary", "Red", "user1@ezwh.com", "customer"));
    userList.push(new User(3, "Frank", "White", "qualityEmployee1@ezwh.com", "qualityEmployee"));
    userList.push(new User(4, "Luke", "Yellow", "user2@ezwh.com", "customer"));

    testGetAllUsers(userList);
    testGetAllUsersByType("customer", userList.filter(u => u.getType() === "customer"));

});


describe('Test Update User', () => {
    beforeAll(async () => {
        await userDAO.resetTable();
        await userDAO.newUser("manager1@ezwh.com", "John", "Smith", "testpassword", "manager");
    });

    afterAll(async () => {
        await userDAO.resetTable();
        await userDAO.init(true);
    });
    
    const expectedUser = new User(1, "John", "Smith", "manager1@ezwh.com", "customer");
    testUpdateUser("manager1@ezwh.com","manager", "customer", 1);
    testUpdateUser("user1@ezwh.com","customer", "supplier", 0);
    testGetUser("manager1@ezwh.com", "customer", expectedUser);
});


describe('Test Delete User', () => {
    beforeAll(async () => {
        await userDAO.resetTable();
        await userDAO.newUser("manager1@ezwh.com" , "John", "Smith", "testpassword", "manager");
        await userDAO.newUser("user1@ezwh.com", "Mary", "Red", "testpassword", "customer");
        await userDAO.newUser("qualityEmployee1@ezwh.com", "Frank", "White", "testpassword", "qualityEmployee");
    });

    afterAll(async () => {
        await userDAO.resetTable();
        await userDAO.init(true);
    });

    const userList = [];
    userList.push(new User(1, "John", "Smith", "manager1@ezwh.com", "manager"));
    userList.push(new User(3, "Frank", "White", "qualityEmployee1@ezwh.com", "qualityEmployee"));
    testDeleteUser("user1@ezwh.com", "customer", 1);
    testGetAllUsers(userList);
    testDeleteUser("user1@ezwh.com", "customer", 0);
});


describe('Test login User', () => {
    beforeAll(async () => {
        await userDAO.resetTable();
        await userDAO.newUser("manager1@ezwh.com" , "John", "Smith", "testpassword", "manager");
    });

    afterAll(async () => {
        await userDAO.resetTable();
        await userDAO.init(true);
    });
    
    const expectedUser = new User(1, "John", "Smith", "manager1@ezwh.com", "manager");
    testLoginUser("manager1@ezwh.com", "testpassword", "manager", expectedUser);

    test('throw error on invalid password', async () => {
        async function loginInvalid(){
            await userDAO.loginUser("manager1@ezwh.com", "invalidPassword", "manager");
        };
        await expect(loginInvalid).rejects.toEqual({err : 401, msg : "Invalid password" });
    });

    test('throw error on user not found', async () => {
        async function userInvalid(){
            await userDAO.loginUser("user1@ezwh.com", "testpassword", "manager");
        };
        await expect(userInvalid).rejects.toEqual({err : 401, msg : "User not found" });
    });

});


function testCreateUser(username, name, surname, password, type, expectedID) {
    test('create new User', async () => {
        let id = await userDAO.newUser(username, name, surname, password, type);
        expect(id).toStrictEqual(expectedID);
    });
}

function testCreateUserError(username, name, surname, password, type, expectedError) {
    test('throw 409 on new User', async () => {
        async function createExistentUser(){
            await userDAO.newUser(username, name, surname, password, type);
        };
        await expect(createExistentUser).rejects.toEqual(expectedError);
    });
}

function testGetUser(username, type, expectedUser) {
    test('get User', async () => {
        let res = await userDAO.getUser(username, type);
        compareUser(res, expectedUser);
    });
}


function testGetAllUsers(expectedList) {
    test('get All Users', async () => {
        let res = await userDAO.getAllUsers();
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareUser(res[i], expectedList[i]);
        }
    });
}


function testGetAllUsersByType(type, expectedList) {
    test('get All Users by type', async () => {
        let res = await userDAO.getAllUsersByType(type);
        expect(res.length).toStrictEqual(expectedList.length);
        for(const i in res){
            compareUser(res[i], expectedList[i]);
        }
    });
}


function testUpdateUser(username, oldType, newType, expectedChanges) {
    test('update User', async () => {
        let res = await userDAO.updateUser(username, oldType, newType);
        expect(res).toStrictEqual(expectedChanges);
    });
}

function testLoginUser(username, password, type, expectedUser) {
    test('login User', async () => {
        let res = await userDAO.loginUser(username, password, type);
        compareUser(res, expectedUser);
    });
}


function testDeleteUser(username, type, expectedChanges) {
    test('delete User', async () => {
        let res = await userDAO.deleteUser(username, type);
        expect(res).toStrictEqual(expectedChanges);
    });
}


function compareUser(user, expectedUser){
    expect(user.getUserID()).toStrictEqual(expectedUser.getUserID());
    expect(user.getName()).toStrictEqual(expectedUser.getName());
    expect(user.getSurname()).toStrictEqual(expectedUser.getSurname());
    expect(user.getEmail()).toStrictEqual(expectedUser.getEmail());
    expect(user.getType()).toStrictEqual(expectedUser.getType());
};