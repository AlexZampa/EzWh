const dayjs = require("dayjs");

class SKUItem {
    constructor(RFID, sku, available, dateOfStock=undefined, restockOrder=undefined) {
        this.RFID = RFID;
        this.sku = sku;
        this.dateOfStock = dateOfStock ? dayjs(dateOfStock) : "";
        this.testResults = [];
        this.restockOrder = restockOrder;
        this.available = available;
    }

    getRFID = () => this.RFID;
    getSKU = () => this.sku;
    getAvailable = () => this.available;
    getDateOfStock = () => this.dateOfStock.format('YYYY/MM/DD HH:mm');
    getRestockOrder = () => this.restockOrder;
    
    setRFID = (RFID) => { this.RFID = RFID; };
    setAvailable = (available) => { this.available = available; };
    setDateOfStock = (dateOfStock) => { this.dateOfStock = dayjs(dateOfStock); };
    setRestockOrder = (restockOrder) => { this.restockOrder = restockOrder};
    setSKU = (sku) => { this.sku = sku; };

    isAvailable = () => { return this.available; };

    addTestResult = (testResult) => { this.testResults.concat([testResult]); };

    convertToObj = () => {
        return (
            {
                "RFID": this.RFID, "SKUId": this.sku.getID(), "Available":this.available, "DateOfStock": this.dateOfStock ?  this.dateOfStock.format('YYYY/MM/DD HH:mm') : ""
            });
    };

}

module.exports = SKUItem;