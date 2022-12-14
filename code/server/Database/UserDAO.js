'use strict';
const crypto = require('crypto');
const ConnectionDB = require('./ConnectionDB');
const { User } = require('../Model/User');

class UserDAO{

    constructor(){
        this.connectionDB = new ConnectionDB();
    };

    init = async (hardcodedusers=true) => {
        await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "User" ("userID" INTEGER NOT NULL UNIQUE, "name" TEXT NOT NULL, "surname" TEXT NOT NULL, "email" TEXT NOT NULL, "type" TEXT NOT NULL, "password" TEXT NOT NULL, "salt" TEXT NOT NULL, PRIMARY KEY("userID"));');
        if(hardcodedusers)
            await createHardcodedUsers(this.connectionDB);
    }

    newUser = async (username, name, surname, password, type) => {
        try{
            let sql = "SELECT COUNT(*) AS num FROM User WHERE email = ? AND type = ?";        // check if exists
            let res = await this.connectionDB.DBget(sql, [username, type]);
            if(res.num != 0)
                throw {err: 409, msg: "User already exists"};
            sql = "INSERT INTO User(name, surname, email, type, password, salt) VALUES(?, ?, ?, ?, ?, ?)";
            const secPwd = await generateSecurePassword(password);
            res = await this.connectionDB.DBexecuteQuery(sql, [name, surname, username, type, secPwd.pwd, secPwd.salt]);
            return res.lastID;
        }
        catch(err){
            throw err;
        }
    };

    getAllUsers = async (type) => {
        try{
            const sql = "SELECT * FROM User";
            const res = await this.connectionDB.DBgetAll(sql, []);
            return res.map(u => new User(u.userID, u.name, u.surname, u.email, u.type));
        }
        catch(err){
            throw err;
        }
    };

    getAllUsersByType = async (type) => {
        try{
            const sql = "SELECT * FROM User WHERE type = ?";
            const res = await this.connectionDB.DBgetAll(sql, [type]);
            return res.map(u => new User(u.userID, u.name, u.surname, u.email, u.type));
        }
        catch(err){
            throw err;
        }
    };

    getUser = async (username, type) => {
        try {
            const sql = "SELECT * FROM User WHERE email = ? and type = ?";
            const user = await this.connectionDB.DBget(sql, [username, type]);
            if(user === undefined){       // user does not exist
                throw {err : 404, msg : "User not found" };
            }
            return new User(user.userID, user.name, user.surname, user.email, user.type);
        } catch (err) {
            throw err;
        }
    };

    updateUser = async (username, oldType, newType) => {
        try {
            const sql = "UPDATE User SET type = ? WHERE email = ? AND type = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newType, username, oldType]);
            return res.changes
        } catch (err) {
            throw err;
        }
    };

    loginUser = async (username, password, type) => {
        try{
            const sql = "SELECT * FROM User WHERE email = ? and type = ?";
            const user = await this.connectionDB.DBget(sql, [username, type]);
            if(user === undefined){       // user does not exist
                throw {err : 401, msg : "User not found" };
            }
            const login = await verifyPassword(user.password, user.salt, password);
            if(!login)
                throw {err : 401, msg : "Invalid password" };
            return new User(user.userID, user.name, user.surname, user.email, user.type);
        }
        catch(err){
            throw err;
        }
    };

    deleteUser = async (username, type) => {
        try {
            const sql = "DELETE FROM User WHERE email = ? AND type = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [username, type]);
            return res.changes;
        } catch (err) {
            throw err;
        }
    };

    resetTable = async () =>{
        try {
            let res = await this.connectionDB.DBexecuteQuery('DROP TABLE IF EXISTS User');
            res = await this.connectionDB.DBexecuteQuery('CREATE TABLE IF NOT EXISTS "User" ("userID" INTEGER NOT NULL UNIQUE, "name" TEXT NOT NULL, "surname" TEXT NOT NULL, "email" TEXT NOT NULL, "type" TEXT NOT NULL, "password" TEXT NOT NULL, "salt" TEXT NOT NULL, PRIMARY KEY("userID"));');
        } catch (err) {
            throw err;    
        }
    }

}


async function createHardcodedUsers(db){
    const hardcodedUsers = async (db) => {
        try{
            const sql = "SELECT COUNT(*) AS num FROM User WHERE email = ? AND type = ?";    
            let res = await db.DBget(sql, ['manager1@ezwh.com', 'manager']);
            if(res.num === 0){
                const secPwd = await generateSecurePassword('testpassword');
                await insertHardcodedUser(db, 'Michael', 'Scott', 'manager1@ezwh.com', 'manager', secPwd.pwd, secPwd.salt )
            }
            
            res = await db.DBget(sql, ['user1@ezwh.com', 'customer']);
            if(res.num === 0){
                const secPwd = await generateSecurePassword('testpassword');
                await insertHardcodedUser(db, 'Mary', 'Red', 'user1@ezwh.com', 'customer', secPwd.pwd, secPwd.salt )
            }
            
            res = await db.DBget(sql, ['qualityEmployee1@ezwh.com', 'qualityEmployee']);
            if(res.num === 0){
                const secPwd = await generateSecurePassword('testpassword');
                await insertHardcodedUser(db, 'Josh', 'Blue', 'qualityEmployee1@ezwh.com', 'qualityEmployee', secPwd.pwd, secPwd.salt )
            }
            
            res = await db.DBget(sql, ['clerk1@ezwh.com', 'clerk']);
            if(res.num === 0){
                const secPwd = await generateSecurePassword('testpassword');
                await insertHardcodedUser(db, 'Frank', 'Green', 'clerk1@ezwh.com', 'clerk', secPwd.pwd, secPwd.salt )
            }

            res = await db.DBget(sql, ['deliveryEmployee1@ezwh.com', 'deliveryEmployee']);
            if(res.num === 0){
                const secPwd = await generateSecurePassword('testpassword');
                await insertHardcodedUser(db, 'Lucy', 'Black', 'deliveryEmployee1@ezwh.com', 'deliveryEmployee', secPwd.pwd, secPwd.salt )
            }

            res = await db.DBget(sql, ['supplier1@ezwh.com', 'supplier']);
            if(res.num === 0){
                const secPwd = await generateSecurePassword('testpassword');
                await insertHardcodedUser(db, 'Jim', 'Yellow', 'supplier1@ezwh.com', 'supplier', secPwd.pwd, secPwd.salt )
            }   
        } catch(err){
            console.log(err);
        }
    }
    await hardcodedUsers(db);
}


const insertHardcodedUser = async (db, name, surname, email, type, password, salt) => {
    try{
        const sql = "INSERT INTO User(name, surname, email, type, password, salt) VALUES(?, ?, ?, ?, ?, ?)";
        await db.DBexecuteQuery(sql, [name, surname, email, type, password, salt]);
        return true;
    }catch(err){
        throw err;
    }
}

const generateSecurePassword = async (password) => {
    const buf = crypto.randomBytes(128);            // generate random bytes
    const salt = buf.toString('hex');               // convert bytes to hex string (to store in the DB)
    const hash = crypto.createHash('sha256');
    hash.update(password);                          // generate digest as SHA-256(password | salt)
    hash.update(buf);
    const pwd = hash.digest('hex');
    return {"pwd": pwd, "salt": salt};
}

const verifyPassword = async (passwordStored, saltStored, password) => {
    const salt = Buffer.from(saltStored, 'hex');    // convert saltStored (hex string) to bytes
    const hash = crypto.createHash('sha256');
    hash.update(password);                          // generate digest as SHA-256(password | salt)
    hash.update(salt);
    const pwd = hash.digest('hex');
    if(pwd === passwordStored)             // check if digest stored in the DB is equal to digest computed above
        return true;
    return false;
}


module.exports = UserDAO;