'use strict';

const dayjs = require("dayjs");

class TestResult{

    constructor(id, rfid, idTestDescriptor, date=undefined, result){
        this.id = id;
        this.rfid=rfid;
        this.idTestDescriptor = idTestDescriptor;
        this.date = date ? dayjs(date) : "";
        this.result = result;
    };

    modifyTestResultdata = async (newIdTestDescriptor, newDate, newResult, TestResultDAO) => {
        try{
            const res = await TestResultDAO.updateTestResult(this.id, this.rfid, newIdTestDescriptor, newDate, newResult);
            this.idTestDescriptor = newIdTestDescriptor;
            this.date = newDate ? dayjs(newDate) : "";
            this.result = newResult;
            return res;
        }catch(err){
            throw err;
        }
    }

    convertToObj = () => {
        return(
            {
                "id" : this.id, "idTestDescriptor" : this.idTestDescriptor, "date" : this.date ? this.date.format('YYYY/DD/MM') : "", "result" : this.result
            }
        )
    }
};
module.exports = TestResult;
