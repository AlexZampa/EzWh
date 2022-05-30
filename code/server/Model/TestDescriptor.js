'use strict';

class TestDescriptor {

    constructor(id, name, procedureDescription, SKUid){
        this.id = id;
        this.name = name;
        this.procedureDescription = procedureDescription;
        this.SKUid = SKUid;
    };

    getID = () => this.id;
    getName = () => this.name;
    getprocedureDescription = () => this.procedureDescription;
    getSKUid = () => this.SKUid;

    setID = (ID) => {this.id = ID; };
    setName = (name) => {this.name = name; };
    setProcedureDescription = (procedureDescription) => {this.procedureDescription = procedureDescription; };
    setSKUid = (SKUid) => {this.SKUid = SKUid; };

    modifyTestDescriptorData = async (newName, newProcedureDescription, newIdSKU, TestDescriptorDAO) => {
        try{
            const res = await TestDescriptorDAO.updateTestDescriptor(this.id, newName, newProcedureDescription, newIdSKU);
            this.name = newName;
            this.procedureDescription = newProcedureDescription;
            this.SKUid = newIdSKU;
            return res;
        }
        catch(err){
            throw err;
        }
    }

    convertToObj = () => {
        return (
            {"id" : this.id, "name" : this.name, "procedureDescription" : this.procedureDescription, "idSKU" : this.SKUid});
    };
};

module.exports = TestDescriptor;
