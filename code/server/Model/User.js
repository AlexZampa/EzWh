class User {
    constructor(userID, name, surname, email, password, type) {
        this.userID = userID;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.type = type;
    }

    setType = (type) => {
        this.type = type;
    }

    getUserID = function () {
        return this.userID;
    }

}
