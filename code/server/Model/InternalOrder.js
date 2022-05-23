"use strict"

const SKUItem = require('./SKUItem');

class InternalOrder{
    constructor(id, customer, issueDate, state){
        this.id = id;
        this.issueDate = issueDate;
        this.products = [];
        this.internalCustomer = customer;
        this.state = state;
    }

    

    getId = () => { return this.id; }
    
    getIssueDate = () => { return this.issueDate; }
    
    getProducts = () => { return this.products; }
    
    getDeliveredProducts = () => { return this.deliveredProducts; }
    
    getState = () => { return this.state; }

    addProduct = (skuId, price, description, qty, rfid) => {
        if(rfid && this.state === "COMPLETED"){
            this.products.push({SKUId:skuId, description:description, price:price, RFID:rfid});
        }
        else this.products.push({SKUId:skuId, description:description, price:price, qty:qty});
    }
    
    convertToObj = () => {
        /* example:
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3},...],
            "customerId" : 1
        }
        */

        if(this.state === "COMPLETED") 
            return {
                "id" : this.id,
                "issueDate" : this.issueDate.format("YYYY/MM/DD HH:MM"),
                "state" : this.state,
                "products" : this.products.map(p => {return { "SKUid":p.skuId, "description":p.description, "price":p.price, "RFID":p.rfid  }}),
                "customerId" : this.internalCustomer.getId()
            }
        
        return {
           "id" : this.id,
           "issueDate" : this.issueDate.format("YYYY/MM/DD HH:MM"),
           "state" : this.state,
           "products" : this.products.map(p => {return { "SKUid":p.sku.id, "description":p.sku.description, "price":p.sku.price, "qty":p.qty  }}),
           "customerId" : this.internalCustomer.getId()
       }
    }


    //riflettere modifiche su DB
}

module.exports = InternalOrder;