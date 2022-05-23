# Design Document 

Authors: 
Alessandro Zamparutti
Michele Pistan
Nicola di Gruttola Giardino
Nicolò Gallo

Date: 26 April 2022

Version: 2.0


# Contents

- [Design Document](#design-document)
- [Contents](#contents)
- [Instructions](#instructions)
- [High level design](#high-level-design)
- [Low level design](#low-level-design)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)
    - [Scenario 1.1](#scenario-11)
    - [Scenario 1.2](#scenario-12)
    - [Scenario 1.3](#scenario-13)
    - [Scenario 2.1](#scenario-21)
    - [Scenario 2.2](#scenario-22)
    - [Scenario 2.(3-4)](#scenario-23-4)
    - [Scenario 2.5](#scenario-25)
    - [Scenario 3.2](#scenario-32)
    - [Scenario 4.0](#scenario-40)
    - [Scenario 4.1](#scenario-41)
    - [Scenario 4.2](#scenario-42)
    - [Scenario 4.3](#scenario-43)
    - [Scenario 5.1.1](#scenario-511)
    - [Scenario 5.2.(1-2-3)](#scenario-521-2-3)
    - [Scenario 5.3.(1-3)](#scenario-531-3)
    - [Scenario 6.1](#scenario-61)
    - [Scenario 6.2](#scenario-62)
    - [Scenario 7.1](#scenario-71)
    - [Scenario 7.2](#scenario-72)
    - [Scenario 9.1](#scenario-91)
    - [Scenario 9.2](#scenario-92)
    - [Scenario 9.3](#scenario-93)
    - [Scenario 10.1](#scenario-101)
    - [Scenario 11.1](#scenario-111)
    - [Scenario 11.2](#scenario-112)
    - [Scenario 12.1](#scenario-121)
    - [Scenario 12.2](#scenario-122)
    - [Scenario 12.3](#scenario-123)

# Instructions

The design must satisfy the Official Requirements document 

# High level design 

The EZWH application follows the architectural pattern Model-View-Control. The View package contains the GUI, and it is given: so it is not descripted in this document. The class Warehouse is a facade for the classes in the Model package. We also used the Adapter Pattern: each Controller class is associated with a single API, it receives data from header and body of the HTTP request and transforms them in the format requested by the Warehouse class.

```plantuml
top to bottom direction

package "View" #DDDDDD {

}

'End of View

package "Controller" #DDDDDD {

}

'End of Controller

package "Model" #DDDDDD {

}

```

# Low level design


```plantuml
top to bottom direction

package "View" #DDDDDD {

class GUI

note " The Graphical User Interface is fixed\n and not designed in this Document " as N1  
N1 .. GUI
}

'End of View

```

```plantuml
package "Controller" #DDDDDD {

  class controllerSKU{
    router : Router
    warehouse : Warehouse
    post('/sku') : HTTPresponse
    get('/skus') : HTTPresponse
    get('/skus/:id') : HTTPresponse
    put('/sku/:id') : HTTPresponse
    put('/sku/:id/position') : HTTPresponse
    delete('/skus/:id') : HTTPresponse
  }

  class controllerSKUItem {
    router : Router
    warehouse : Warehouse
    post('/skuitem') : HTTPresponse
    get('/skuitems') : HTTPresponse
    get('/skuitems/sku/:id) : HTTPresponse
    get('/skuitems/:rfid') : HTTPresponse
    put('/skuitems/:rfid') : HTTPresponse
    delete('/skuitems/:rfid') : HTTPresponse
  }

  class ControllerPosition{
    router : Router
    warehouse : Warehouse
    post('/position') : HTTPresponse
    get('/positions') : HTTPresponse
    put('/position/:positionID') : HTTPresponse
    put('/position/:positionID/changeID') : HTTPresponse
    delete('/position/:positionID') : HTTPresponse
  }

  class controllerTestDescriptor {
    router : Router
    warehouse : Warehouse
    get('/testDescriptors') : HTTPresponse
    get('/testDescriptors/:id') : HTTPresponse
    post('/testDescriptor') : HTTPresponse
    put('/testDescriptor/:id') : HTTPresponse
    delete('/testDescriptor/:id') : HTTPresponse
  }

  class controllerTestResult {
    router : Router
    warehouse : Warehouse
    get('/skuitems/:rfid/testResults') : HTTPresponse
    get('/skuitems/:rfid/testResults/:id') : HTTPresponse
    post('/skuitems/testResult') : HTTPresponse
    put('/skuitems/:rfid/testResult/:id') : HTTPresponse
    delete('/skuitems/:rfid/testResult/:id') : HTTPresponse
  }

  class controllerUser {
    router : Router
    warehouse : Warehouse
    post('/newUser') : HTTPresponse
    get('/userinfo') : HTTPresponse
    get('/suppliers') : HTTPresponse
    get('/users') : HTTPresponse
    post('/managerSessions') : HTTPresponse
    post('/customerSessions') : HTTPresponse
    post('/supplierSessions') : HTTPresponse
    post('/clerkSessions') : HTTPresponse
    post('/qualityEmployeeSessions') : HTTPresponse
    post('/deliveryEmployeeSessions') : HTTPresponse
    put('/users/:username') : HTTPresponse
    delete('/users/:username/:type') : HTTPresponse
  }

  class controllerRestockOrder{
    router : Router
    warehouse : Warehouse
    post('/restockOrder') : HTTPresponse
    get('/restockOrders') : HTTPresponse
    get('/restockOrdersIssued') : HTTPresponse
    get('/restockOrders/:id') : HTTPresponse
    get('/restockOrders/:id/returnItems') : HTTPresponse
    put('/restockOrder/:id') : HTTPresponse
    put('/restockOrder/:id/skuItems') : HTTPresponse
    put('/restockOrder/:id/transportNote') : HTTPresponse
    delete('/restockOrder/:id') : HTTPresponse
  }

  class controllerReturnOrder{
    router : Router
    warehouse : Warehouse
    get('/returnOrders') : HTTPresponse
    get('/returnOrders/:id') : HTTPresponse
    post('/returnOrder') : HTTPresponse
    delete('/returnOrder/:id') : HTTPresponse
  }

  class controllerInternalOrder{
    router : Router
    warehouse : Warehouse
    get('/internalOrders') : HTTPresponse
    get('/internalOrdersIssued') : HTTPresponse
    get('/internalOrdersAccepted') : HTTPresponse
    get('/internalOrders/:id') : HTTPresponse
    post('/internalOrders') : HTTPresponse
    put('/internalOrders/:id') : HTTPresponse
    delete('/internalOrders/:id') : HTTPresponse
  }

  class controllerItem {
    router : Router
    warehouse : Warehouse
    get('/items') : HTTPresponse
    get('/items/:id') : HTTPresponse
    post('/item') : HTTPresponse
    put('/item/:id') : HTTPresponse
    delete('/items/:id') : HTTPresponse
  }
  
}
'End of Controller
```

```plantuml

package "Model" #DDDDDD {

  class Warehouse{
    userDAO : UserDAO
    skuDAO : SkuDAO
    skuItemDAO : SKUItemDAO
    positionDAO : PositionDAO
    restockOrderDAO : RestockOrderDAO
    returnOrderDAO : ReturnOrderDAO
    internalOrderDAO : InternalOrderDAO
    itemDAO : ItemDAO
    testDescriptorDAO : TestDescriptorDAO
    testResultDAO : TestResultDAO
    
    addSKU(description, weight, volume, notes, price, availableQty) : Integer //lastID
    getSKUs() : SKU [ ]
    getSKU(skuID) : SKU
    modifySKU(skuID, description, weight, volume, notes, price, availableQty) : Integer //# modifications
    modifySKUposition(skuID, positionID) : Integer //# modifications
    deleteSKU(skuID) : Integer //# modifications

    addSKUItem(rfid, skuID, dateOfStock) : Integer //lastID
    getSKUItem(rfid) : SKUItem
    getSKUitems() : SKUItem [ ]
    getSKUitemsBySKUid(skuID) : SKUItem [ ]
    modifySKUItem(rfid, newRFID, newAvailable, newDate) : Integer //# modifications
    deleteSKUItem(rfid) : Integer //# modifications

    addPosition(positionID, aisle, row, col, maxWeight, maxVolume) : Integer //lastID
    getPositions() : Position [ ]
    modifyPosition(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) : Integer //# modifications
    modifyPositionID(oldPositionID, newPositionID) : Integer //# modifications
    deletePosition(positionID) : Integer //# modifications
    
    addRestockOrder(products, supplierID, issueDate) : Integer //lastID
    getRestockOrder(restockOrderID) : RestockOrder
    getRestockOrders() : RestockOrder [ ]
    getRestockOrdersIssued() : RestockOrder [ ]
    restockOrderAddSKUItems(restockOrderID, SKUItemIdList) : Integer //# modifications
    restockOrderAddTransportNote(restockOrderID, Date) : Integer //# modifications
    modifyRestockOrderState(restockOrderID, newState) : Integer //# modifications
    returnItemsFromRestockOrder(restockOrderID) : SKUItem[ ]
    deleteRestockOrder(restockOrderID) : Integer //# modifications

    addReturnOrder(SKUItemList, restockOrderId, returnDate) : Integer //lastID
    getReturnOrders() : ReturnOrder [ ]
    getReturnOrderById(ID) : ReturnOrder
    deleteReturnOrder(ID) : Integer //# modifications
    sendNotificationRO(userID, returnOrderID) : void

    addInternalOrder(products, customerID, issueDate) : Integer //lastID
    getInternalOrders() : InternalOrder [ ]
    getInternalOrdersIssued() : InternalOrder [ ]
    getAcceptedInternalOrders() : InternalOrder[ ]
    getInternalOrder(ID) : InternalOrder
    setIOStatus(ID, status, products) : bool
    deleteInternalOrder(ID) : Integer //# modifications

    addUser(username, name, surname, password, type) : Integer //lastID
    getUsers() : User [ ]
    getSuppliers() : User [ ]
    login(username, password, type) : User
    modifyUserRights(username, oldType, newType) : Integer //# modifications
    deleteUser(username, type) : Integer //# modifications

    getItems() : Item [ ]
    getItem(id) : Item
    addItem(id, description, price, SKUId, supplierId) : Integer //lastID
    modifyItem(ID, newDescription, newPrice) : Integer //# modifications
    deleteItem(id) : Integer //# modifications

    getTestDescriptors() : TestDescriptor [ ]
    getTestDescriptor(ID) : TestDescriptor
    addTestDescriptor(name, procedureDescription, idSKU) : Integer //lastID 
    modifyTestDescriptor(id, newName, newProcedureDescription, newIdSKU) : Integer //# modifications
    deleteTestDescriptor(id) : Integer //# modifications

    getTestResults() : TestResult [ ]
    getTestResult(rfid, id) : TestResult
    addTestResult(rfid, idTestDescriptor, date, result) : Integer //lastID
    modifyTestResult(rfid, id, newIdTestDescriptor, newDate, newResult) : void
    deleteTestResult(ID) : Integer //# modifications      
  }

  class SKU {
    id : int
    description : string
    weight : float
    volume : float
    notes : string
    position : PositionID
    availableQuantity : int
    price : double
    testDescriptors : TestDescriptor [ ]

    constructor(id, description, weight, volume, notes, price, availableQuantity, positionID) : SKU
    getID( ) : int
    getDescription( ) : string
    getWeight( ) : float
    getVolume( ) : float
    getNotes( ) : string
    getAvailableQuantity( ) : int
    getPrice( ) : double
    getPosition( ) : PositionID
    getTestDescriptors() : TestDescriptor [ ]
    setDescription(description) : void
    setWeight(weight) : void
    setVolume(volume) : void
    setNotes(notes) : void
    setPosition(positionID) : void
    setAvailableQuantity(availableQty) : void
    setPrice(price) : void
    addTestDescriptor(testDescriptor) : void
    convertToObj( ) : Obj
  }

  class SKUItem {
    RFID : string
    available : boolean
    sku : SKU
    DateOfStock : DateTime
    restockOrder : RestockOrder
    testResults : TestResult [ ]

    constructor(RFID, sku, available, dateOfStock, restockOrder) : SKUItem
    getRFID( ) : string
    getSKU( ) : SKU
    getAvailable( ) : boolean
    getDateOfStock( ) : DateTime
    setRFID(rfid) ; void
    setAvailable(available) : void
    setDateOfStock(date) : void
    setRestockOrder(restockOrder) : void
    setSKU(sku) : void
    isAvailable( ) : boolean
    addTestResult(testResult) : void
    convertToObj( ) : Obj
    convertToObjSimple( ) : Obj
  }

  class Position {
    positionID : string
    aisle : string
    row : string
    col : string
    maxWeight : float
    maxVolume : float
    occupiedWeight : float
    occupiedVolume : float
    assignedSKU : SKU
    
    constructor(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKU) : Position
    getPositionID( ) : string
    getAisle( ) : string
    getRow( ) : string
    getCol( ) : string
    getMaxWeight( ) : float
    getMaxVolume( ) : float
    geOccupiedtWeight( ) : float
    getOccupiedVolume( ) : float
    getAssignedSKU( ) : SKU
    setAssignedSKU(sku) : void
    convertToObj( ) : Obj
  }

  class TestDescriptor {
    id : string
    name : string
    procedureDescription : string
    SKUid : int

    constructor(id, name, procedureDescription, SKUid) : TestDescriptor
    getID( ) : string
    getName( ) : string
    getProcedureDescription( ) : string
    getSKUid( ) : int
    setID(ID) : void
    setName(name) : void
    setProcedureDescription(description) : void
    setSKUid(SKUid) : void
    modifyTestDescriptorData(newName, newProcedureDescription, newIdSKU, TestDescriptorDAO) : Integer
    convertToObj( ) : Obj
  }

  class TestResult {
    id : int
    rfid : string
    idTestDescriptor : string
    date : DateTime
    result : boolean

    constructor(id, rfid, idTestDescriptor, date, result) : TestResult
    getID( ) : int
    getRFID( ) : string
    getIdTestDescriptor( ) : string
    getDate( ) : Date
    getResult( ) : bool
    setRFID(RFID) : void
    setIdTestDescriptor(idTestDescriptor) : void
    setDate(date) : void
    setResult(result) : void
    modifyTestResultData(newIdTestDescriptor, newDate, newResult, TestResultDAO) : Integer
    convertToObj( ) : Obj
  }

  class User {
    userID : int
    name : string
    surname : string
    email : string
    type : string
    type [Manager, Admin, Supplier, Clerk, QualityCheckEmployee, DeliveryEmployee, InternalCustomer]

    constructor(userID, name, surname, email, type) : User
    getUserID( ) : int
    getName( ) : string
    getSurname( ) : string
    getEmail( ) : string
    getType( ) : string
    setType(newType) : void
    convertToObj( ) : Obj
  }

  class RestockOrder {
    id : int
    issueDate : DateTime
    products : Product [ ]
    supplier : User
    transportNote : TransportNote
    SKUitems : SKUItem [ ]
    state : string
    state [ISSUED - DELIVERY - DELIVERED - TESTED - COMPLETEDRETURN - COMPLETED]
    
    constructor(id, issueDate, supplier, state. transportNote) : RestockOrder
    getID( ) : int
    getIssueDate( ) : DateTime
    getProducts( ) : Map <Item, int>
    getState( ) : string
    getTransportNote( ) : TransportNote
    getSKUitems( ) : SKUItem [ ]
    getSupplier( ) : User
    setSKUItems(skuItems) : void
    addProduct(item, description, price, qty) : void
    addSKUItems(skuItems) : void
    setState(newState) : void
    getSKUItemsFailedTest() : SKUItem[]
    convertToObj( ) : Obj
  }

  class TransportNote {
    dateDelivery : DateTime

    constructor(date) : TransportNote
    getShipmentDate( ) : DateTime
    convertToObj( ) : Obj
  }

  class ReturnOrder {
    id : int
    returnDate : DateTime
    restockOrderId : int
    products : SKUItem [ ]

    constructor(id, restockOrder, returnDate, products) : ReturnOrder
    getId( ) : int
    getReturnDate( ) : DateTime
    getProducts( ) : SKUItem [ ]
    getRestockOrderId( ) : int
    convertToObj( ) : Obj
  }

  class InternalOrder {
    id : int
    issueDate : DateTime
    products : Obj [ ]   
    internalCustomer : User
    state : string
    state [ISSUED - ACCEPTED - REFUSED - CANCELED - COMPLETED]

    constructor(id, customer, issueDate, state) : InternalOrder
    getId( ) : int
    getIssueDate( ) : DateTime
    getProducts( ) : Obj [ ]
    getState( ) : string
    addSKU(SKU, qty) : bool
    addProduct(skuId, price, description, qty, rfid) : void
    convertToObj( ) : Obj
  }

  class Item {
    id : int
    description : string
    price : double
    associatedSKU : SKU
    supplier : User

    constructor(id, description, price, associatedSKU, supplier) : Item
    getID( ) : int
    getDescription( ) : string
    getPrice( ) : double
    getAssociatedSKU( ) : SKU
    getSupplier( ) : User
    setDescription(description) : void
    setPrice(price) : void
    setAssociatedSKU(SKU) : void
    setSupplier(supplier) : void
    modifyItemData(newDescription, newPrice, ItemDAO) : Integer
    convertToObj( ) : Obj
  }  
}
Warehouse --> "*" SKU
Warehouse --> "*" SKUItem
Warehouse --> "*" TestDescriptor
Warehouse --> "*" TestResult
Warehouse --> "*" User
Warehouse --> "*" RestockOrder
Warehouse --> "*" ReturnOrder
Warehouse --> "*" InternalOrder
Warehouse --> "*" Item
Warehouse --> "*" Position
RestockOrder --> "*" Item
RestockOrder --> "0..1" TransportNote
RestockOrder --> "0..1" ReturnOrder : refers
RestockOrder --> "*" SKUItem
SKUItem "*" --> "0..1" ReturnOrder
SKU -- "*" SKUItem
SKU -- "*" Item : corresponds to 
SKU "*" -- "*" TestDescriptor
TestDescriptor -- "*" TestResult
SKU "1" -- "1" Position: must be placed in
InternalOrder -- "*" SKU
InternalOrder "0..1" -- "*" SKUItem
SKUItem -- "*" TestResult
SKUItem "*" -- "0..1" Position

'End of Model
```
```plantuml

package "Database" #DDDDDD {

  class UserDAO {
    constructor( ) : UserDAO
    newUser(username, name, surname, password, type) : Integer //lastID
    getAllUsers( ) : User [ ]
    getAllUsersByType(type) : User [ ]
    getUser(username, type) : User
    updateUser(username, oldType, newType) : Integer //# modifications
    loginUser(username, password, type) : User
    deleteUser = async (username, type) : Integer //# modifications
    generateSecurePassword(password)
    verifyPassword(passwordStored, saltStored, password)
  }
  
  class SkuDAO{
    constructor( ) : SkuDAO
    newSKU(description, weight, volume, notes, price, availableQty, position) : Integer
    getAllSKU( ) : SKU [ ]
    getSKU(skuID) : SKU
    updateSKU(skuID, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, newPositionID) : Integer
    deleteSKU(skuID) : Integer
  }

  class SKUItemDAO{
    constructor( ) : SKUItemDAO
    newSKUItem(RFID, sku, available, dateOfStock, restockOrder=null) : Integer
    getSKUItem(rfid) : SKUItem
    getAllSKUItems( ) : SKUItem [ ]
    updateSKUItem(oldRFID, newRFID, newAvailable, newDate, restockOrderID) : Integer
    deleteSKUItem(rfid)
  }

  class PositionDAO{
    constructor( ) : PositionDAO
    newPosition(positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, assignedSKUid) : Integer
    getAllPosition( ) : Position [ ]
    getPosition(positionID) : Position
    updatePosition(oldPositionID, newPositionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, skuID) : Integer
    deletePosition(positionID) : Integer
  }

  class RestockOrderDAO{
    constructor( ) : RestockOrderDAO
    newRestockOrder(products, state, supplierID, issueDate, transportNote) : Integer
    getRestockOrder(restockOrderID) : RestockOrder
    getAllRestockOrders( ) : RestockOrder [ ]
    updateRestockOrder(restockOrderID, newState, transportNote) : Integer
    deleteRestockOrder(restockOrderID) : Integer
  }

  class ReturnOrderDAO{
    constructor( ) : ReturnOrderDAO
    newReturnOrder(products, restockOrderId, returnDate) : Integer
    getReturnOrderById(returnOrderID) : ReturnOrder
    getAllReturnOrders( ) : ReturnOrder [ ]
    deleteReturnOrder(returnOrderID) : Integer
  }

  class InternalOrderDAO{
    constructor( ) : InternalOrderDAO
    newInternalOrder(issueDate, products, customerId, state) : Integer
    getAllInternalOrders( ) : InternalOrder [ ]
    getAllIssued( ) : InternalOrder [ ]
    getAllAccepted( ) : InternalOrder [ ]
    getInternalOrder(ID) : InternalOrder
    addDeliveredProducts(ID, SKUItemList) : void
    setStatus(ID, newState) : Integer
    deleteInternalOrder(ID) : Integer
  }

  class ItemDAO{
    constructor( ) : ItemDAO
    getAllItem( ) : Item [ ]
    getItem(id) : Item
    newItem(id, description, price, SKUId, supplierId) : Integer
    updateItem(id, newDescription, newPrice, associatedSKU, supplier) : Integer
    deleteItem(id) : Integer
  }

  class TestDescriptorDAO{
    constructor( ) : TestDescriptorDAO
    getAllTestDescriptor( ) : TestDescriptor[ ]
    getTestDescriptor(id) : TestDescriptor
    newTestDescriptor(name, procedureDescription, idSKU) : Integer
    updateTestDescriptor(id, newName, newProcedureDescription, newIdSKU) : Integer
    deleteTestDescriptor(id) : Integer
  }

  class TestResultDAO{
    constructor( ) : TestResultDAO
    getAllTestResult(rfid) : TestResult [ ]
    getTestResult(rfid, id) : TestResult
    newTestResult(rfid, idTestDescriptor, date, result) : Integer
    updateTestResult(id, rfid, newIdTestDescriptor, newDate, newResult) : Integer
    deleteTestResult(id, rfid) : Integer
  }

  class ConnectionDB{
    constructor( ) : ConnectionDB
    DBget(query, params) : Promise
    DBgetAll(query, params) : Promise
    DBexecuteQuery(query, params) : Promise
  }

  ConnectionDB <-- UserDAO
  ConnectionDB <-- SkuDAO
  ConnectionDB <-- SKUItemDAO
  ConnectionDB <-- PositionDAO
  ConnectionDB <-- RestockOrderDAO
  ConnectionDB <-- ReturnOrderDAO
  ConnectionDB <-- InternalOrderDAO
  ConnectionDB <-- ItemDAO
  ConnectionDB <-- TestDescriptorDAO
  ConnectionDB <-- TestResultDAO

}

'End of Database
```


# Verification traceability matrix

For each functional requirement from the requirement document, this table shows which classes concur to implement it.

| FR / Class |  ControllerSKU | ControllerSKUItem | ControllerPosition | ControllerTestDescriptor | ControllerTestResult | ControllerUser | ControllerRestockOrder | ControllerReturnOrder | ControllerInternalOrder | ControllerItem | Warehouse | SKU | SKUItem | Position | TestDescriptor | TestResult | User | RestockOrder | ReturnOrder | InternalOrder | Item |
| :--------- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| FR1 | | | | | | X | | | | | X | | | | | | X | | | | |
| FR2 | X | | | | | | | | | | X | X | | | | | | | | | |
| FR3.1 | | | X | | | | | | | | X | | | X | | | | | | | |
| FR3.2 | | | | X | X | | | | | | X | | | | X | X | | | | | |
| FR4 | | | | | | X | | | | | X | | | | | | X | | | | |
| FR5 | | X | | | | | X | X | | | X | | X | | | | | X | X | | |
| FR6 | | | | | | | | | X | | X | | X | | | | | | | X | |
| FR7 | | | | | | | | | | X | X | | | | | | | | | | X |



# Verification sequence diagrams

### Scenario 1.1
```plantuml
mainframe **Create SKU**
actor Manager
participant GUI
participant ControllerSKU
participant Warehouse
participant SKU

autonumber
Manager -> GUI : inserts data
GUI -> ControllerSKU : POST/api/sku -> createSKU
ControllerSKU -> Warehouse : addSKU
Warehouse -> SKU : SKU
Warehouse <-> SKU : return success
ControllerSKU <-- Warehouse : return success
GUI <-- ControllerSKU : 201 created

@enduml
```

### Scenario 1.2
```plantuml
mainframe **Modify SKU location**
actor Manager
participant GUI
participant ControllerSKU
participant ControllerPosition
participant Warehouse
participant SKU

autonumber
Manager -> GUI : inserts SKU ID
GUI -> ControllerSKU :  GET/api/skus/:id -> getSKUbyID
ControllerSKU -> Warehouse : getSKU
ControllerSKU <-- Warehouse : return SKU
GUI <-- ControllerSKU : 200 ok

Manager -> GUI : selects SKU record
GUI -> ControllerPosition : GET/api/positions -> getPositions
ControllerPosition -> Warehouse : getPositions
ControllerPosition <-- Warehouse : return Position list
GUI <-- ControllerPosition : 200 ok

Manager -> GUI : selects SKU position
GUI -> ControllerSKU : PUT/api/sku/:id/position -> modifySKUposition
ControllerSKU -> Warehouse : modifySKUposition
Warehouse -> Warehouse : getSKU
Warehouse -> Warehouse : getPosition
Warehouse -> SKU : setPosition
Warehouse <-- SKU : return success
Warehouse -> Position : addSKU
Position -> Position : update volume, weight
Warehouse <-- Position : return success
ControllerSKU <-- Warehouse : return success
GUI <-- ControllerSKU : 200 ok

@enduml
```

### Scenario 1.3
```plantuml
mainframe **Modify SKU weight and volume**
actor Manager
participant GUI
participant ControllerSKU
participant Warehouse
participant SKU

autonumber
Manager -> GUI : inserts SKU ID
GUI -> ControllerSKU :  GET/api/skus/:id -> getSKUbyID
ControllerSKU -> Warehouse : getSKU
ControllerSKU <-- Warehouse : return SKU
GUI <-- ControllerSKU : 200 ok

Manager -> GUI : inserts data
GUI -> ControllerSKU : PUT/api/sku/:id -> modifySKU
  ControllerSKU -> Warehouse : modifySKU
  Warehouse -> Warehouse : getSKU
  Warehouse -> SKU : set<Field>
  Warehouse <-- SKU : return success
  Warehouse -> SKU : getPosition
  alt position exists
    Warehouse -> Warehouse : getPosition
    Warehouse -> Position : addSKU
    Position -> Position : update volume, weight
    Warehouse <-- SKU : return success
  end alt  
ControllerSKU <-- Warehouse : return success
GUI <-- ControllerSKU : 200 ok

@enduml
```

### Scenario 2.1
```plantuml
mainframe **Create Position**
actor Manager
participant GUI
participant ControllerPosition
participant Warehouse
participant Position

autonumber
Manager -> GUI : inserts data
GUI -> ControllerPosition : POST/api/position -> createPosition
ControllerPosition -> Warehouse : addPosition
Warehouse -> Position : Position
Warehouse <-- Position : return success
ControllerPosition <-- Warehouse : return success
GUI <-- ControllerPosition : 201 created

@enduml
```

### Scenario 2.2
```plantuml
mainframe **Modify positionID**
actor Manager
participant GUI
participant ControllerPosition
participant Warehouse
participant Position

autonumber
Manager -> GUI : show list of positions
GUI -> ControllerPosition : GET/api/positions -> getPositions
ControllerPosition -> Warehouse : getPositions
ControllerPosition <-- Warehouse : return Position list
GUI <-- ControllerPosition : 200 ok

Manager -> GUI : inserts new PositionID
GUI -> ControllerPosition : PUT/api/position/:positionID/changeID -> modifyPositionID
ControllerPosition -> Warehouse : modifyPositionID
Warehouse -> Warehouse : getPosition
Warehouse -> Position : setPositionID
Position -> Position : update Aisle Row Col
Warehouse <-- Position : return success
ControllerPosition <-- Warehouse : return success
GUI <-- ControllerPosition : 200 ok

@enduml
```

### Scenario 2.(3-4)
```plantuml
mainframe **Modify weight and volume or aisle ID, row and column of Position**
actor Manager
participant GUI
participant ControllerPosition
participant Warehouse
participant Position

autonumber
Manager -> GUI : selects position and inserts data
GUI -> ControllerPosition : PUT/api/position/:positionID-> modifyPosition
ControllerPosition -> Warehouse : modifyPosition
Warehouse -> Warehouse : getPosition
Warehouse -> Position : setPositionAisleRowCol
Position -> Position : update positionID
Warehouse <-- Position : return success
Warehouse -> Position : set<Field>
Warehouse <-- Position : return succes
ControllerPosition <-- Warehouse : return success
GUI <-- ControllerPosition : 200 ok

@enduml
```

### Scenario 2.5
```plantuml
mainframe **Delete Position**
actor Manager
participant GUI
participant ControllerPosition
participant Warehouse

autonumber
Manager -> GUI : delete positions selected
GUI -> ControllerPosition : DELETE/api/position/:positionID -> deletePosition
ControllerPosition -> Warehouse : deletePosition
ControllerPosition <-- Warehouse : return success
GUI <-- ControllerPosition : 204 No Content

@enduml
```

### Scenario 3.2
```plantuml
mainframe **Restock Order of SKU S issued by supplier**
actor Manager
participant GUI
participant ControllerUser
participant ControllerRestockOrder
participant Warehouse
participant RestockOrder

autonumber
Manager -> GUI :  show list of Supplier
GUI -> ControllerUser : GET/api/suppliers -> getAllSuppliers
ControllerUser -> Warehouse : getSuppliers
ControllerUser <-- Warehouse : return Supplier list
GUI <-- ControllerUser : 200 ok

Manager -> GUI : select Items
GUI -> ControllerRestockOrder : GET/api/items -> getItems
ControllerRestockOrder -> Warehouse : getItems
ControllerRestockOrder <-- Warehouse : return Item list
GUI <-- ControllerRestockOrder : return 200 ok
GUI -> ControllerRestockOrder : GET/api/items/:id -> getItemById
ControllerRestockOrder -> Warehouse : getItem
ControllerRestockOrder <-- Warehouse : return Item
GUI <-- ControllerRestockOrder : return 200 ok

Manager -> GUI : inserts data
GUI -> ControllerRestockOrder : POST/api/restockOrder -> createRestockOrder
ControllerRestockOrder -> Warehouse : addRestockOrder
Warehouse -> RestockOrder : RestockOrder
Warehouse <-- RestockOrder : return success
ControllerRestockOrder <-- Warehouse : return success
GUI <-- ControllerRestockOrder : 201 Created

@enduml
```

### Scenario 4.0
```plantuml
@startuml
mainframe **Get User list**
actor Admin
participant GUI
participant ControllerUser
participant Warehouse

autonumber
Admin -> GUI : requires user list (no managers) 
GUI -> ControllerUser : GET/api/users -> getUsers
ControllerUser -> Warehouse : getUsers
ControllerUser <-- Warehouse : return user list
GUI <-- ControllerUser : 200 ok

@enduml
```

### Scenario 4.1
```plantuml
@startuml
mainframe **Create new User**
actor Admin
participant GUI
participant ControllerUser
participant Warehouse
participant User

autonumber
Admin -> GUI : defines credentials of the new account 
GUI -> ControllerUser : POST/api/newUser -> createUser
ControllerUser -> Warehouse : addUser
Warehouse -> User : User
Warehouse <-- User : return success
ControllerUser <-- Warehouse : return success
GUI <-- ControllerUser : 201 created

@enduml
```

### Scenario 4.2
```plantuml
@startuml
mainframe **Modify User rights**
actor Admin
participant GUI
participant ControllerUser
participant Warehouse
participant User

autonumber
Admin -> GUI : selects the access rights for user 
GUI -> ControllerUser : PUT/api/users/:username -> modifyUserRights
ControllerUser -> Warehouse : modifyUserRights
Warehouse -> Warehouse : getUser
Warehouse -> User : setType
Warehouse <-- User : return success
ControllerUser <-- Warehouse : return success
GUI <-- ControllerUser : 200 ok

@enduml
```

### Scenario 4.3
```plantuml
@startuml
mainframe **Delete User**
actor Admin
participant GUI
participant ControllerUser
participant Warehouse

autonumber
Admin -> GUI : selects account to delete
GUI -> ControllerUser : DELETE/api/users/:username/:type -> deleteUser
ControllerUser -> Warehouse : deleteUser
ControllerUser <-- Warehouse : return success
GUI <-- ControllerUser : 204 no content

@enduml
```
### Scenario 5.1.1
```plantuml
@startuml
mainframe **Manage reception of SKU Items of a restock Order**
actor Clerk
participant GUI
participant ControllerSKUItem
participant ControllerRestockOrder
participant Warehouse
participant SKUItem
participant RestockOrder

autonumber
loop for each SKUItem
  Clerk -> GUI : records item with a new RFID
  GUI -> ControllerSKUItem : POST/api/skuitem -> createSKUItem
  ControllerSKUItem -> Warehouse : addSKUItem
  Warehouse -> SKUItem : SKUItem
  Warehouse <-- SKUItem : return success
  ControllerSKUItem <-- Warehouse : return success
  GUI <-- ControllerSKUItem : 201 created
end loop
Clerk -> GUI : assigns SKUItem list to a RO
GUI -> ControllerRestockOrder : PUT/api/restockOrder/:id/skuItems -> addSKUItems
ControllerRestockOrder -> Warehouse : restockOrderAddSKUItems
Warehouse -> Warehouse : getRestockOrder
Warehouse -> RestockOrder : addSKUItems
Warehouse <-- RestockOrder : return success
ControllerRestockOrder <-- Warehouse : return success
GUI <-- ControllerRestockOrder : 200 ok
GUI -> ControllerRestockOrder : PUT/api/restockOrder/:id -> modifyRestockOrderState
ControllerRestockOrder -> Warehouse : modifyRestockOrderState
Warehouse -> Warehouse : getRestockOrder
Warehouse -> RestockOrder : setState
Warehouse <-- RestockOrder : return success
ControllerRestockOrder <-- Warehouse : return success
GUI <-- ControllerRestockOrder : 200 ok

@enduml
```

### Scenario 5.2.(1-2-3)
```plantuml
@startuml
mainframe **Manage testing of SKU Items of a restock Order**
actor QualityCheckEmployee
participant GUI
participant ControllerTestResult
participant ControllerRestockOrder
participant Warehouse
participant TestResult
participant SKUItem
participant RestockOrder

autonumber
loop for each SKUItem
  loop for each Test descriptor
    QualityCheckEmployee -> GUI : records tests result in the system 
    GUI -> ControllerTestResult : POST/api/skuitems/testResult -> createTestResult
    ControllerTestResult -> Warehouse : addTestResult
    Warehouse -> TestResult : TestResult
    Warehouse <-- TestResult : return success
    Warehouse -> Warehouse : getSKUItem
    Warehouse -> SKUItem : addTestResult
    Warehouse <-- SKUItem : return success
    ControllerTestResult <-- Warehouse : return success
    GUI <-- ControllerTestResult : 201 created
  end loop
end loop
GUI -> ControllerRestockOrder : PUT/api/restockOrder/:id -> modifyRestockOrderState
ControllerRestockOrder -> Warehouse : modifyRestockOrderState
Warehouse -> Warehouse : getRestockOrder
Warehouse -> RestockOrder : setState
Warehouse <-- RestockOrder : return success
ControllerRestockOrder <-- Warehouse : return success
GUI <-- ControllerRestockOrder : 200 ok

@enduml
```

### Scenario 5.3.(1-3)
```plantuml
@startuml
mainframe **Manage acceptance of tested SKU Items of a restock Order**
actor Clerk
participant GUI
participant ControllerSKU
participant ControllerRestockOrder
participant Warehouse
participant SKU
participant Position
participant RestockOrder


autonumber
loop for each RFID
  Clerk -> GUI : updates SKU quantity
  GUI -> ControllerSKU : PUT/api/sku/:id -> modifySKU
  ControllerSKU -> Warehouse : modifySKU
  Warehouse -> Warehouse : getSKU
  Warehouse -> SKU : set<Field>
  Warehouse <-- SKU : return success
  Warehouse -> SKU : getPosition
  alt position exists
    Warehouse -> Warehouse : getPosition
    Warehouse -> Position : addSKU
    Position -> Position : update units, volume, weight
    Warehouse <-- SKU : return success
  end alt
  ControllerSKU <-- Warehouse : return success
  GUI <-- ControllerSKU : 200 ok
  Clerk -> GUI : selects position
  GUI -> ControllerSKU : PUT/api/sku/:id/position -> SKUposition
  ControllerSKU -> Warehouse : SKUposition
  Warehouse -> Warehouse : getSKU
  Warehouse -> Warehouse : getPosition
  Warehouse -> SKU : setPosition
  Warehouse <-- SKU : return success
  Warehouse -> Position : addSKU
  Position -> Position : update units, volume, weight
  Warehouse <-- SKU : return success
  ControllerSKU <-- Warehouse : return success
  GUI <-- ControllerSKU : 200 ok
end loop
GUI -> ControllerRestockOrder : PUT/api/restockOrder/:id -> modifyRestockOrderState
ControllerRestockOrder -> Warehouse : modifyRestockOrderState
Warehouse -> Warehouse : getRestockOrder
Warehouse -> RestockOrder : setState
Warehouse <-- RestockOrder : return success
ControllerRestockOrder <-- Warehouse : return success
GUI <-- ControllerRestockOrder : 200 ok

@enduml
```

### Scenario 6.1
```plantuml
@startuml
mainframe **Return Order of SKU items that failed quality tests**
actor Manager 
participant GUI
participant controllerRestockOrder
participant controllerReturnOrder
participant Warehouse
participant RestockOrder
participant ReturnOrder
participant SKUItem
participant SKU
participant TestResult
participant Position
actor Supplier

autonumber
Manager -> GUI : Insert ID of Return Order
GUI -> controllerRestockOrder : GET/api/restockOrders/:id/returnItems -> getReturnItems
controllerRestockOrder -> Warehouse : returnItemsFromRO(notPassed = 1)
Warehouse -> Warehouse : getRestockOrder
Warehouse -> RestockOrder : getSKUItemsFailedTest
loop for each SKUItem
  RestockOrder -> SKUItem : getNotPassed
  SKUItem -> TestResult : getResult
  SKUItem <-- TestResult : return result
    alt return false
      RestockOrder <-- SKUItem : return SKUItems
    end alt
 end loop

RestockOrder --> Warehouse : return SKUItem list
Warehouse --> controllerRestockOrder : return SKUItem list
controllerRestockOrder --> GUI : 200 ok

Manager -> GUI : Add item to REO and confirm
GUI -> controllerReturnOrder : POST/api/returnOrder -> createReturnOrder
controllerReturnOrder -> Warehouse : addReturnOrder
Warehouse -> ReturnOrder : ReturnOrder
Warehouse <-- ReturnOrder : Return success  
Warehouse -> ReturnOrder : addSKUItems 
loop for each RFID of item with not passed test in RO
  ReturnOrder -> SKUItem : setNotAvailable
  ReturnOrder <-- SKUItem : return ok
end loop
Warehouse <-- ReturnOrder : return success
Warehouse -> GUISupplier : sendNotification
Warehouse --> controllerReturnOrder : return ok
controllerReturnOrder --> GUI : return 201 Created
GUI --> Manager : Display Created message
@enduml

```

<!-- da cancellare -->
### Scenario 6.2
```plantuml
@startuml
mainframe **Return Order of any SKU items**
actor Manager 
participant GUI
participant controllerRestockOrder
participant controllerReturnOrder
participant Warehouse
participant RestockOrder
participant ReturnOrder
participant SKUItem
participant SKU
participant TestResult
participant Position
actor Supplier

autonumber
Manager -> GUI : insert ID of RestockOrder
GUI -> controllerRestockOrder : GET/api/restockOrders/:id/returnItems -> getReturnItems
controllerRestockOrder -> Warehouse : returnItemsFromRO(notPassed = 0)
Warehouse -> Warehouse : getRestockOrder
Warehouse -> RestockOrder : getSKUItemsFailedTest
loop for each SKUItem
  RestockOrder -> SKUItem : getNotPassed
  SKUItem -> TestResult : getResult
  SKUItem <-- TestResult : return result
  alt return false
    RestockOrder <-- SKUItem : return RFID
  else 
      SKUItem -> SKUItem : checkIfReturn
        alt return true
          RestockOrder <-- SKUItem : return RFID
        end alt
  end alt
end loop

RestockOrder --> controllerRestockOrder : return listSKUs
controllerRestockOrder --> GUI : return RFID of SKUs

Manager -> GUI : Add item to REO and confirm
GUI -> controllerReturnOrder : POST/api/returnOrder -> createReturnOrder
controllerReturnOrder -> Warehouse : addReturnOrder
Warehouse -> ReturnOrder : ReturnOrder
Warehouse <-- ReturnOrder : Return success  
Warehouse -> ReturnOrder : addSKUItems 
loop for each RFID of item with not passed test in RO
  ReturnOrder -> SKUItem : setNotAvailable
  ReturnOrder <-- SKUItem : return ok
end loop
Warehouse <-- ReturnOrder : return success
Warehouse -> GUISupplier : sendNotification
Warehouse --> controllerReturnOrder : return ok
controllerReturnOrder --> GUI : return 201 Created
GUI --> Manager : Display Created message
@enduml

```

### Scenario 7.1
```plantuml
@startuml
mainframe **LogIn**
actor User
participant GUI
participant controllerUser
participant Warehouse

autonumber
User -> GUI : insert Username and Password
User -> GUI : click Login
GUI -> controllerUser : POST/api/userSessions -> logIn
controllerUser -> Warehouse : logIn
alt Credentials are Ok
  controllerUser <- Warehouse : return true
  GUI <-- controllerUser : return 200 Ok
  User <-- GUI : display homepage
else Credentials are wrong
  controllerUser <- Warehouse : return false
  GUI <-- controllerUser : return 401 Unauthorized
  User <-- GUI : display Error Message
end
@enduml
```

### Scenario 7.2
```plantuml
@startuml
mainframe **LogOut**
actor User
participant GUI
participant controllerUser
participant Warehouse

autonumber
User -> GUI : click on Logout
GUI -> controllerUser : POST/api/logout -> logOut
controllerUser -> Warehouse : logOut
controllerUser <-- Warehouse : return ok
GUI <-- controllerUser : return 200 Ok
User <-- GUI : display Login page
@enduml
```

### Scenario 9.1
```plantuml
@startuml
mainframe **Internal Order accepted**
actor Customer
actor Manager
participant GUI
participant controllerInternalOrder
participant Warehouse
participant InternalOrder
participant SKU

autonumber
Customer -> GUI : start internal order and add SKUs
GUI -> controllerInternalOrder : POST/api/internalOrders -> createInternalOrder 
controllerInternalOrder -> Warehouse : addInternalOrder
Warehouse -> InternalOrder : InternalOrder
Warehouse <-- InternalOrder : return success
loop for each SKU needed
  Warehouse -> InternalOrder : addSKU(qty)
  Warehouse <-- InternalOrder : return ok
end loop
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 201 Created

Customer -> GUI : confirm IO
GUI -> controllerInternalOrder : PUT/api/internalOrders/:id {ISSUED} -> setIOStatus
controllerInternalOrder -> Warehouse : setIOStatus(id,ISSUED)
Warehouse -> InternalOrder : setStatus(ISSUED)
loop for each SKU in IO
  InternalOrder -> SKU : decreaseAvailableQty
  SKU -> Position : increaseAvailablePos
  SKU <-- Position : return ok
  InternalOrder <-- SKU : return ok
end loop
Warehouse <-- InternalOrder : return ok
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 200 OK

Manager -> GUI : check IO
GUI -> controllerInternalOrder : GET/api/internalOrdersIssued -> getInternalOrdersIssued
controllerInternalOrder -> Warehouse : getInternalOrdersIssued
controllerInternalOrder <-- Warehouse : return list issued
GUI <-- controllerInternalOrder : return 200 OK
Manager <-- GUI : display Issued orders

Manager -> GUI : confirm IO
GUI -> controllerInternalOrder : PUT/api/internalOrders/:id {ACCEPTED} -> setIOStatus
controllerInternalOrder -> Warehouse : setIOStatus(id,ACCEPTED)
Warehouse -> InternalOrder : setStatus(ACCEPTED)
Warehouse <-- InternalOrder : return ok
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 200 OK
@enduml
```

### Scenario 9.2
```plantuml
@startuml
mainframe **Internal Order refused**
actor Customer
actor Manager
participant GUI
participant controllerInternalOrder
participant Warehouse
participant InternalOrder
participant SKU

autonumber
Customer -> GUI : start internal order and add SKUs
GUI -> controllerInternalOrder : POST/api/internalOrders -> createInternalOrder 
controllerInternalOrder -> Warehouse : addInternalOrder
Warehouse -> InternalOrder : InternalOrder
Warehouse <-- InternalOrder : return success
loop for each SKU needed
  Warehouse -> InternalOrder : addSKU(qty)
  Warehouse <-- InternalOrder : return ok
end loop
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 201 Created

Customer -> GUI : confirm IO
GUI -> controllerInternalOrder : PUT/api/internalOrders/:id {ISSUED} -> setIOStatus
controllerInternalOrder -> Warehouse : setIOStatus(id,ISSUED)
Warehouse -> InternalOrder : setStatus(ISSUED)
loop for each SKU in IO
  InternalOrder -> SKU : decreaseAvailableQty
  SKU -> Position : increaseAvailablePos
  SKU <-- Position : return ok
  InternalOrder <-- SKU : return ok
end loop
Warehouse <-- InternalOrder : return ok
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 200 OK

Manager -> GUI : check IO
GUI -> controllerInternalOrder : GET/api/internalOrdersIssued -> getInternalOrdersIssued
controllerInternalOrder -> Warehouse : getInternalOrdersIssued
controllerInternalOrder <-- Warehouse : return list issued
GUI <-- controllerInternalOrder : return 200 OK
Manager <-- GUI : display Issued orders

Manager -> GUI : refuse IO
GUI -> controllerInternalOrder : PUT/api/internalOrders/:id {REFUSED} -> setIOStatus
controllerInternalOrder -> Warehouse : setIOStatus(id,REFUSED)
Warehouse -> InternalOrder : setStatus(REFUSED)
Warehouse <-- InternalOrder : return ok
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 200 OK
@enduml
```

### Scenario 9.3
```plantuml
@startuml
mainframe **Internal Order cancelled**
actor Customer
participant GUI
participant controllerInternalOrder
participant Warehouse
participant InternalOrder
participant SKU

autonumber
Customer -> GUI : start internal order and add SKUs
GUI -> controllerInternalOrder : POST/api/internalOrders -> createInternalOrder 
controllerInternalOrder -> Warehouse : addInternalOrder
Warehouse -> InternalOrder : InternalOrder
Warehouse <-- InternalOrder : return success
loop for each SKU needed
  Warehouse -> InternalOrder : addSKU(qty)
  Warehouse <-- InternalOrder : return ok
end loop
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 201 Created

Customer -> GUI : confirm IO
GUI -> controllerInternalOrder : PUT/api/internalOrders/:id {ISSUED} -> setIOStatus
controllerInternalOrder -> Warehouse : setIOStatus(id,ISSUED)
Warehouse -> InternalOrder : setStatus(ISSUED)
loop for each SKU in IO
  InternalOrder -> SKU : decreaseAvailableQty
  SKU -> Position : increaseAvailablePos
  SKU <-- Position : return ok
  InternalOrder <-- SKU : return ok
end loop
Warehouse <-- InternalOrder : return ok
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 200 OK

Customer -> GUI : delete IO
GUI -> controllerInternalOrder : PUT/api/internalOrders/:id {CANCELED} -> setIOStatus
controllerInternalOrder -> Warehouse : setIOStatus(id,CANCELED)
Warehouse -> InternalOrder : setStatus(CANCELED)
loop for each SKU in IO
  InternalOrder -> SKU : increaseAvailableQty
  SKU -> Position : decreaseAvailablePos
  SKU <-- Position : return ok
  InternalOrder <-- SKU : return ok
end loop
Warehouse <-- InternalOrder : return ok
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 200 OK
@enduml
```

### Scenario 10.1
```plantuml
@startuml
mainframe **Internal Order completed**
actor DeliveryEmployee
participant GUI
participant controllerInternalOrder
participant InternalOrder
participant ControllerSKUItem
participant SKUItem

autonumber
DeliveryEmployee -> GUI : get accepted internal orders
GUI -> controllerInternalOrder : GET/api/inernalOrdersAccepted -> getAcceptedInternalOrders
controllerInternalOrder -> Warehouse : getAcceptedInternalOrders
controllerInternalOrder <-- Warehouse : return IO list
GUI <-- controllerInternalOrder : return IO list
GUI <-- controllerInternalOrder : 200 OK
DeliveryEmployee -> GUI : select internal order
GUI -> controllerInternalOrder : GET/api/internalOrders/:id -> getInternalOrder
controllerInternalOrder -> Warehouse : getInternalOrder
controllerInternalOrder <-- Warehouse : return IO
GUI <-- controllerInternalOrder : 200 OK
loop for each SKUitem set not available
  GUI -> ControllerSKUItem : PUT/api/skuitems/:rfid -> modifySKUItem
  ControllerSKUItem -> Warehouse : modifySKUItem
  Warehouse -> Warehouse : getSKUItem
  Warehouse -> SKUItem : set<Field>
  Warehouse <-- SKUItem : return ok
  ControllerSKUItem <-- Warehouse : return ok
  GUI <-- ControllerSKUItem : 200 OK
end loop

GUI -> controllerInternalOrder : PUT/api/internalOrders/:id {COMPLETED} -> setIOStatus
controllerInternalOrder -> Warehouse : setIOStatus(id,COMPLETED)
Warehouse -> InternalOrder : setStatus(COMPLETED)
Warehouse <-- InternalOrder : return ok
controllerInternalOrder <-- Warehouse : return ok
GUI <-- controllerInternalOrder : return 200 OK
@enduml
```

### Scenario 11.1
```plantuml
@startuml
mainframe **Create Item**
actor Supplier
participant GUI
participant ControllerItem
participant Warehouse
participant Item

autonumber
Supplier -> GUI : insert description, SKUid, price 
GUI -> ControllerItem : POST/api/item -> createItem
ControllerItem -> Warehouse : addItem
Warehouse -> Item : Item

alt id is available
  Warehouse <-- Item : return success
  ControllerItem <-- Warehouse : return success
  GUI <-- ControllerItem : 201 created
else id is already used
  Warehouse <-- Item : return error
  ControllerItem <-- Warehouse : return error
  GUI <-- ControllerItem : 422 Unprocessable Entity
  Supplier <-- GUI : display Error Message
end

@enduml
```

### Scenario 11.2
```plantuml
@startuml
mainframe **Modify Item**
actor Supplier
participant GUI
participant ControllerItem
participant Warehouse
participant Item

autonumber
Supplier -> GUI : insert id, new price and new description
GUI -> ControllerItem : PUT/api/items/:id -> modifyItem
ControllerItem -> Warehouse : modifyItem
Warehouse -> Warehouse : getItem
Warehouse -> Item : set<Field>
Warehouse <-- Item : return ok
ControllerItem <-- Warehouse : return success
GUI <-- ControllerItem : 200 OK

@enduml
```

### Scenario 12.1
```plantuml
@startuml
mainframe **Create Test Description**
actor Manager
participant GUI
participant ControllerTestDescriptor
participant ControllerSKU
participant Warehouse
participant TestDescriptor


autonumber
Manager -> GUI : Refresh SKUs
GUI -> ControllerSKU : GET/api/skus -> getSKUs
ControllerSKU -> Warehouse : getSKUs
ControllerSKU <-- Warehouse : return SKU list
GUI <-- ControllerSKU : 200 OK
Manager -> GUI : M selects SKU
Manager -> GUI : M defines name and procedure description
GUI -> ControllerTestDescriptor : POST/api/testDescriptor -> createTestDescriptor
ControllerTestDescriptor -> Warehouse : addTestDescriptor
Warehouse -> TestDescriptor : TestDescriptor
Warehouse <-- TestDescriptor : return success
ControllerTestDescriptor <-- Warehouse : return success
GUI <-- ControllerTestDescriptor : 201 Created

@enduml
```

### Scenario 12.2
```plantuml
@startuml
mainframe **Update Test Description**
actor Manager
participant GUI
participant ControllerTestDescriptor
participant Warehouse
participant TestDescriptor

autonumber
Manager -> GUI : Refresh Test Descriptors
GUI -> ControllerTestDescriptor : GET/api/testDescriptors -> getTestDescriptors
ControllerTestDescriptor -> Warehouse : getTestDescriptors
ControllerTestDescriptor <-- Warehouse : return T list
GUI <-- ControllerTestDescriptor : 200 OK
Manager -> GUI : M selects T
Manager -> GUI : M update procedure description
GUI -> ControllerTestDescriptor : PUT/api/testDescriptor/:id -> modifyTestDescriptor
ControllerTestDescriptor -> Warehouse : modifyTestDescriptor
Warehouse -> Warehouse : getTestDescriptor
Warehouse -> TestDescriptor : set<Field>
Warehouse <-- TestDescriptor : return success
ControllerTestDescriptor <-- Warehouse : return success
GUI <-- ControllerTestDescriptor : 200 OK

@enduml
```

### Scenario 12.3
```plantuml
@startuml
mainframe **Delete Test Description**
actor Manager
participant GUI
participant ControllerTestDescriptor

autonumber
Manager -> GUI : Refresh Test Descriptors
GUI -> ControllerTestDescriptor : GET/api/testDescriptors -> getTestDescriptors
ControllerTestDescriptor -> Warehouse : getTestDescriptors
ControllerTestDescriptor <-- Warehouse : return T list
GUI <-- ControllerTestDescriptor : 200 OK
Manager -> GUI : M selects T
GUI -> ControllerTestDescriptor : DELETE/api/testDescriptor/:id -> deleteTestDescriptor
ControllerTestDescriptor -> Warehouse : deleteTestDescriptor
ControllerTestDescriptor <-- Warehouse : return success
GUI <-- ControllerTestDescriptor : 204 No Content

@enduml
```
