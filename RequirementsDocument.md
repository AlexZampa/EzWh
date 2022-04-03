 #Requirements Document 

Date: 22 march 2022

Version: 0.0

 
| Version number | Change |
| ----------------- |:-----------|
| | | 


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	- [Context Diagram](#context-diagram)
	- [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	- [Functional Requirements](#functional-requirements)
	- [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	- [Use case diagram](#use-case-diagram)
		- [Use case 1, UC1](#use-case-1-uc1)
				- [Scenario 1.1](#scenario-11)
				- [Scenario 1.2](#scenario-12)
				- [Scenario 1.x](#scenario-1x)
		- [Use case 2, UC2](#use-case-2-uc2)
		- [Use case 1 (User - LogIn), UC1](#use-case-1-user---login-uc1)
		- [Use case 2 (User - LogOut), UC2](#use-case-2-user---logout-uc2)
		- [Use case 3 (Manager - Manage availability of items), UC3](#use-case-3-manager---manage-availability-of-items-uc3)
				- [Scenario 3.1](#scenario-31)
				- [Scenario 3.2](#scenario-32)
				- [Scenario 3.3](#scenario-33)
		- [Use case 4 (Manager - Manage order), UC4](#use-case-4-manager---manage-order-uc4)
				- [Scenario 4.1](#scenario-41)
				- [Scenario 4.2](#scenario-42)
				- [Scenario 4.3](#scenario-43)
				- [Scenario 4.4](#scenario-44)
		- [Use case 5 (Administrative 1 - physical space), UC5](#use-case-5-administrative-1---physical-space-uc5)
				- [Scenario 5.1](#scenario-51)
				- [Scenario 5.2](#scenario-52)
				- [Scenario 5.3](#scenario-53)
				- [Scenario 5.4](#scenario-54)
		- [Use case 6 (Administrative 2 - receive items), UC6](#use-case-6-administrative-2---receive-items-uc6)
		- [Use case 7 (Administrative 3 - manage internal order), UC7](#use-case-7-administrative-3---manage-internal-order-uc7)
		- [Use case 8 (Quality office - apply test), UC8](#use-case-8-quality-office---apply-test-uc8)
	- [|  Exceptions     | B is not registered: T cannot be applied (U returns B to administrative office, where it should have been before it arrived at quality office). T is not descripted: U can add a description or delete it. |](#--exceptions------b-is-not-registered-t-cannot-be-applied-u-returns-b-to-administrative-office-where-it-should-have-been-before-it-arrived-at-quality-office-t-is-not-descripted-u-can-add-a-description-or-delete-it-)
		- [Use case 9 (Supplier - manage requested items), UC9](#use-case-9-supplier---manage-requested-items-uc9)
				- [Scenario 9.1](#scenario-91)
			- [Scenario 9.2](#scenario-92)
				- [Scenario 9.3](#scenario-93)
	- [|  4	 | User U confirms abort operation |](#--4--user-u-confirms-abort-operation-)
		- [Use case 10 (Supplier - show order list), UC10](#use-case-10-supplier---show-order-list-uc10)
				- [Scenario 10.1](#scenario-101)
			- [Scenario 10.2](#scenario-102)
	- [|  3     | list change showing only orders of the status selected |](#--3------list-change-showing-only-orders-of-the-status-selected-)
		- [Use case 11 (Supplier - process order), UC11](#use-case-11-supplier---process-order-uc11)
				- [Scenario 11.1](#scenario-111)
			- [Scenario 11.2](#scenario-112)
	- [|  6	 | User U confirms abort operation |](#--6--user-u-confirms-abort-operation-)
		- [Use case 12 (Organizational Unit - issue internal order), UC12](#use-case-12-organizational-unit---issue-internal-order-uc12)
				- [Scenario 12.1](#scenario-121)
			- [Scenario 12.2](#scenario-122)
			- [Scenario 12.3](#scenario-123)
				- [Scenario 12.4](#scenario-124)
				- [Scenario 12.5](#scenario-125)
	- [|  5     | Input fields with error are highlighted |](#--5------input-fields-with-error-are-highlighted-)
		- [Use case 13 (Organizational Unit - show order list), UC13](#use-case-13-organizational-unit---show-order-list-uc13)
				- [Scenario 13.1](#scenario-131)
			- [Scenario 13.2](#scenario-132)
	- [|  4     | list change showing only orders of the status selected |](#--4------list-change-showing-only-orders-of-the-status-selected-)
		- [Use case 14 (Organizational Unit - process order), UC14](#use-case-14-organizational-unit---process-order-uc14)
				- [Scenario 14.1](#scenario-141)
			- [Scenario 14.2](#scenario-142)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|   Medium companies and retailers |	Need the software application to manage their warehouses	|
|	Managers | Supervises the warehouse and manages orders	|
|	Suppliers	| Need to supply items purchased by the company	|
|	Quality office	|	Performs quality on items and choose whether to return them	|
|	Organizational Unit	|	May request items from the warehouse	|
|	Warehouse worker	|	Tracks the items, the free space and collects the items for delivery	|
|	Warehouse Administrative | Track incoming and outgoing flow of items |
|	System administrator	|	Manages the functioning of the app	|
| 	Competitors | Other Warehouse Management System |
| 	Warehouse | Physical space available to store items |

# Context Diagram and interfaces

## Context Diagram
<!--\<Define here Context diagram using UML use case diagram>-->

![ContectDiagram](./img/ContextDiagram.png)
<!--\<actors are a subset of stakeholders>-->

## Interfaces
<!--\<describe here each interface in the context diagram>-->

<!--\<GUIs will be described graphically in a separate document>-->

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|   Quality Office    | GUI | Screen, keyboard |
|	Manager	|	GUI		|	Screen, keyboard	|
|	Warehouse worker	|	GUI	|	Tablet	|
|	Warehouse Administrative | GUI | Screen, keyboard |
|	Organizational Unit	| GUI | Screen, keyboard |
|	System administrator | GUI | Screen, keyboard |
|	Supplier | GUI | Screen, keyboard |
| 	Warehouse | ???? |

# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>


# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

| ID        | Description  |
| ------------- |:-------------:| 
| FR1     | Manage users (Administrator) |
|  	FR1.1   | Create users  |
|	FR1.2	|	Delete users	|
|	FR1.3	|	Modify users	|
| FR2     | Manage item |
|  	FR2.1   | Manage itemDescriptor  |
|  	 FR2.1.1   | Create itemDescriptor  |
|	 FR2.1.2   | Delete itemDescriptor	|
|	 FR2.1.3	| Modify itemDescriptor	|
| 	FR2.2  | Manage physical items |
|  	 FR2.2.1   | Add item  |
|	 FR2.2.2   | Remove item	|
|	FR2.3 | Manage Batch |
|	 FR2.3.1 | Add Batch |
|	 FR2.3.2 | Remove Batch |
|	 FR2.3.3 | Modify Batch |
|	 FR2.3.4   | Set position of batch |
| FR3  | Manage availability of items (Manager) |
| 	FR3.1 | Show quantity per item |
| 	FR3.2 | Notify when items are under a given quantity threshold |
| 	FR3.3 | Set the quantity threshold |
| FR4 |	Manage order (Manager) |
| 	FR4.1 | show suppliers per item |
|	FR4.2 | Issue order |
|	FR4.3 | Complete order |
|	FR4.4 | Show order status |
| FR5 | Manage suppliers |
| 	FR5.1 | Add offer on item descriptor (Supplier) |
| 	FR5.2 | Update offer (Supplier) |
| 	FR5.3 | Delete offer (Supplier) |
| FR6 | Manage quality check |
|   FR6.1 | Manage test |
|     FR6.1.1 | Describe new test |
|     FR6.1.2 | Modify test |
|     FR6.1.3 | Delete test |
|     FR6.1.4 | Associate test with item descriptor |
|   FR6.2 | Apply test (Quality office) |
| 	  FR6.2.1 | Add test result |
| 	  FR6.2.2 | Reject items |
| 	  FR6.2.3 | Accept items |
| FR7 | Manage Warehouse physical space (Warehouse administrative) |
| 	FR7.1 | Manage Section |
| 	  FR7.1.1 | Add new Section |
| 	  FR7.1.2 | Delete Section |
| 	FR7.2 | Manage Lane |
| 	  FR7.2.1 | Add new Lane |
| 	  FR7.2.2 | Delete Lane |
| 	FR7.3 | Manage Shelf |
| 	  FR7.2.1 | Add new Shelf |
| 	  FR7.2.2 | Delete Shelf |
| 	FR7.4 | Manage Slot |
| 	  FR7.4.1 | Add new Slot |
| 	  FR7.4.2 | Delete Slot |
| 	  FR7.4.2 | Set slot dimension |
| FR8 | Locate items |
| FR9 | Track free space |
| FR10 | Manage internal order |
| 	FR10.1 | Issue internal order (Organizational Unit) |
|	FR10.2 | Accept internal order|
| 	 FR10.2.1 | Collect items |
| 	 FR10.2.2 | Ship items |
|	FR10.3 | Show internal order status |



## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Efficiency  | Memory large enough to store all items | FR2, FR4, FR6 |
|  NFR2     | Efficiency | Response time less than 1s | For all FR |
|  NFR3     | Usability | Low effort for GUI usability | For all FR |
|  NFR4 | Reliability | Should be available during working hours | For all FR |
|  NFR5 | Maintainability | less than 1hr to recover from an error | For all FR |
|  NFR6 | Security | Authentication and authorization before all operations | For all FR |
|  NFR7 | Safety | report hazardous material | FR2 FR5 FR8 |

# Use case diagram and use cases

## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>
![UseCaseDiagram](./img/UseCaseDiagram.png)


\<next describe here each use case in the UCD>
### Use case 1, UC1
| Actors Involved        |  |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | \<Textual description of actions executed by the UC> |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

##### Scenario 1.1 

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the scenario can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after scenario is finished> |
| Step#        | Description  |
|  1     |  |  
|  2     |  |
|  ...     |  |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2
..

### Use case 1 (User - LogIn), UC1
| Actors Involved        | User |
| ------------- |:-------------:| 
|  Precondition     | User U exists |
|  Post condition     | The user has logged in |
|  Nominal Scenario     | U knows Username UN and Password P; he types them in the dedicated fields; U logs in |
|  Variants     | None |
|  Exceptions     | U types wrong UN or P; U doesn't exist; U has been removed |

### Use case 2 (User - LogOut), UC2
| Actors Involved        | User |
| ------------- |:-------------:| 
|  Precondition     | User U exists and has logged in |
|  Post condition     | The user has logged out |
|  Nominal Scenario     | U clicks on the appropriate button to log out |
|  Variants     | None |
|  Exceptions     | None |

### Use case 3 (Manager - Manage availability of items), UC3
| Actors Involved        | Manager |
| ------------- |:-------------:| 
|  Precondition     | Manager M has logged in as User U; Item I exists |
|  Post condition     | All Is have been checked |
|  Nominal Scenario     | M selects an I; M checks the availability of that item; |
|  Variants     | M is notified when I are few; M sets the quantity threshold T of I before notification; M checks the quantity of I |
|  Exceptions     | I doesn't exist; T is not valid |

##### Scenario 3.1

| Scenario 3.1 | Show quantity per item |
| ------------- |:-------------:| 
|  Precondition     | Item I exists |
|  Post condition     | M is shown the quantity Q of I |
| Step#        | Description  |
|  1     | M selects the procedure to check Q |  
|  2     | The app prompts for the ID of I |
|  3	 | M types the ID	|
|  3     | Q of I is shown |

##### Scenario 3.2

| Scenario 3.2 | Notify when items are under a given quantity threshold |
| ------------- |:-------------:| 
|  Precondition     | Item I exists; a threshold T has been set |
|  Post condition     | M is notified of a low Q of I |
| Step#        | Description  |
|  1     | The app detects that the Q of I is lower than T |  
|  2	 | The app notifies M |
|  3 	 | M reads the notification |

##### Scenario 3.3

| Scenario 3.3 | Set the quantity threshold |
| ------------- |:-------------:| 
|  Precondition     | Item I exists |
|  Post condition     | Q is accepted as a valid threshold |
| Step#        | Description  |
|  1     | M selects the procedure to set a T |  
|  2	 | M selects I |
|  3 	 | M types the minimum Q |

### Use case 4 (Manager - Manage order), UC4	
| Actors Involved        | Manager |
| ------------- |:-------------:| 
|  Precondition     | Manager M has logged in as User U; Item I exists; Supplier S exists; I is in low stock |
|  Post condition     | The order has been managed successfully |
|  Nominal Scenario     | M is notified that I is in low stock; M issues the order O from S and manages it until it is completed |
|  Variants     | M checks how many S are available for each I; M issues the order; M selects the order as completed; M checks the order status |
|  Exceptions     | I doesn't exist; S is not valid; O doesn't exist; O has already been completed |

##### Scenario 4.1

| Scenario 4.1 | Show suppliers per item |
| ------------- |:-------------:| 
|  Precondition     | Item I exists |
|  Post condition     | M is shown all the S for I |
| Step#        | Description  |
|  1     | M selects the procedure to check S for I |  
|  2     | The app prompts for the ID of I |
|  3	 | M is shown the list of S and can select one for later orders |

##### Scenario 4.2

| Scenario 4.2 | Issue order |
| ------------- |:-------------:| 
|  Precondition     | I exists; M has been notified that I is in short supply; S exists |
|  Post condition     | Order O has been issued |
| Step#        | Description  |
|  1     | M selects the option to issue a new O |  
|  2	 | M selects the I typing its ID  |
|  3 	 | M selects the Q of I |
|  4	 | M selects the S typing its ID |
|  5	 | M issues the order |
|  6	 | The app automatically generates a new ID for O |

##### Scenario 4.3

| Scenario 4.3	 | Complete order |
| ------------- |:-------------:| 
|  Precondition     | I exists; S exists; O exists and has been delivered  |
|  Post condition     | O is set as completed |
| Step#        | Description  |
|  1     | M selects the procedure to set the O as completed |  
|  2	 | M types the ID of O |
|  3 	 | M sets O as completed |

##### Scenario 4.4

| Scenario 4.4	 | Show order status |
| ------------- |:-------------:| 
|  Precondition     | I exists; S exists |
|  Post condition     | O is set as completed |
| Step#        | Description  |
|  1     | M selects the procedure to check the status of O |  
|  2	 | M types the ID of O |
|  3 	 | The app prompts the actual status of O (issued, shipped, delivered, completed) |

### Use case 5 (Administrative 1 - physical space), UC5
| Actors Involved        |  Warehouse administrative |
| ------------- |:-------------:| 
|  Precondition     | Warehouse W exists, section S exists, user U exists and is logged in as "Warehouse administrative" |
|  Post condition     | Lane L is created |
|  Nominal Scenario     | U selects the section S; U starts the procedure to add a new lane; the app generates automatically a new id for the lane; U changes the id into "L"; U submits the procedure. |
|  Variants     | With an equivalent procedure it is possible to add new warehouses, sections, shelves and slots (Precondition: the hyerarchical upper level exists - nothing in case of warehouse -; post condition: the entity is created). Some little differences explained in the scenarios below. When an entity exists, U can also modify its id, adjacences and slot dimension where present, or delete it. |
|  Exceptions     | The id chosen by U already exists into the upper-level entity: U has to enter another id. |

##### Scenario 5.1

| Scenario 5.1 | Add new warehouse |
| ------------- |:-------------:| 
|  Precondition     | User U exists and is logged in as "Warehouse administrative" |
|  Post condition     | Warehouse W is created |
| Step#        | Description  |
|  1     | U starts the procedure to add a new warehouse |
|  2     | The app generates automatically a new id for the warehouse |
|  4     | U changes the id into "W" |
|  5     | U sets the dimension of warehouse's slots |
|  6     | U submits the procedure |

##### Scenario 5.2 

| Scenario 5.2 | Add new section |
| ------------- |:-------------:| 
|  Precondition     | Warehouse W exists, user U exists and is logged in as "Warehouse administrative" |
|  Post condition     | Section S is created |
| Step#        | Description  |
|  1     | U selects warehouse W |  
|  2     | U starts the procedure to add a new section |
|  3     | The app generates automatically a new id for the section |
|  4     | U changes the id into "S" |
|  5     | U selects a list of adjacent sections |
|  6     | U submits the procedure |

##### Scenario 5.3

| Scenario 5.3 | Add new slots |
| ------------- |:-------------:| 
|  Precondition     | Warehouse W, Section S, Lane L and Shelf A exist, user U exists and is logged in as "Warehouse administrative" |
|  Post condition     | A has 100 new slots |
| Step#        | Description  |
|  1     | U selects Shelf A |  
|  2     | U starts the procedure to add new slots |
|  3     | U selects the number of new slots: 100 |
|  4     | The app generates automatically new id for the slots |
|  5     | U accepts all the proposed id |
|  6     | U submits the procedure |

##### Scenario 5.4

| Scenario 5.1 | Delete a Shelf |
| ------------- |:-------------:| 
|  Precondition     | Shelf A exists, A contains no slots or empty slots, user U exists and is logged in as "Warehouse administrative" |
|  Post condition     | A is deleted |
| Step#        | Description  |
|  1     | U selects shelf A |
|  2     | U selects the option "delete" |
|  4     | The app asks for confirmation |
|  5     | U confirms |

### Use case 6 (Administrative 2 - receive items), UC6
| Actors Involved        |  Warehouse administrative |
| ------------- |:-------------:| 
|  Precondition     | Order O has been sent to supplier S, batch B of items descripted by item descriptor D arrived to warehouse, user U exists and is logged in as "Warehouse administrative" |
|  Post condition     | B is ready to be stored |
|  Nominal Scenario     | U checks that kind and quantity of items are compliant with O; U registers B and the items in it; U sees that D needs the test T; U sends B to the Quality Office; U waits for test result; U is notified that T has been passed; U sets the action "store" for the items included in B and a warehouse worker. |
|  Variants     | D needs no tests: points 4, 5, 6 are skipped. D needs more than one test: U waits that all tests have been passed |
|  Exceptions     | B not compliant with O: Items are not even registered, U calls a manager to handle the situation. B does not pass a test: B is marked as refused and is not stored, the return to the supplier is not handled by EzWh app. |

### Use case 7 (Administrative 3 - manage internal order), UC7
| Actors Involved        |  Warehouse administrative |
| ------------- |:-------------:| 
|  Precondition     | Organizational Unit OU has issued an internal order IO, user U exists and is logged in as "Warehouse administrative" |
|  Post condition     | Requested items are ready at the pick up point |
|  Nominal Scenario     | U selects IO; U checks that all the item requested are present in the warehouse; U sets the action "collect" associated to IO and a warehouse worker; U waits until the action is completed; U sets the action "ship" for IO and another warehouse worker; U is notified that the action has been completed.  |
|  Variants     | If IO is huge, U can set more than one action "collect" or "ship", involving different warehouse workers |
|  Exceptions     | Some of requested items not present: U can decide if send immediately the present ones and complete IO later with the missing ones, or freeze the whole order until all items are available. Action collect returns "not found": possible fatal error detected (outgoing flow not tracked or phantom incoming flow), special situation handled by a higher-level manager, IO handled as "item not present" |

### Use case 8 (Quality office - apply test), UC8
| Actors Involved        |  Quality office |
| ------------- |:-------------:| 
|  Precondition     | Batch B arrived in quality office, B is registered, test T exists, user U exists and is logged in as "Quality office" |
|  Post condition     | B is accepted |
|  Nominal Scenario     | U selects the batch B; among the tests needed by B, U selects the test T; after the test has been executed, U selects "passed"; U submits the test result. |
|  Variants     | U can read the description of the test to apply. Test not passed: at point 3 U selects "not passed". U can define a new test for the descriptor of items included in B, modify the description of a test or delete it |
|  Exceptions     | B is not registered: T cannot be applied (U returns B to administrative office, where it should have been before it arrived at quality office). T is not descripted: U can add a description or delete it. |
------------------------------------------------------------------------------------------------------------------------------------

### Use case 9 (Supplier - manage requested items), UC9
| Actors Involved        | Supplier |
| ------------- |:-------------:| 
|  Precondition     | User U authenticated and authorized as "Supplier" |
|  Post condition   | associated or not item descriptor D to user U |
|  Nominal Scenario | show list of item needed by company, user U selects items that produces |
|  Variants     	| User U searches the item descriptor D by its name |
|  Exceptions     	| user U aborts the operation |

##### Scenario 9.1

| Scenario 9.1 | |
| ------------- |:-------------:| 
| Nominal Scenario | | 
| Precondition     | User U authenticated and authorized as "Supplier" |
| Post condition   | Associated one or more item descriptor D to user U |
| Step#        	   | Description  |
|  1     | User U selects item descriptor D from list | 
|  2     | User U sets the item decriptor D as available |
|  3     | User U confirms operation |

#### Scenario 9.2

| Scenario 9.2 |  |
| ------------- |:-------------:| 
| Variant Scenario | User U searches item descriptor D by item name | 
| Precondition     | User U authenticated and authorized  as "Supplier" |
| Post condition   | associated one or more item descriptor D to user U |
| Step#        	   | Description  |
|  1     | User U searches item descriptor D by its name |  
|  2     | User U sets the item decriptor D as available |
|  3     | User U confirms operation |

##### Scenario 9.3

| Scenario 9.3 | |
| ------------- |:-------------:| 
| Exceptional Scenario | User U aborts operation | 
| Precondition     | User U authenticated and authorized  as "Supplier" |
| Post condition   | nothing changed |
| Step#        	   | Description  |
|  1     | User U selects item descriptor D from list or by searching it | 
|  2     | User U sets the item decriptor D as available |
|  3     | User U aborts the operation |
|  4	 | User U confirms abort operation |
-----------------------------------------------------------------------------------------------------

### Use case 10 (Supplier - show order list), UC10
| Actors Involved        | Supplier |
| ------------- |:-------------:| 
|  Precondition     | User U authenticated and authorized as "Supplier" |
|  Post condition   | show list of user orders |
|  Nominal Scenario | show list of all orders of the user |
|  Variants     	| show list of orders filtered by status |

##### Scenario 10.1

| Scenario 10.1 | |
| ------------- |:-------------:| 
| Nominal Scenario | | 
| Precondition     | User U authenticated and authorized as "Supplier" |
| Post condition   | show list of all user U orders |
| Step#        	   | Description  |
|  1	 | A list of all user U orders is shown with orderID, date, status and Quality Check problems |
|  2     | User U can scroll list to see all orders | 

#### Scenario 10.2

| Scenario 10.2 | |
| ------------- |:-------------:| 
| Variant Scenario | User U filters list by order status | 
| Precondition     | User U authenticated and authorized as "Supplier" |
| Post condition   | show list of user U orders filtered by status |
| Step#        	   | Description  |
|  1	 | A list of all user U orders is shown with orderID, date, status and Quality Check problems |
|  2     | User U selects a filter (status completed, pending, or all) |
|  3     | list change showing only orders of the status selected |
--------------------------------------------------------------------------------------------------------------

### Use case 11 (Supplier - process order), UC11
| Actors Involved        | Supplier |
| ------------- |:-------------:| 
|  Precondition     | User U authenticated and authorized as "Supplier"|
|  Post condition   | items of an orders set as delivered |
|  Nominal Scenario | user U selects order from order list and process order |
|  Exceptions     	| user U aborts the operation |

##### Scenario 11.1

| Scenario 11.1 | |
| ------------- |:-------------:| 
| Nominal Scenario | | 
| Precondition     | User U authenticated and authorized as "Supplier" |
| Post condition   | items I of an orders set as delivered |
| Step#        	   | Description |
|  1	 | User U selects an order O |
|  2     | user U wants to see order details of the order O selected | 
|  3	 | A list of all items I of the order O is shown with quantity and a delivered field (already delivered item rows are disabled) |
|  4	 | User U checks one or more item(s) I as delivered |
|  5	 | User U confirms operation |

#### Scenario 11.2

| Scenario abe.2 | |
| ------------- |:-------------:| 
| Exception Scenario | User U abort operation | 
| Precondition     | User U authenticated and authorized as "Supplier" |
| Post condition   | nothing changed |
| Step#        	   | Description  |
|  1	 | User U selects an order O |
|  2     | user U wants to see order details of the order O selected | 
|  3	 | A list of all items I of the order O is shown with quantity and a delivered field (already delivered item rows are disabled) |
|  4	 | User U checks one or more item(s) as delivered |
|  5     | User U aborts the operation |
|  6	 | User U confirms abort operation |
---------------------------------------------------------------------------------------------------------
<!-- USE CASES ORGANIZATIONAL UNIT -->

### Use case 12 (Organizational Unit - issue internal order), UC12
| Actors Involved        | Organizational Unit |
| ------------- |:-------------:| 
|  Precondition     | User U authenticated and authorized as "Organizational Unit" |
|  Post condition   | New internal order IO issued |
|  Nominal Scenario | User U selects items from inventory, add quantity and issue order IO |
|  Variant Scenario | User U searches item I by its name, filter by category | 
|  Exceptions     	| user U aborts the operation, quantity invalid |

##### Scenario 12.1

| Scenario 12.1 | |
| ------------- |:-------------:| 
| Nominal Scenario | | 
| Precondition     | User U authenticated and authorized as "Organizational Unit" |
| Post condition   | New internal order IO issued |
| Step#        	   | Description  |
|  1	 | A list of all items in the inventory of the Warehouse is shown with itemID, item name and category |
|  2	 | User U sets quantity to one or more item(s) |
|  3     | User U confirms operation |
|  4	 | Quantity input fields checks are passed |

#### Scenario 12.2

| Scenario 12.2 | |
| ------------- |:-------------:| 
| Variant Scenario | User U searches item I by item name | 
| Precondition     | User U authenticated and authorized as "Organizational Unit" |
| Post condition   | New internal order IO issued |
| Step#        	   | Description  |
|  1	 | A list of all items in the inventory of the Warehouse is shown with ItemID, itemName and Category |
|  2	 | User U searches item I by item name |
|  3	 | User U sets quantity to the item I |
|  4     | User U confirms operation |
|  5	 | Quantity input fields checks are passed |

#### Scenario 12.3

| Scenario 12.3 | |
| ------------- |:-------------:| 
| Variant Scenario | User U filters item by category | 
| Precondition     | User U authenticated and authorized as "Organizational Unit" |
| Post condition   | New internal order IO issued |
| Step#        	   | Description  |
|  1	 | A list of all items in the inventory of the Warehouse is shown with ItemID, itemName and Category |
|  2	 | User U filters inventory by item category |
|  3	 | User U sets quantity to one or more item(s) |
|  4     | User U confirms operation |
|  5	 | Quantity input fields checks are passed |

##### Scenario 12.4

| Scenario 12.4 | |
| ------------- |:-------------:| 
| Exception Scenario | User U aborts operation | 
| Precondition     | User U authenticated and authorized as "Organizational Unit" |
| Post condition   | New internal order IO issued |
| Step#        	   | Description  |
|  1	 | A list of all items in the inventory of the Warehouse is shown with itemID, item name and Category |
|  2	 | User U sets quantity to one or more item(s) |
|  3     | User U aborts the operation |
|  4	 | User U confirms abort operation |

##### Scenario 12.5

| Scenario n.5 | |
| ------------- |:-------------:| 
| Exception Scenario | Quantity value checks failed | 
| Precondition     | User U authenticated and authorized as "Organizational Unit" |
| Post condition   | Wrong input field are highlighted |
| Step#        	   | Description |
|  1	 | A list of all items in the inventory of the Warehouse is shown with itemID, item name and Category |
|  2	 | User U sets quantity to one or more item(s) |
|  3     | User U confirms operation |
|  4	 | One or more quantity input fields checks are failed |
|  5     | Input fields with error are highlighted |
------------------------------------------------------------------------------------------------------------

### Use case 13 (Organizational Unit - show order list), UC13
| Actors Involved        | Organizational Unit |
| ------------- |:-------------:| 
|  Precondition     | User U authenticated and authorized as "Organizational Unit" |
|  Post condition   | Show list of user U orders |
|  Nominal Scenario | Show list of all orders of the user U |
|  Variants     	| Show list of orders filtered by status |

##### Scenario 13.1

| Scenario abg.1 | |
| ------------- |:-------------:| 
| Nominal Scenario | | 
| Precondition     | User U authenticated and authorized as "Organizational Unit" |
| Post condition   | Show list of all user U orders |
| Step#        	   | Description  |
|  1	 | A list of all user orders is shown with orderID, date and order status |
|  2     | User can scroll list to see all orders |

#### Scenario 13.2

| Scenario abg.2 | |
| ------------- |:-------------:| 
| Variant Scenario | User U filters list by order status | 
| Precondition     | User U authenticated and authorized as "Organizational Unit" |
| Post condition   | Show list of user U orders filtered by status |
| Step#        	   | Description  |
|  2	 | A list of all user U orders is shown with orderID, date and order status |
|  3     | User U selects a filter (status completed, pending, or all) |
|  4     | list change showing only orders of the status selected |
------------------------------------------------------------------------------------------------------------------

### Use case 14 (Organizational Unit - process order), UC14
| Actors Involved        | Organizational Unit |
| ------------- |:-------------:| 
|  Precondition     | User U authenticated and authorized as "Organizational Unit" |
|  Post condition   | Items of an orders set as delivered |
|  Nominal Scenario | User U selects order O from order list and process order O |
|  Exceptions     	| User U aborts the operation |

##### Scenario 14.1

| Scenario 14.1 | |
| ------------- |:-------------:| 
| Nominal Scenario | | 
| Precondition     | User U authenticated and authorized as "Organizational Unit" |
| Post condition   | Items of order O set as delivered |
| Step#        	   | Description  |
|  1	 | User U selects an order O |
|  2     | user U wants to see the order details of the order O selected | 
|  3	 | A list of all items of the order O is shown with quantity and a delivered field (already delivered item rows are disabled) |
|  4	 | User U checks one or more item(s) as delivered |
|  5	 | User U confirms operation |

#### Scenario 14.2

| Scenario 14.2 | |
| ------------- |:-------------:| 
| Exception Scenario | User U aborts operation | 
| Precondition     | User U authenticated and authorized as "Organizational Unit"|
| Post condition   | nothing changed |
| Step#        	   | Description  |
|  1	 | User U selects an order O |
|  2     | User U wants to see order details of the order O selected | 
|  3	 | A list of all items of the order O is shown with quantity and a delivered field (already delivered item rows are disabled) |
|  4	 | User U checks one or more item(s) as delivered |
|  5     | User U aborts the operation |
|  6	 | User U confirms abort operation |



# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

![UseCaseDiagram](./img/Glossary.jpg)

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >

![UseCaseDiagram](./img/DeploymentDiagram.png)



