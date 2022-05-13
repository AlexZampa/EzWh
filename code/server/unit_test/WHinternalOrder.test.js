"use strict";

const Warehouse = require("../Model/Warehouse");

describe("Add internal order test", () => {
    
    let id = 0;

    const wh = new Warehouse();
    wh.initTest(); //sets all DAO to the corresponding mock db
    
    beforeEach(() => {
        wh.internalOrderDAO.newInternalOrder.mockReset();
        wh.internalOrderDAO.newInternalOrder.mockReturnValue(id);
        id ++;
    });
    
    let products = [
        {SKUId:12, description:"a product", price:10.99, qty:3},
        {SKUId:180, description:"another product", price:11.99, qty:3}
    ];

    testAddInternalOrder("2021/11/29 09:33", products, 1, 0);
    testAddInternalOrder("2021/11/30 03:33", products, 1, 1);

    function testAddInternalOrder(issueDate, products, customerId, expectedResult) {
        test('Add Internal Order', async () => { 
            let result =  await wh.addInternalOrder(products, customerId, issueDate); 
            console.log(result);
            //result = 0;
            expect(result).toBe(expectedResult);
        })
    }
});




