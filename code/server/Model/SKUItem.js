class SKUItem {
    constructor(RFID, sku) {
        this.RFID = RFID;
        this.sku = sku;
        this.dateOfStock = new Date();
    }

    getRFID = () => { return this.RFID; };
    getSKU = () => { return this.sku; };
    getDateOfStock = () => { return this.dateOfStock; };
    
    setRFID = (RFID) => { this.RFID = RFID; };
    setAvailable = (available) => { this.available = available; };
    setDateOfStock = (dateOfStock) => { this.dateOfStock = dateOfStock; };

    isAvailable = () => { return this.available; };

    addTestResult = () => { this.testResult = this.testResult; };

}