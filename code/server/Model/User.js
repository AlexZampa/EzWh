'use strict';

class User {
    constructor(userID, name, surname, email, password, type) {
        this.userID = userID;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.type = type;
    }

    getUserID = () => this.userID;
    getName = () => this.name;
    getSurname = () => this.surname;
    getEmail = () => this.email;
    getPassword = () => this.password;
    getType = () => this.type;
    
    setType = (type) => { this.type = type; }
    
}


module.exports = User;