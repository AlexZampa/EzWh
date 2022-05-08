'use strict';
const crypto = require('crypto');
const ConnectionDB = require('./ConnectionDB');
const { User } = require('../Model/User');

class UserDAO{

    constructor(){
        this.connectionDB = new ConnectionDB();
    };

    newUser = async (username, name, surname, password, type) => {
        try{
            const sql = "INSERT INTO User(name, surname, email, type, password, salt) VALUES(?, ?, ?, ?, ?, ?)";
            const secPwd = await generateSecurePassword(password);
            const res = await this.connectionDB.DBexecuteQuery(sql, [name, surname, username, type, secPwd.pwd, secPwd.salt]);
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
            return res.map(u => new User(u.userID, u.name, u.surname, u.email, u.password, u.type));
        }
        catch(err){
            throw err;
        }
    };

    getAllUsersByType = async (type) => {
        try{
            const sql = "SELECT * FROM User WHERE type = ?";
            const res = await this.connectionDB.DBgetAll(sql, [type]);
            return res.map(u => new User(u.userID, u.name, u.surname, u.email, u.password, u.type));
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
            return new User(user.userID, user.name, user.surname, user.email, user.password, user.type);
        } catch (err) {
            throw err;
        }
    };

    updateUser = async (username, oldType, newType) => {
        try {
            const sql = "UPDATE User SET type = ? WHERE email = ? AND type = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [newType, username, oldType]);
            return res.lastID;
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
            return new User(user.userID, user.name, user.surname, user.email, user.password, user.type);
        }
        catch(err){
            throw err;
        }
    };

    deleteUser = async (username, type) => {
        try {
            const sql = "DELETE FROM User WHERE email = ? AND type = ?";
            const res = await this.connectionDB.DBexecuteQuery(sql, [username, type]);
            if(res.changes === 0)
                throw {err : 404, msg : "User not found" };
            return res;
        } catch (err) {
            throw err;
        }
    };

}


const generateSecurePassword = async (password) => {
    const buf = crypto.randomBytes(128);            // generete random bytes
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