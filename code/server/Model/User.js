'use strict';

class User {
    constructor(userID, name, surname, email, type) {
        this.userID = userID;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.type = type;
    }

    getUserID = () => this.userID;
    getName = () => this.name;
    getSurname = () => this.surname;
    getEmail = () => this.email;
    getType = () => this.type;
    
    setType = (type) => { this.type = type; }
    
    convertToObj = () => {
        return ( { "id": this.userID, "name": this.name, "surname": this.surname, "email": this.email, "type": this.type } );
    };

}


/**
 * Array that contains all the possible value for type attribute of User
 */
const userTypes = ["manager", "administrator", "customer", "clerk", "supplier", "qualityEmployee", "deliveryEmployee"];

module.exports = { User, userTypes };