'use strict';

class TestDescriptor {

    constructor(id){
        this.id = id;
    };

    getID = () => this.id;

};

module.exports = TestDescriptor;