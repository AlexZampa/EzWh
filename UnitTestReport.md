# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

 ### **Class *class_name* - method *name***



**Criteria for method *name*:**
	

 - 
 - 


**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|          |           |
|          |           |
|          |           |
|          |           |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |


**Combination of predicates**:


| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||

-----------------------------------------------------------------------------------------------------
## **Class *UserDAO***

### **Class *UserDAO* - method *newUser***

**Criteria for method *newUser*:**
	
 - User with unique username and type in the DB

**Predicates for method *newUser*:**

| Criteria | Predicate |
| -------- | --------- |
| User with unique username and type in the DB | Yes |
|                                              | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| User with unique username and type in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validUser) -> rowID | Test Create and Get User - testCreateUser |
| No | Invalid| T2(invalidUser) -> error | Test throw err on new User - testCreateUserError |


### **Class *UserDAO* - method *getAllUsers***

**Criteria for method *getAllUsers*:**
	
 - There are Users in the DB

**Predicates for method *getAllUsers*:**

| Criteria | Predicate |
| -------- | --------- |
| There are Users in the DB | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are Users in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test Get All User - testGetAllUsers |
| No  | Valid | T2() -> list | - |


### **Class *UserDAO* - method *getAllUsersByType***

**Criteria for method *getAllUsersByType*:**
	
 - There are Users of given type in the DB

**Predicates for method *getAllUsersByType*:**

| Criteria | Predicate |
| -------- | --------- |
| There are Users of given type in the DB | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are Users of given type in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test Get All User - testGetAllUsersByType |
| No  | Valid | T2() -> list | - |


### **Class *UserDAO* - method *loginUser***

**Criteria for method *loginUser*:**
	
 - pair username and type is in the DB
 - password is correct

**Predicates for method *loginUser*:**

| Criteria | Predicate |
| -------- | --------- |
| pair username and type is in the DB | Yes |
|                   | No  |
| password is correct | Yes |
|                   | No  |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| pair username and type is in the DB | password is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Valid  | T1(validData) -> userData | Test login User - testLoginUser |
| Yes | No  | Invalid | T2(invalidPassword) -> error | Test login User - throw error on invalid password |
| No  | Yes | Invalid | T1(invalidUsername) -> error | Test login User - throw error on user not found |
| No  | No  | Invalid | T2(invalidUser) -> error | - |


### **Class *UserDAO* - method *updateUser***

**Criteria for method *updateUser*:**
	
 - User is in the DB

**Predicates for method *updateUser*:**

| Criteria | Predicate |
| -------- | --------- |
| User is in the DB | Yes |
|                   | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| User is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid  | T1(user) -> 1 | Test Update User - testUpdateUser |
| No  | Invalid | T2() -> 0 | Test Update User - testUpdateUser |


### **Class *UserDAO* - method *deleteUser***

**Criteria for method *deleteUser*:**
	
 - User is in the DB

**Predicates for method *deleteUser*:**

| Criteria | Predicate |
| -------- | --------- |
| User is in the DB | Yes |
|                   | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| User is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid  | T1(user) -> 1 | Test Delete User - testDeleteUser |
| No  | Invalid | T2() -> 0 | Test Delete User- testDeleteUser |


-----------------------------------------------------------------------------------------------------
## **Class *SkuDAO***

### **Class *SkuDAO* - method *getAllSKU***

**Criteria for method *getAllSKU*:**
	
 - There are SKUs in the DB

**Predicates for method *getAllSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUs in the DB | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are SKUs in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test Get All SKU - testGetAllSKU |
| No | Valid| T2() -> list | - |


### **Class *SkuDAO* - method *getSKU***

**Criteria for method *getSKU*:**
	
 - SKU is in the DB

**Predicates for method *getSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| SKU is in the DB | Yes |
|                  | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKU is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validSKUid) -> SKU | Test Create and Get SKU - testGetSKU |
| No | Invalid| T2(invalidSKUid) -> error | Test throw err on get SKU - testGetSKUerror |


### **Class *SkuDAO* - method *updateSKU***

**Criteria for method *updateSKU*:**
	
 - SKU is in the DB

**Predicates for method *updateSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| SKU is in the DB | Yes |
|                  | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKU is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validSKUid) -> 1 | Test Update SKU - testUpdateSKU |
| No | Invalid| T2(invalidSKUid) -> 0 | Test Update SKU - testUpdateSKU |


### **Class *SkuDAO* - method *deleteSKU***

**Criteria for method *deleteSKU*:**
	
 - SKU is in the DB

**Predicates for method *deleteSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| SKU is in the DB | Yes |
|                  | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKU is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validSKUid) -> 1 | Test Delete SKU - testDeleteSKU |
| No | Invalid| T2(invalidSKUid) -> 0 | Test Delete SKU - testDeleteSKU |


-----------------------------------------------------------------------------------------------------
## **Class *PositionDAO***

### **Class *PositionDAO* - method *newPosition***

**Criteria for method *newPosition*:**
	
 - positionID is unique in the DB

**Predicates for method *newPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| positionID is unique in the DB | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| positionID is unique in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validPositionID) -> rowID | Test Create and Get Position - testCreatePosition |
| No | invalid| T2(invalidPositionID) -> error | Test throw err on get and new Position - testCreatePositionError |


### **Class *PositionDAO* - method *getAllPosition***

**Criteria for method *getAllPosition*:**
	
 - There are Position in the DB

**Predicates for method *getAllPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| There are Position in the DB | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are Position in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test Get All Position - testGetAllPosition |
| No | Valid| T2() -> list | - |


### **Class *PositionDAO* - method *getPosition***

**Criteria for method *getPosition*:**
	
 - Position is in the DB

**Predicates for method *getPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| Position is in the DB| Yes |
|                      | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| Position is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validPositionID) -> Position | Test Create and Get Position - testGetPosition |
| No | Invalid| T2(invalidPositionID) -> error | Test throw err on get and new Position - testGetPositionError |


### **Class *PositionDAO* - method *updatePosition***

**Criteria for method *updatePosition*:**
	
 - newPositionID does not exist in the DB

**Predicates for method *updatePosition*:**

| Criteria | Predicate |
| -------- | --------- |
| newPositionID does not exist in the DB | Yes |
|                                        | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| newPositionID does not exist in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validNewPositionID) -> 1 | Test Update Position - testUpdatePosition |
| No | Invalid| T2(invalidNewPositionID) -> error | Test Update Position - testUpdatePositionError |


### **Class *PositionDAO* - method *deletePosition***

**Criteria for method *deletePosition*:**
	
 - Position is in the DB

**Predicates for method *deletePosition*:**

| Criteria | Predicate |
| -------- | --------- |
| Position is in the DB | Yes |
|                       | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| Position is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validPositionID) -> 1 | Test Delete Position - testDeletePosition |
| No | Invalid| T2(invalidPositionID) -> 0 | Test Delete Position - testDeletePosition |


-----------------------------------------------------------------------------------------------------
## **Class *SkuItemDAO***

### **Class *SkuItemDAO* - method *newSKUItem***

**Criteria for method *newSKUItem*:**
	
 - There are no SKUItems in the DB

**Predicates for method *newSKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| There are no SKUItems in the DB with the same id | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are no SKUItems in the DB with the same id | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test Create and Get SKUItem - testCreateSKUItem |
| No | Invalid| T2() -> list | Test Create and Get SKUItem - testCreateSKUItem |

### **Class *SkuItemDAO* - method *getAllSKUItems***

**Criteria for method *getAllSKUItems*:**
	
 - There are SKUItems in the DB

**Predicates for method *getAllSKUItems*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUItems in the DB | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are SKUItems in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test Get All SKUItems - testGetAllSKUItem |
| No | Valid| T2() -> list | - |


### **Class *SkuItemDAO* - method *getSKUItem***

**Criteria for method *getSKUItem*:**
	
 - SKUItem is in the DB

**Predicates for method *getSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| SKUItem is in the DB | Yes |
|                  | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKUItem is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validSKUItemid) -> SKU | Test Create and Get SKUItem - testGetSKUItem |
| No | Invalid| T2(invalidSKUItemid) -> error | Test throw err on get SKUItem - testGetSKUItemerror |


### **Class *SkuItemDAO* - method *updateSKUItem***

**Criteria for method *updateSKUItem*:**
	
 - SKUItem is in the DB

**Predicates for method *updateSKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| SKUItem is in the DB | Yes |
|                  | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKUItem is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validSKUItemid) -> 1 | Test Update SKUItem - testUpdateSKUItem |
| No | Invalid| T2(invalidSKUItemid) -> 0 | Test Update SKUItem - testUpdateSKUItem |


### **Class *SkuItemDAO* - method *deleteSKUItem***

**Criteria for method *deleteSKUItem*:**
	
 - SKUItem is in the DB

**Predicates for method *deleteSKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| SKUItem is in the DB | Yes |
|                  | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKUItem is in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validSKUItemid) -> 1 | Test Delete SKUItem - testDeleteSKUItem |
| No | Invalid| T2(invalidSKUItemid) -> 0 | Test Delete SKUItem - testDeleteSKUItem |


-----------------------------------------------------------------------------------------------------
## **Class *RestockOrderDAO***

### **Class *RestockOrderDAO* - method *newRestockOrder***

**Criteria for method *newRestockOrder*:**
	
 - There are SKUs in the DB

**Predicates for method *newRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are SKUs in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test Create and Get RestockOrder - testCreateRestockOrder |
| No | Invalid| T2() -> list | Test Create and Get RestockOrder - testCreateRestockOrder |



### **Class *RestockOrderDAO* - method *getRestockOrder***

**Criteria for method *getRestockOrder*:**
	
 - There is a RestockOrder with the same id in the DB

**Predicates for method *getRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| There is a RestockOrder with the same id in the DB | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There is a RestockOrder with the same id in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validRestockOrderid) -> list | Test Create and Get RestockOrder - testGetRestockOrder |
| No | Invalid| T2(invalidRestockOrderid) -> list | Test throw err on get RestockOrder - testGetRestockOrdererror |


### **Class *RestockOrderDAO* - method *getAllRestockOrders***

**Criteria for method *getAllRestockOrders*:**
	
 - There are RestockOrder in the DB

**Predicates for method *getAllRestockOrders*:**

| Criteria | Predicate |
| -------- | --------- |
| There are RestockOrder in the DB | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are RestockOrder in the DB | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test Get All RestockOrder - testGetAllRestockOrder |
| No | Invalid| T2() -> list | Test Get All RestockOrder - testGetAllRestockOrder |

### **Class *RestockOrderDAO* - method *updateRestockOrder***

**Criteria for method *updateRestockOrder*:**
	
 - There is a RestockOrder in the DB with the same id

**Predicates for method *updateRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| There is a RestockOrder in the DB with the same id | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There is a RestockOrder in the DB with the same id | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validRestockOrderid) -> list | Test Update RestockOrder - testGetAllRestockOrder |
| No | Invalid| T2(invalidRestockOrderid) -> list | Test Update RestockOrder - testGetAllRestockOrder |

### **Class *RestockOrderDAO* - method *deleteRestockOrder***

**Criteria for method *deleteRestockOrder*:**
	
 - There is a RestockOrder in the DB with the same id

**Predicates for method *deleteRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| There is a RestockOrder in the DB with the same id | Yes |
|                           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There is a RestockOrder in the DB with the same id | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1(validRestockOrderid) -> list |Test Delete RestockOrder - testDeleteRestockOrder |
| No | Invalid| T2(invalidRestockOrderid) -> list | Test Delete RestockOrder - testDeleteRestockOrder |

----------------------------------------------------------------------------------------------------------------------------
### **Class *InternalOrderDAO* - method *newInternalOrder***



**Criteria for method *newInternalOrder*:**
	
 - *issueDate* properly formatted


**Predicates for method *newInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  *issueDate* properly formatted        | yes          |
|          | no          |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1(validDate) -> ok | Test Create and Get Internal Order|
| no | invalid | T2(invalidDate) -> 422 | Test Create and Get Internal Order|

----------------------------------------------------------------------------------------------------------------------------
### **Class *InternalOrderDAO* - method *getAllInternalOrders***



**Criteria for method *getAllInternalOrders*:**
	
 - Some internalOrders are in the DB


**Predicates for method *getAllInternalOrders*:**

| Criteria | Predicate |
| -------- | --------- |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1() -> ok | Test Create and Get Internal Order - Test Get all Internal Orders|

----------------------------------------------------------------------------------------------------------------------------
### **Class *InternalOrderDAO* - method *getAllIssued***



**Criteria for method *getAllIssued*:**
	
 - Some internalOrder issued are in the DB


**Predicates for method *getAllIssued*:**

| Criteria | Predicate |
| -------- | --------- |
**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1() -> ok | Test Get All Internal Order Issued|

-----------------------------------------------------------------------------------------------------
### **Class *InternalOrderDAO* - method *getAllAccepted***



**Criteria for method *getAllAccepted*:**
	
 - Some internalOrder accepted are in the DB


**Predicates for method *getAllAccepted*:**

| Criteria | Predicate |
| -------- | --------- |
**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1() -> ok | Test Get All Internal Order Accepted|

-----------------------------------------------------------------------------------------------------
### **Class *InternalOrderDAO* - method *getInternalOrder***



**Criteria for method *getInternalOrder*:**
	
 - ID is a positive number
 - An internalOrder with ID is stored in the db


**Predicates for method *getInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| ID is a positive number | ID is a positive number |
| | ID is a negative number |
| | ID is not a number |
| An internalOrder with ID is stored in the db | yes |
| | no |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria 1 | Criteria 2 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| ID is a positive number | any | valid | validity checked by ControllerInternalOrder | - |
| - | yes | valid | T1(ID) -> internalOrder | Test Create and Get Internal Order |
| - | no | valid | T2(ID) -> 404 | Test throw err on get Internal Order |

-----------------------------------------------------------------------------------------------------
### **Class *InternalOrderDAO* - method *addDeliveredProducts***



**Criteria for method *addDeliveredProducts*:**
	
 - An internalOrder with ID is stored in the db
 - For each delivered product, the internalOrder already contains a product with the same SKUId 


**Predicates for method *addDeliveredProducts*:**

| Criteria | Predicate |
| -------- | --------- |
| For each delivered product, the internalOrder already contains a product with the same SKUId | yes |
| | no |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1(ID, SKUItemList) -> OK | Test add delivered products to a completed Internal Order |
| no | invalid | T2(ID, SKUItemList) -> err | Test add delivered products to a completed Internal Order |

-----------------------------------------------------------------------------------------------------
### **Class *InternalOrderDAO* - method *setStatus***



**Criteria for method *setStatus*:**
	
 - newState is among the valid states


**Predicates for method *setStatus*:**

| Criteria | Predicate |
| -------- | --------- |
| newState is among the valid states | yes |
| | no |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1(ID, newState) -> OK | Test update Internal Order state |
| no | invalid | T2(ID, newState) -> 422 | Test update Internal Order state |

-----------------------------------------------------------------------------------------------------
### **Class *InternalOrderDAO* - method *deleteInternalOrder***



**Criteria for method *deleteInternalOrder*:**
	
 - An internalOrder with ID is stored in the db


**Predicates for method *deleteInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| An internalOrder with ID is stored in the db | yes |
| | no |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1(ID) -> OK | Test Delete Internal Order |
| no | invalid | T2(ID) -> 404 | Test Delete Internal Order |

-----------------------------------------------------------------------------------------------------
### **Class *ReturnOrderDAO* - method *newReturnOrder***



**Criteria for method *newReturnOrder*:**
	
 - A restockOrder with id=restockOrderId exists in the db


**Predicates for method *newReturnOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| A restockOrder with id=restockOrderId exists in the db | yes |
| | no |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1(ID) -> OK | Test Create and Get Return Order |
| no | invalid | T2(ID) -> 404 | Test Create and Get Return Order |

-----------------------------------------------------------------------------------------------------
### **Class *ReturnOrderDAO* - method *getReturnOrderById***



**Criteria for method *getReturnOrderById*:**
	
 - A returnOrder with ID is stored in the db


**Predicates for method *getReturnOrderById*:**

| Criteria | Predicate |
| -------- | --------- |
| A returnOrder with ID is stored in the db | yes |
| | no |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1(ID) -> OK | Test Create and Get Return Order |
| no | valid | T2(ID) -> 404 | Test throw err on get Return Order |

-----------------------------------------------------------------------------------------------------
### **Class *ReturnOrderDAO* - method *getAllReturnOrders***



**Criteria for method *getAllReturnOrders*:**
	
 - Some returnOrder stored in the db


**Predicates for method *getAllReturnOrders*:**

| Criteria | Predicate |
| -------- | --------- |
| Some returnOrder stored in the db | yes |
| | no |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1() -> list | Test Get All Return Orders |
| no | valid | T2() -> emptyList | Test Get All Return Orders |

-----------------------------------------------------------------------------------------------------
### **Class *ReturnOrderDAO* - method *deleteReturnOrder***



**Criteria for method *deleteReturnOrder*:**
	
 - A returnOrder with ID is stored in the db


**Predicates for method *deleteReturnOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| A returnOrder with ID is stored in the db | yes |
| | no |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:


| Criteria | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| yes | valid | T1(ID) -> OK | Test Delete Return Order |
| no | valid | T2(ID) -> 404 | Test Delete Return Order |

-----------------------------------------------------------------------------------------------------
## **Class *Warehouse***

### **Class *Warehouse* - method *addSKU***

**Criteria for method *addSKU*:**
	
- weight is positive
- volume is positive
- price is positive
- availableQuantity is positive

**Predicates for method *addSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| weight is positive | Yes |
|                    | No |
| volume is positive | Yes |
|                    | No |
| price is positive | Yes |
|                    | No |
| availableQuantity is positive | Yes |
|                               | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| weight is positive | volume is positive | price is positive | availableQuantity is positive | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Yes | Yes | Valid   | T1(validData) -> rowID | Test add SKU - testAddSKU |
| No  | Yes | Yes | Yes | Invalid | T2(invalidWeight) -> error | Test add SKU - testAddSKUError |
| Yes | No  | Yes | Yes | Invalid | T3(invalidVolume) -> error | Test add SKU - testAddSKUError |
| Yes | Yes | No  | Yes | Invalid | T4(invalidPrice) -> error | Test add SKU - testAddSKUError |
| Yes | Yes | Yes | No  | Invalid | T5(invalidQty) -> error | Test add SKU - testAddSKUError |


### **Class *Warehouse* - method *getSKUs***

**Criteria for method *getSKUs*:**

- There are SKUs with TestDescriptors

**Predicates for method *getSKUs*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUs with TestDescriptors | Yes |
|                                     | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are SKUs with TestDescriptors | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test get all SKU - testGetAllSKU |
| No | Valid | T2() -> list | - |


### **Class *Warehouse* - method *getSKU***

**Criteria for method *getSKU*:**
	
- weight is positive
- volume is positive
- price is positive
- availableQuantity is positive

**Predicates for method *getSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKU with TestDescriptors | Yes |
|                                     | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are SKU with TestDescriptors | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> SKU | Test get SKU - testGetSKU |
| No | Valid | T2() -> SKU  | Test get SKU - testGetSKU |


### **Class *Warehouse* - method *modifySKU***

**Criteria for method *modifySKU*:**
	
- sku exists
- sku has position
- weight is positive
- volume is positive
- price is positive
- availableQuantity is positive
- position can store SKU

**Predicates for method *modifySKU*:**

| Criteria | Predicate |
| -------- | --------- |
| sku exists | Yes |
|             | No |
| sku has position | Yes |
|             | No |
| weight is positive | Yes |
|             | No |
| volume is positive | Yes |
|             | No |
| price is positive | Yes |
|             | No |
| availableQuantity is positive | Yes |
|             | No |
| position can store SKU | Yes |
|             | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| sku exists | sku has position | weight is positive | volume is positive | price is positive | availableQuantity is positive | position can store SKU | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Yes |  Yes | Yes | Yes | Yes | Valid   | T1(validData) -> changes | Test modify SKU - Test modify - Modify SKU with Position |
| Yes | No  | Yes |  Yes | Yes | Yes | Yes | Valid   | T2(validData) -> changes | Test modify SKU - Test modify - Modify SKU without position |
| No  | Yes | Yes |  Yes | Yes | Yes | Yes | Invalid | T3(invalidSKUid) -> error | Test modify SKU - Test Errors - testModifySKUError |
| Yes | Yes | No  |  Yes | Yes | Yes | Yes | Invalid | T4(invalidWeight) -> error | Test modify SKU - Test Errors - testModifySKUError |
| Yes | Yes | Yes |  No  | Yes | Yes | Yes | Invalid | T5(invalidVolume) -> error | Test modify SKU - Test Errors - testModifySKUError |
| Yes | Yes | Yes |  Yes | No  | Yes | Yes | Invalid | T6(invalidPrice) -> error | Test modify SKU - Test Errors - testModifySKUError |
| Yes | Yes | Yes |  Yes | Yes | No  | Yes | Invalid | T1(invalidQuantity) -> error | Test modify SKU - Test Errors - testModifySKUError |
| Yes | Yes | Yes |  Yes | Yes | Yes | No  | Invalid | T1(invalidData) -> error | Test modify SKU - Test Errors - testModifySKUError|


### **Class *Warehouse* - method *modifySKUposition***

**Criteria for method *modifySKUposition*:**
	
- SKU has already a position
- position can store SKU

**Predicates for method *modifySKUposition*:**

| Criteria | Predicate |
| -------- | --------- |
| SKU has already a position | Yes |
|                            | No  |
| position can store SKU     | Yes |
|                            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKU has already a position | position can store SKU | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1() -> changes | Test modify SKU position - Test modify SKU with position - Modify position of SKU |
| Yes | No  | Invalid | T2() -> error   | Test modify SKU position - Test modify SKU with position - Modify position of SKU |
| No  | Yes | Valid   | T3() -> changes | Test modify SKU position - Test modify SKU without position - Modify position of SKU |
| No  | No  | Invalid | T4() -> error   | Test modify SKU position - Test modify SKU without position - Modify position of SKU |


### **Class *Warehouse* - method *modifySKUposition***

**Criteria for method *modifySKUposition*:**
	
- SKU has already a position
- position can store SKU

**Predicates for method *modifySKUposition*:**

| Criteria | Predicate |
| -------- | --------- |
| SKU has already a position | Yes |
|                            | No  |
| position can store SKU     | Yes |
|                            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKU has already a position | position can store SKU | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1() -> changes | Test modify SKU position - Test modify SKU with position - Modify position of SKU |
| Yes | No  | Invalid | T2() -> error   | Test modify SKU position - Test modify SKU with position - Modify position of SKU |
| No  | Yes | Valid   | T3() -> changes | Test modify SKU position - Test modify SKU without position - Modify position of SKU |
| No  | No  | Invalid | T4() -> error   | Test modify SKU position - Test modify SKU without position - Modify position of SKU |


### **Class *Warehouse* - method *deleteSKU***

**Criteria for method *deleteSKU*:**
	
- SKU exists
- SKU has position

**Predicates for method *deleteSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| SKU exists | Yes |
|            | No  |
| SKU has position | Yes |
|                   | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKU exists | SKU has position | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1(validSKUid) -> changes | Test delete SKU - Update position after delete SKU |
| Yes | No  | Invalid | T2(validSKUid) -> error   | Test modify SKU position - Delete SKU without position |
| No  | Yes | Invalid | T3(invalidSKUid) -> error | Test modify SKU position - testDeleteSKUError |


### **Class *Warehouse* - method *addPosition***

**Criteria for method *addPosition*:**
	
- positionID is valid
- maxWeight is positive
- maxVolume is positive

**Predicates for method *addPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| positionID is valid | Yes |
|                    | No |
| maxWeight is positive | Yes |
|                    | No |
| maxVolume is positive | Yes |
|                    | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| positionID is valid | maxWeight is positive | maxVolume is positive | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Yes | Valid   | T1(validData) -> rowID | Test add Position - testAddPosition |
| Yes | No  | Yes | Invalid | T2(invalidWeight) -> error | Test add Position - testAddPositionError |
| Yes | Yes | No  | Invalid | T3(invalidVolume) -> error | Test add Position - testAddSKUError |
| No  | Yes | Yes | Invalid | T4(invalidPositionID) -> error | Test add Position - testAddSKUError |



### **Class *Warehouse* - method *modifyPosition***

**Criteria for method *modifyPosition*:**
	
- Position exists
- aisle length is 4
- row length is 4
- col length is 4
- maxWeight is positive
- maxVolume is positive

**Predicates for method *modifyPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| Position exists   | Yes |
|                   | No  |
| aisle length is 4 | Yes |
|                   | No  |
| row length is 4   | Yes |
|                   | No  |
| col length is 4   | Yes |
|                   | No  |
| maxWeight is positive | Yes |
|                   | No  |
| maxVolume is positive | Yes |
|                   | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| Position exists | aisle length is 4 | row length is 4 | col length is 4 | maxWeight is positive |  maxVolume is positive | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Yes | Yes | Yes | Yes | Valid   | T1() -> changes | Test modify Position - Test modify |
| Yes | No  | Yes | Yes | Yes | Yes | Invalid | T2() -> error   | Test modify Position - Test Errors - testModifyPositionError |
| Yes | Yes | No  | Yes | Yes | Yes | Invalid | T3() -> error   | Test modify Position - Test Errors - testModifyPositionError |
| Yes | Yes | Yes | No  | Yes | Yes | Invalid | T4() -> error   | Test modify Position - Test Errors - testModifyPositionError |
| Yes | Yes | Yes | Yes | No  | Yes | Invalid | T5() -> error   | Test modify Position - Test Errors - testModifyPositionError |
| Yes | Yes | Yes | Yes | Yes | No  | Invalid | T6() -> error   | Test modify Position - Test Errors - testModifyPositionError |


### **Class *Warehouse* - method *modifyPositionID***

**Criteria for method *modifyPositionID*:**
	
- Position exists
- newPositionID is valid
- newPositionID is unique

**Predicates for method *modifyPositionID*:**

| Criteria | Predicate |
| -------- | --------- |
| Position exists   | Yes |
|                   | No  |
| newPositionID is valid | Yes |
|                   | No  |
| newPositionID is unique | Yes |
|                   | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| Position exists | newPositionID is valid | newPositionID is unique | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Yes | Valid   | T1() -> changes | "Test modify positionID of Position - Test modify |
| Yes | No  | Yes | Invalid | T2() -> error   | "Test modify positionID of Position - Test Errors - testModifyPositionIDError |
| Yes | Yes | No  | Invalid | T3() -> error   | "Test modify positionID of Position - Test Errors - testModifyPositionIDError |
| No  | Yes | Yes | Invalid | T4() -> error   | "Test modify positionID of Position - Test Errors - testModifyPositionIDError |


### **Class *Warehouse* - method *deletePosition***

**Criteria for method *deletePosition*:**
	
- Position exists


**Predicates for method *deletePosition*:**

| Criteria | Predicate |
| -------- | --------- |
| Position exists   | Yes |
|                   | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| Position exists | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| Yes | Valid   | T1(validPositionID) -> changes | Test delete Position |
| No  | Invalid | T2(invalidPositionID) -> error | Test delete Position - testDeletePositionError|


### **Class *Warehouse* - method *addUser***

**Criteria for method *addUser*:**
	
- username is an email 
- password length is > 8 characters
- type exists
- type is different from manager/administrator


**Predicates for method *addUser*:**

| Criteria | Predicate |
| -------- | --------- |
| username is an email  | Yes |
|                      | No  |
| password length is > 8 characters | Yes |
|                      | No  |
| type exists   | Yes |
|               | No  |
| type is different from manager/administrator |Yes |
|                      | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| username is an email | password length is > 8 characters | type exists | type is different from manager/administrator | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Yes | Yes | Valid   | T1(validData) -> rowID | Test add User - testAddUser |
| Yes | Yes | Yes | No  | Invalid | T2(AdminType) -> error | Test add User - testAddUserError |
| Yes | Yes | No  | Yes | Invalid | T3(invalidType) -> error | Test add User - testAddUserError |
| Yes | No  | Yes | Yes | Invalid | T4(invalidPwd) -> error | Test add User - testAddUserError |
| No  | Yes | Yes | Yes | Invalid | T5(invalidUsername) -> error | Test add User - testAddUserError |



### **Class *Warehouse* - method *getUsers***

**Criteria for method *getUsers*:**
	
- a manager exists


**Predicates for method *getUsers*:**

| Criteria | Predicate |
| -------- | --------- |
| a manager exists  | Yes |
|                   | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| a manager exists | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid   | T1() -> list | Test get all Users except managers - Get all Users |
| No  | Valid   | T2() -> list | - |


### **Class *Warehouse* - method *getSuppliers***

**Criteria for method *getSuppliers*:**
	
- There are suppliers


**Predicates for method *getSuppliers*:**

| Criteria | Predicate |
| -------- | --------- |
| There are suppliers  | Yes |
|                   | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are suppliers | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid   | T1() -> list | Test get all Suppliers - Get all suppliers |
| No  | Valid   | T2() -> list | - |


### **Class *Warehouse* - method *login***

**Criteria for method *login*:**
	
- pair username and type exists
- password is correct

**Predicates for method *login*:**

| Criteria | Predicate |
| -------- | --------- |
| pair username and type exists  | Yes |
|                                | No  |
| password is correct | Yes |
|                   | No  |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| pair username and type exists  | password is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1() -> user  | Test login User - valid login |
| Yes | Yes | Valid   | T2() -> error | Test login User - throw error on invalid password |
| No  | Yes | Valid   | T3() -> error | - |



### **Class *Warehouse* - method *modifyUserRights***

**Criteria for method *modifyUserRights*:**
	
- pair username and type exists
- type exists
- type is different from manager/administrator

**Predicates for method *modifyUserRights*:**

| Criteria | Predicate |
| -------- | --------- |
| pair username and type exists  | Yes |
|                                | No  |
| type exists | Yes |
|                   | No  |
| type is different from manager/administrator | Yes |
|                   | No  |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| pair username and type exists  | type exists | type is different from manager/administrator | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Yes | Valid   | T1() -> changes | Test modify User rights - Test modify rights - testModifyUserRights |
| Yes | Yes | No  | Invalid | T2() -> error   | Test modify User rights - Test Errors - testModifyUserRightsError |
| Yes | No  | Yes | Invalid | T3() -> error   | Test modify User rights - Test Errors - testModifyUserRightsError |
| No  | Yes | No  | Invalid | T4() -> error   | Test modify User rights - Test Errors - testModifyUserRightsError |


### **Class *Warehouse* - method *deleteUser***

**Criteria for method *deleteUser*:**
	
- pair username and type exists
- type is different from manager/administrator

**Predicates for method *deleteUser*:**

| Criteria | Predicate |
| -------- | --------- |
| pair username and type exists  | Yes |
|                                | No  |
| type is different from manager/administrator | Yes |
|                   | No  |


**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| pair username and type exists | type is different from manager/administrator | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1() -> changes  | Test delete User - delete user |
| Yes | No  | Invalid | T2() -> error    | Test delete User - testDeleteUserError |
| No  | Yes | Invalid | T3() -> error    | Test delete User - testDeleteUserError |

### **Class *Warehouse* - method *addSKUItem***

**Criteria for method *addSKUItem*:**
	
- date is valid

**Predicates for method *addSKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| date is valid | Yes |
|                    | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| date is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| Yes | Valid   | T1(validData) -> rowID | Test add SKUItem - testAddSKU |
| No  |  Invalid | T2(invalidDate) -> error | Test add SKU - testAddSKUItemError |


### **Class *Warehouse* - method *getSKUItems***

**Criteria for method *getSKUItems*:**

- There are SKUItems

**Predicates for method *getSKUItems*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUItems | Yes |
|                                     | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There are SKUItems | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> list | Test get all SKUItem - testGetAllSKUItem |
| No | Valid | T2() -> list | - |


### **Class *Warehouse* - method *getSKUItem***

**Criteria for method *getSKUItem*:**
	
- There is a SKUItem with valid ID

**Predicates for method *getSKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| There is a SKUItem with valid ID | Yes |
|                                     | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| There is a SKUItem with valid ID | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| Yes | Valid | T1() -> SKUItem | Test get SKUItem - testGetSKUItem |
| No | Valid | T2() -> SKUItem  | Test get SKUItem - testGetSKUItem |


### **Class *Warehouse* - method *modifySKUItem***

**Criteria for method *modifySKUItem*:**
	
- skuitem exists
- newDate is valid

**Predicates for method *modifySKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| skuitem exists | Yes |
|             | No |
| newDate is valid | Yes |
|             | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| skuitem exists | newDate is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1(validDate) -> changes | Test modify SKUItem - Test modify - Modify SKU with valid Date |
| Yes | No  | Valid   | T2(validDate) -> changes | Test modify SKUItem - Test modify - Modify SKU with invalid Date |


### **Class *Warehouse* - method *deleteSKUItem***

**Criteria for method *deleteSKUItem*:**
	
- SKUitem exists

**Predicates for method *deleteSKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| SKUitem exists | Yes |
|            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| SKU exists | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Valid   | T1(validSKUItemid) -> changes | Test delete SKU |
| No | Invalid | T2(InvalidSKUItemid) -> error   | Test delete SKU - throw error on SKUItem not found |

### **Class *Warehouse* - method *newRestockOrder***

**Criteria for method *newRestockOrder*:**
	
- Supplier exists
- Date is valid

**Predicates for method *newRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| Supplier exists | Yes |
|            | No  |
| Date is valid | Yes |
|            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| Supplier exists | Date is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1() -> RestockOrder | Test add RestockOrder - testAddRestockOrder |
| No | Yes | Invalid | T2() -> error   | Test add RestockOrder - testAddRestockOrderError |
| Yes | No | Invalid | T2() -> error   | Test add RestockOrder - testAddRestockOrderError |

### **Class *Warehouse* - method *getAllRestockOrders***

**Criteria for method *getAllRestockOrders*:**
	
- RestockOrders exist

**Predicates for method *getAllRestockOrders*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrders exist | Yes |
|            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| Supplier exists |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Valid   | T1() -> RestockOrders | Test get all RestockOrders - testGetAllRestockOrders |
| No | Invalid | T2() -> error   |  |

### **Class *Warehouse* - method *getRestockOrdersIssued***

**Criteria for method *getRestockOrdersIssued*:**
	
- RestockOrders exist

**Predicates for method *getRestockOrdersIssued*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrders exist | Yes |
|            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| Supplier exists |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Valid   | T1() -> RestockOrders | Test get all RestockOrders Issued - testGetRestockOrdersIssued |
| No | Invalid | T2() -> error   |  |

### **Class *Warehouse* - method *getRestockOrder***

**Criteria for method *getRestockOrder*:**
	
- RestockOrder with same id exists

**Predicates for method *getRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrder with same id exists | Yes |
|            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| RestockOrder with same id exists | Date is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Valid   | T1(validRestockOrderID) -> RestockOrder | Test get RestockOrder - testGetRestockOrder |
| No | Invalid | T2() -> error   |  |

### **Class *Warehouse* - method *modifyRestockOrderState***

**Criteria for method *modifyRestockOrderState*:**
	
- RestockOrder with same id exists
- newState is valid

**Predicates for method *modifyRestockOrderState*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrder with same id exists | Yes |
|            | No  |
| newState is valid | Yes |
|            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| RestockOrder with same id exists | newState is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1(validRestockOrderID) -> ok | Test Modify RestockOrder - Modify RestockOrder |
| No | Yes | Invalid | T2() -> error   |  |
| Yes | No | Invalid | T2(validRestockOrderID) -> error   | Test Modify RestockOrder - testModifyRestockOrderError |

### **Class *Warehouse* - method *restockOrderAddTransportNote***

**Criteria for method *restockOrderAddTransportNote*:**
	
- RestockOrder with same id exists
- Date is right format
- Shipping date is after RestockOrder Date

**Predicates for method *restockOrderAddTransportNote*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrder with same id exists | Yes |
|            | No  |
| Date is right format | Yes |
|            | No  |
| Shipping date is after RestockOrder Date | Yes |
|           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| RestockOrder with same id exists | Date is right format | Shipping date is after RestockOrder Date | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| Yes | Yes | Yes | Valid   | T1(validRestockOrderID) -> ok | Test Modify RestockOrder - Add TransportNote to RestockOrder |
| No | Yes | Yes | Invalid | T2() -> error   |  |
| Yes | No | Yes | Invalid | T2(validRestockOrderID) -> error   | Test Modify RestockOrder - testAddTransportNoteError |
| Yes | Yes | No | Invalid | T2(validRestockOrderID) -> error   | Test Modify RestockOrder - testAddTransportNoteError |

### **Class *Warehouse* - method *restockOrderAddSKUItems***

**Criteria for method *restockOrderAddSKUItems*:**
	
- RestockOrder with same id exists
- RestockOrder State is delivered
- SKUItem is valid

**Predicates for method *restockOrderAddSKUItems*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrder with same id exists | Yes |
|            | No  |
| RestockOrder State is delivered | Yes |
|            | No  |
| SKUItem is valid | Yes |
|           | No |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| RestockOrder with same id exists | RestockOrder State is delivered | SKUItem is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| Yes | Yes | Yes | Valid   | T1(validRestockOrderID) -> ok | Test Modify RestockOrder - Add SKUItems to RestockOrder |
| No | Yes | Yes | Invalid | T2() -> error   |  |
| Yes | No | Yes | Invalid | T2(validRestockOrderID) -> error   | Test Modify RestockOrder - testrestockOrderAddSKUItemsError |
| Yes | Yes | No | Invalid | T2(validRestockOrderID) -> error   | Test Modify RestockOrder - testrestockOrderAddSKUItemsError |

### **Class *Warehouse* - method *returnItemsFromRestockOrder***

**Criteria for method *returnItemsFromRestockOrder*:**
	
- RestockOrder with same id exists
- RestockOrder State is COMPLETEDRETURN

**Predicates for method *returnItemsFromRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrder with same id exists | Yes |
|            | No  |
| RestockOrder State is COMPLETEDRETURN | Yes |
|            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| RestockOrder with same id exists | RestockOrder State is COMPLETEDRETURN | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1(validRestockOrderID) -> ok | Test return Items From RestockOrder - testReturnItemsFromRestockOrder |
| No | Yes | Invalid | T2() -> error   |  |
| Yes | No | Invalid | T2(validRestockOrderID) -> error   | Test return Items From RestockOrder - testReturnItemsFromRestockOrderError |

### **Class *Warehouse* - method *deleteRestockOrder***

**Criteria for method *deleteRestockOrder*:**
	
- RestockOrder with same id exists
- RestockOrder is not present in a SKUitem

**Predicates for method *deleteRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrder with same id exists | Yes |
|            | No  |
| RestockOrder is not present in a SKUitem | Yes |
|            | No  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| RestockOrder with same id exists | RestockOrder is not present in a SKUitem | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| Yes | Yes | Valid   | T1(validRestockOrderID) -> ok | Test Delete RestockOrder - Delete RestockOrder |
| No | Yes | Invalid | T2(invalidRestockOrderID) -> error   | Delete RestockOrder - testDeleteRestockOrderError |
| Yes | No | Invalid | T2(validRestockOrderID) -> error   | Delete RestockOrder - testDeleteRestockOrderError |

### **Class *Warehouse* - method *addReturnOrder***

**Criteria for method *addReturnOrder*:**
	
- RestockOrder with id=restockOrderId exists

**Predicates for method *addReturnOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| RestockOrder with id=restockOrderId exists | yes |
| | no |



**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |


**Combination of predicates**:

| RestockOrder with id=restockOrderId exists | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| Yes | Valid  | T1() -> ok | Add return order test |
| No | Valid | T2() -> error   | Add return order test |

### **Class *Warehouse* - method *getReturnOrders***

**Criteria for method *getReturnOrders*:**

- returnOrders exist
	
**Predicates for method *getReturnOrders*:**

| Criteria | Predicate |
| -------- | --------- |
| returnOrders exist | yes |
| | no |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| returnOrders exist | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| Yes | Valid  | T1() -> ok | Get all return orders test |
| No | Valid | T2() -> error   | Get all return orders test |

### **Class *Warehouse* - method *getReturnOrderById***

**Criteria for method *getReturnOrderById*:**

- returnOrders with id=ID exists
	
**Predicates for method *getReturnOrderById*:**

| Criteria | Predicate |
| -------- | --------- |
| returnOrders with id=ID exists | yes |
| | no |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| returnOrders with id=ID exists | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| Yes | Valid  | T1() -> ok | Get return order test |
| No | Valid | T2() -> error   | Get return order test |

### **Class *Warehouse* - method *deleteReturnOrder***

**Criteria for method *deleteReturnOrder*:**

- returnOrders with id=ID exists
	
**Predicates for method *deleteReturnOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| returnOrders with id=ID exists | yes |
| | no |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| returnOrders with id=ID exists | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| Yes | Valid  | T1() -> ok | Delete return order test |
| No | Valid | T2() -> error   | Delete return order test |

### **Class *Warehouse* - method *addInternalOrder***

**Criteria for method *addInternalOrder*:**

- none (other units are in charge to verify constraints)
	
**Predicates for method *addInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| - | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
|  | Valid  | T1() -> ok | Add internal order test |

### **Class *Warehouse* - method *getInternalOrders***

**Criteria for method *getInternalOrders*:**

- none (other units are in charge to verify constraints)
	
**Predicates for method *getInternalOrders*:**

| Criteria | Predicate |
| -------- | --------- |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| - | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
|  | Valid  | T1() -> ok | Get all internal orders test |

### **Class *Warehouse* - method *getInternalOrderIssued***

**Criteria for method *getInternalOrderIssued*:**

- none (other units are in charge to verify constraints)
	
**Predicates for method *getInternalOrderIssued*:**

| Criteria | Predicate |
| -------- | --------- |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| - | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
|  | Valid  | T1() -> ok | Get all issued internal orders test |

### **Class *Warehouse* - method *getAcceptedInternalOrders***

**Criteria for method *getAcceptedInternalOrders*:**

- none (other units are in charge to verify constraints)
	
**Predicates for method *getAcceptedInternalOrders*:**

| Criteria | Predicate |
| -------- | --------- |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| - | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
|  | Valid  | T1() -> ok | Get all accepted internal orders test |

### **Class *Warehouse* - method *getInternalOrder***

**Criteria for method *getInternalOrder*:**

- none (other units are in charge to verify constraints)
	
**Predicates for method *getInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| - | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
|  | Valid  | T1() -> ok | Get internal order test |

### **Class *Warehouse* - method *setIOStatus***

**Criteria for method *setIOStatus*:**

- newStatus = "COMPLETED"
	
**Predicates for method *setIOStatus*:**

| Criteria | Predicate |
| -------- | --------- |
| newStatus = "COMPLETED" | yes |
| | no |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| newStatus = "COMPLETED" | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| yes | Valid  | T1() -> ok | Update Internal Order status test |
| no | Valid  | T2() -> ok | Update Internal Order status test |

### **Class *Warehouse* - method *deleteInternalOrder***

**Criteria for method *deleteInternalOrder*:**

- internalOrder with id=ID exists
	
**Predicates for method *deleteInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| internalOrder with id=ID exists | yes |
| | no |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |

**Combination of predicates**:

| internalOrder with id=ID exists | Valid / Invalid | Description of the test case | Jest test case |
|-------|---|-------|-------|-------|-------|
| yes | Valid  | T1() -> ok | Delete internal order test |
| no | Valid  | T2() -> err | Delete internal order test |


-----------------------------------------------------------------------------------------------------

# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
| UserDAO | DBuserDAO.test.js |
| SKUDAO  | DBskuDAO.test.js  |
| PositionDAO | DBpositionDAO.test.js |
| SKUItemDAO  | DBskuItemDAO.test.js  |
| RestockOrderDAO  | DBrestockOrderDAO.test.js  |
| | |
| Warehosue - User | WHuser.test.js |
| Warehosue - SKU | WHsku.test.js |
| Warehosue - Position | WHposition.test.js |
| Warehouse - SKUItem | WHskuItem.test.js |
| Warehouse - RestockOrder | WHrestockOrder.test.js |
| | |

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                                                                                                                                
----------------------------|---------|----------|---------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
All files                   |   86.89 |    81.32 |   79.87 |   88.18 |                                                                                                                                                                                                  
 Database                   |   89.87 |    83.52 |   98.09 |   89.93 |                                                                                                                                                                                                  
  ConnectionDB.js           |      80 |       70 |     100 |   82.14 | 25,31,44,51,71                                                                                                                                                                                   
  InternalOrderDAO.js       |   91.34 |    83.33 |     100 |   91.08 | 51,68,86,105,136,144,156,171,184                                                                                                                                                                 
  ItemDAO.js                |   92.59 |      100 |     100 |   92.45 | 20,64,75,84                                                                                                                                                                                      
  PositionDAO.js            |   94.64 |    91.66 |     100 |   94.54 | 37,80,90                                                                                                                                                                                         
  RestockOrderDAO.js        |   89.85 |     87.5 |      90 |    90.9 | 29,64,74,86,90,101                                                                                                                                                                               
  ReturnOrderDAO.js         |   96.61 |      100 |     100 |   96.61 | 74,103                                                                                                                                                                                           
  SKUItemDAO.js             |   82.14 |    63.15 |     100 |   81.81 | 17,46,53-56,62,71,75,84                                                                                                                                                                          
  SkuDAO.js                 |   89.58 |      100 |     100 |   89.36 | 22,34,60,71,80                                                                                                                                                                                   
  TestDescriptorDAO.js      |   89.13 |      100 |     100 |   88.88 | 21,46,57,68,77                                                                                                                                                                                   
  TestResultDAO.js          |    82.6 |      100 |    87.5 |   82.22 | 21,46,57,62-68                                                                                                                                                                                   
  UserDAO.js                |   91.66 |       90 |     100 |   91.46 | 36,47,56,60,70,97,106                                                                                                                                                                            
 Mock_databases             |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_internalOrderDAO.js  |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_itemDAO.js           |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_positionDAO.js       |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_restockOrderDAO.js   |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_returnOrderDAO.js    |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_skuDAO.js            |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_skuItemDAO.js        |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_testDescriptorDAO.js |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_testResultDAO.js     |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
  Mock_userDAO.js           |     100 |      100 |     100 |     100 |                                                                                                                                                                                                  
 Model                      |   83.94 |    80.56 |    71.1 |   85.98 |                                                                                                                                                                                                  
  InternalOrder.js          |      76 |    66.66 |   55.55 |   76.19 | 43-56                                                                                                                                                                                            
  Item.js                   |   81.81 |      100 |   58.33 |   91.66 | 30,35                                                                                                                                                                                            
  Position.js               |   93.75 |       60 |   83.33 |   95.45 | 30                                                                                                                                                                                               
  RestockOrder.js           |   69.84 |    26.31 |   60.86 |   67.27 | 42-46,50-53,60-69,84,97                                                                                                                                                                          
  ReturnOrder.js            |   93.33 |      100 |   83.33 |    90.9 | 17                                                                                                                                                                                               
  SKUItem.js                |   81.57 |    66.66 |   56.25 |      92 | 31,38                                                                                                                                                                                            
  Sku.js                    |   80.85 |       60 |      55 |   93.33 | 37-40                                                                                                                                                                                            
  TestDescriptor.js         |   80.64 |      100 |   54.54 |    91.3 | 31,36                                                                                                                                                                                            
  TestResult.js             |   82.85 |    28.57 |   58.33 |    92.3 | 34,39                                                                                                                                                                                            
  User.js                   |   90.47 |      100 |      75 |   93.33 | 21                                                                                                                                                                                               
  Warehouse.js              |   85.61 |    89.44 |   84.26 |    86.1 | 34,76,91,127,132,148,158,174-180,207,221,226-234,258,269-272,297,369-373,400,414,429,493,498-502,528-531,551,582-585,619,637,644-647,674,683,724-727,738,747,788-793,803,812,850-854,879,919-925 



### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||



