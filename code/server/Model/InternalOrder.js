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
                "issueDate" : this.issueDate.format("YYYY/MM/DD HH:mm"),
                "state" : this.state,
                "products" : this.products.map(p => {return { "SKUId":p.SKUId, "description":p.description, "price":p.price, "RFID":p.rfid  }}),
                "customerId" : this.internalCustomer
            }
        
        return {
           "id" : this.id,
           "issueDate" : this.issueDate.format("YYYY/MM/DD HH:mm"),
           "state" : this.state,
           "products" : this.products.map(p => {return { "SKUId":p.SKUId, "description":p.description, "price":p.price, "qty":p.qty  }}),
           "customerId" : this.internalCustomer
       }
    }
}

module.exports = InternalOrder;