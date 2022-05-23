# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration and API Test Report](#integration-and-api-test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Integration Tests](#integration-tests)
  - [Step 1 - Unit test of DAO classes](#step-1---unit-test-of-dao-classes)
  - [Step 2 - Unit test of Warehouse class](#step-2---unit-test-of-warehouse-class)
  - [Step 3 - API test of Controller classes ( + Warehouse class + DAO classes)](#step-3---api-test-of-controller-classes---warehouse-class--dao-classes)
- [API testing - Scenarios](#api-testing---scenarios)
- [Coverage of Scenarios and FR](#coverage-of-scenarios-and-fr)
- [Coverage of Non Functional Requirements](#coverage-of-non-functional-requirements)
    - [](#)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>
     
# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence
    (ex: step1: class A, step 2: class A+B, step 3: class A+B+C, etc)> 
    <Some steps may  correspond to unit testing (ex step1 in ex above), presented in other document UnitTestReport.md>
    <One step will  correspond to API testing>
    
The integration approach used is Bottom Up.

- **Step 1**:  Unit test of all the DAO classes, using the real DB
- **Step 2**:  Unit test of all the functions of the Warehouse class, using the mock implementation for all the DAO functions
- **Step 3**:  API test of all the Controller classes

#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1 - Unit test of DAO classes
| Classes  | mock up used |Jest test cases |
|--|--|--|
| UserDAO | None | DBuserDAO.test.js |
| SkuDAO | None | DBskuDAO.test.js |
| PositionDAO | None | DBpositionDAO.test.js |
| SKUItemDAO   | None   | DBSKUItemDAO.test.js|
| RestockOrderDAO | None | DBRestockOrderDAO.test.js |


## Step 2 - Unit test of Warehouse class
| Classes  | mock up used |Jest test cases |
|--|--|--|
| Warehosue - User | UserDAO | WHuser.test.js |
| Warehosue - SKU | SkuDAO - TestDescriptorDAO - PositionDAO | WHsku.test.js |
| Warehosue - Position | PositionDAO - SkuDAO  | WHposition.test.js |
|  Warehouse - SKUItem  | SKUItemDAO   | WHskuItem.test.js |
| Warehouse - RestockOrder | UserDAO - RestockOrderDAO - testResultDAO - SkuDAO - SkuItemDAO | WHrestockOrder.test.js |


## Step 3 - API test of Controller classes ( + Warehouse class + DAO classes) 

| Classes  | mock up used | Jest test cases |
|--|--|--|
| ControllerUser | None | testControllerUser.js |
| ControllerSKu  | None | testControllerSKU.js |
| ControllerPosition | None | testControllerPosition.js |
| ControllerSKUItem   | None   | testControllerSKUItem.js |
|ControllerRestockOrder |  None | testControllerRestockOrder.js |



# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>


# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
|  1.1        | FR2.1                           | testControllerSKU.js - newSKU |             
|  1.2        | FR2.1                           | testControllerSKU.js - modifySKUposition |             
|  1.3        | FR2.1                           | testControllerSKU.js - modifySKU        |             
|  2.1        | FR3.1.1                         | testControllerPosition.js - newPosition |             
|  2.2        | FR3.1.1                         | testControllerPosition.js - modifyPositionID | 
|  2.3        | FR3.1.4                         | testControllerPosition.js - modifyPosition | 
|  2.4        | FR3.1.1                         | testControllerPosition.js - modifyPosition |             
|  2.5        | FR3.1.2                         | testControllerPosition.js - deletePosition | 
|  4.1        | FR1.1                           | testControllerUser.js - newUser         |
|  4.1        | FR1.1                           | testControllerUser.js - modifyUserRights  |
|  4.3        | FR1.2                           | testControllerUser.js - deleteUser    |
| 5.1         | FR5.1    | testRestockOrder.js - newRestockOrder |
| 5.2         | FR5.2    | testRestockOrder.js - addSKUItemToRestockOrder |
| 5.3         | FR5.3    | testRestockOrder.js - addSKUItemToRestockOrder |
| 5.5         | FR5.5    | testRestockOrder.js - newRestockOrder |
| 5.6         | FR5.6    | testRestockOrder.js - newRestockOrder |
| 5.7         | FR5.7    | testRestockOrder.js - changeStateRestockOrder |
| 5.8         | FR5.8    | testRestockOrder.js - changeStateRestockOrder - addSKUItemToRestockOrder - addTransportNoteToRestockOrder |
| 5.10        | FR5.10   | testRestockOrder.js -  |
| 
| ...         |                                 |             |             



# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
| NFR4                       | testControllerPosition.js - newPosition - modifyPositionID - modifyPosition |
| NFR6                       | |
| NFR9                       |  |

