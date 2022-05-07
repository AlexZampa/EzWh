"use strict"

const SKUItem = require('./SKUItem');

class InternalOrder{
    constructor(id, customer, issueDate){
        this.id = id++;
        this.issueDate = issueDate;
        this.products = [];
        this.deliveredProducts = [];
        this.internalCustomer = customer;
        this.state = "ISSUED";
    }

    

    getId = () => { return this.id; }
    
    getIssueDate = () => { return this.issueDate; }
    
    getProducts = () => { return this.products; }
    
    getDeliveredProducts = () => { return this.deliveredProducts; }
    
    getState = () => { return this.state; }
    
    addSKU = (SKU, qty) => { 
        this.products.push({ sku : SKU, qty : qty }); 
    }
    
    addDeliveredProducts = (SKUItemList, ioDAO) => { 
        this.deliveredProducts.concat(SKUItemList);
        ioDAO.addDeliveredProducts(this.id, SKUItemList);
    }
    setStatus = (newState, deliveredProducts, ioDAO) => {
        if (newState === "ISSUED" || newState === "ACCEPTED"
            || newState === "REFUSED" || newState === "CANCELED"
            || newState === "COMPLETED") {
        
            if(newState === "ISSUED"){
                for(const s of this.products){
                    s.sku.decreaseAvailableQty(this.products[s.qty]);
                }               
            } else if(newState === "CANCELED"){
                for(const s of this.products){
                    s.sku.increaseAvailableQty(this.products[s.qty]);
                }
            } else if(newState === "COMPLETED"){
                this.addDeliveredProducts(this.deliveredProducts, ioDAO);
            }            
            this.state = newState;
            ioDAO.setStatus(this.id, newState);

        }
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