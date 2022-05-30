"use strict";

const Warehouse = require("../Model/Warehouse");
const {User} = require('../Model/User');

const userDAO = require('../Mock_databases/Mock_userDAO');
const skuDAO = require('../Mock_databases/Mock_skuDAO');
const skuItemDAO = require('../Mock_databases/Mock_skuItemDAO');
const positionDAO = require('../Mock_databases/Mock_positionDAO');
const restockOrderDAO = require('../Mock_databases/Mock_restockOrderDAO');
const returnOrderDAO = require('../Mock_databases/Mock_returnOrderDAO');
const internalOrderDAO = require('../Mock_databases/Mock_internalOrderDAO');
const itemDAO = require('../Mock_databases/Mock_itemDAO');
const testDescriptorDAO = require('../Mock_databases/Mock_testDescriptorDAO');
const testResultDAO = require('../Mock_databases/Mock_testResultDAO');

const wh = new Warehouse(userDAO, skuDAO, skuItemDAO, positionDAO, restockOrderDAO, returnOrderDAO, internalOrderDAO, itemDAO, testDescriptorDAO, testResultDAO);

describe("Test add User", () => {
    beforeAll(() => {
        userDAO.newUser.mockReset();
        userDAO.newUser.mockReturnValue(1);
    });

    testAddUser("user1@ezwh.com", "Mary", "Red", "testpassword", "customer", 1);
    testAddUserError('throw error on type manager', "manager1@ezwh.com", "John", "Smith", "testpassword", "manager", {err : 422, msg : "attempt to create manager or administrator accounts"});
    testAddUserError('throw error on type administrator', "administrator1@ezwh.com", "John", "Smith", "testpassword", "administrator", {err : 422, msg : "attempt to create manager or administrator accounts"});
    testAddUserError('throw error on non existent type', "user1@ezwh.com", "Mary", "Red", "testpassword", "nonExistentType", {err : 422, msg : "Invalid user type"});
    testAddUserError('throw error on password length', "user1@ezwh.com", "Mary", "Red", "test", "customer", {err : 422, msg : "Password must be at least 8 characters"});

    function testAddUser(username, name, surname, password, type, expectedResult) {
        test('Add User', async () => {
            let result = await wh.addUser(username, name, surname, password, type);
            expect(result).toBe(expectedResult);
        })
    }

    function testAddUserError(testMessage, username, name, surname, password, type, expectedError) {
        test(testMessage, async () => {
            async function invalidAddUser(){
                await wh.addUser(username, name, surname, password, type);
            }
            await expect(invalidAddUser).rejects.toEqual(expectedError);
        })
    }
});


describe("Test get all Users except managers", () => {
     
    const userList = [];
    userList.push(new User(1, "John", "Smith", "manager1@ezwh.com", "manager"));
    userList.push(new User(2, "Mary", "Red", "user1@ezwh.com", "customer"));
    userList.push(new User(3, "Frank", "White", "qualityEmployee1@ezwh.com", "qualityEmployee"));
    userList.push(new User(4, "Luke", "Yellow", "user2@ezwh.com", "customer"));
    
    const expectedList = [];
    expectedList.push(new User(2, "Mary", "Red", "user1@ezwh.com", "customer"));
    expectedList.push(new User(3, "Frank", "White", "qualityEmployee1@ezwh.com", "qualityEmployee"));
    expectedList.push(new User(4, "Luke", "Yellow", "user2@ezwh.com", "customer"));

    beforeAll(() => {
        userDAO.getAllUsers.mockReset();
        userDAO.getAllUsers.mockReturnValue(userList);
    });

    test('Get all Users', async () => {
        let result = await wh.getUsers();
        for(const i in result){
            compareUser(result[i], expectedList[i]);
        }
    })

});


describe("Test get all Suppliers", () => {
    const userList = [];
    userList.push(new User(2, "Frank", "White", "supplier1@ezwh.com", "supplier"));
    userList.push(new User(4, "Luke", "Yellow", "supplier2@ezwh.com", "supplier"));
    
    const expectedList = [];
    expectedList.push(new User(2, "Frank", "White", "supplier1@ezwh.com", "supplier"));
    expectedList.push(new User(4, "Luke", "Yellow", "supplier2@ezwh.com", "supplier"));

    beforeAll(() => {
        userDAO.getAllUsersByType.mockReset();
        userDAO.getAllUsersByType.mockReturnValue(userList);
    });

    test('Get all suppliers', async () => {
        let result = await wh.getSuppliers();
        for(const i in result){
            compareUser(result[i], expectedList[i]);
        }
    })
});


describe("Test login User", () => {
    const user = new User(1, "Frank", "White", "supplier1@ezwh.com", "supplier");

    beforeAll(() => {
        userDAO.loginUser.mockReset();
        userDAO.loginUser.mockReturnValueOnce(user).mockRejectedValueOnce({err: 401, msg: "Invalid password" });
    });

    test('valid login', async () => {
        let result = await wh.login("supplier1@ezwh.com", "validPassword", "supplier");
        compareUser(result, user);
    })

    test('throw error on invalid password', async () => {
        async function invalidLogin(){
            await wh.login("supplier1@ezwh.com", "invalidPassword", "supplier");
        }
       expect(invalidLogin).rejects.toEqual({err: 401, msg: "Invalid password" });
    })
});


describe("Test modify User rights", () => {
    const user = new User(1, "Frank", "White", "supplier1@ezwh.com", "supplier");

    describe('Test modify rights', () => {
        beforeAll(() => {
            userDAO.getUser.mockReset();
            userDAO.getUser.mockReturnValue(user);

            userDAO.updateUser.mockReset();
            userDAO.updateUser.mockReturnValue(1);
        });
        testModifyUserRights('Modify user type to customer ', "supplier1@ezwh.com", "supplier", "customer");
        testModifyUserRights('Modify user type to clerk', "supplier1@ezwh.com", "supplier", "clerk");
        testModifyUserRights('Modify user type to supplier', "supplier1@ezwh.com", "supplier", "supplier");
        testModifyUserRights('Modify user type to qualityEmployee', "supplier1@ezwh.com", "supplier", "qualityEmployee");
        testModifyUserRights('Modify user type to deliveryEmployee', "supplier1@ezwh.com", "supplier", "deliveryEmployee");

        function testModifyUserRights(testMessage, username, oldType, newType, expectedValue){
            test(testMessage, async () => {
                let res = await wh.modifyUserRights(username, oldType, newType);
                expect(userDAO.updateUser).toHaveBeenCalledWith(username, oldType, newType);
            });
        }
    });

    describe("Test Errors", () => {
        beforeAll(() => {
            userDAO.getUser.mockReset();
            userDAO.getUser.mockReturnValue(user);

            userDAO.updateUser.mockReset();
            userDAO.updateUser.mockReturnValue(1);
        });    
        
        testModifyUserRightsError('throw error on newType manager', "supplier1@ezwh.com", "supplier", "manager", {err : 422, msg : "Invalid user type"});
        testModifyUserRightsError('throw error on newType administrator', "supplier1@ezwh.com", "supplier", "administrator", {err : 422, msg : "Invalid user type"});
        testModifyUserRightsError('throw error on non existent type', "supplier1@ezwh.com", "supplier", "nonExistentType", {err : 422, msg : "Invalid user type"});

        function testModifyUserRightsError(testMessage, username, oldType, newType, expectedError){
            test(testMessage, async () => {
                async function invalidModify(){
                    await await wh.modifyUserRights(username, oldType, newType);
                };
                await expect(invalidModify).rejects.toEqual(expectedError);
            })
        }
    });
});


describe("Test delete User", () => {
    const user1 = new User(1, "John", "Smith", "manager1@ezwh.com", "manager");
    const user2 = new User(2, "Frank", "White", "supplier1@ezwh.com", "supplier");
    const user3 = new User(3, "Mary", "Red", "admin1@ezwh.com", "administrator");

    beforeAll(() => {
        userDAO.getUser.mockReset();
        userDAO.getUser.mockReturnValueOnce(user2).mockReturnValueOnce(user1).mockReturnValue(user3);

        userDAO.deleteUser.mockReset();
        userDAO.deleteUser.mockReturnValue(1);
    });

    test('delete user', async () => {
        let res = await wh.deleteUser("supplier1@ezwh.com", "supplier");
        expect(res).toStrictEqual(1);
    });

    testDeleteUserError('throw error on delete manager', "manager1@ezwh.com", "manager", {err : 422, msg : "Attempt to delete manager/administrator"});
    testDeleteUserError('throw error on delete administrator', "admin1@ezwh.com", "administrator", {err : 422, msg : "Attempt to delete manager/administrator"});

    function testDeleteUserError(testMessage, username, type, expectedError){
        test(testMessage, async () => {
            async function invalidDelete(){
                await wh.deleteUser(username, type);
            };
            await expect(invalidDelete).rejects.toEqual(expectedError);
        })
    } 
});


function compareUser(user, expectedUser){
    expect(user.getUserID()).toStrictEqual(expectedUser.getUserID());
    expect(user.getName()).toStrictEqual(expectedUser.getName());
    expect(user.getSurname()).toStrictEqual(expectedUser.getSurname());
    expect(user.getEmail()).toStrictEqual(expectedUser.getEmail());
    expect(user.getType()).toStrictEqual(expectedUser.getType());
};