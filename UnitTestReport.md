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


----------------------------------------------------------------------------------------------------------------------------
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




# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|||
|||
||||

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||



