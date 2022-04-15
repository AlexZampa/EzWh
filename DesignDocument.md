# Design Document 


Authors: 

Date:

Version:


# Contents

- [Design Document](#design-document)
- [Contents](#contents)
- [Instructions](#instructions)
- [High level design](#high-level-design)
- [Low level design](#low-level-design)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document 

# High level design 

<discuss architectural styles used, if any
report package diagram
The EzWh class can be set as a Singleton class>



# Low level design

<for each package, report class diagram>









# Verification traceability matrix

\<for each functional requirement from the requirement document, list which classes concur to implement it>
| Class | FR |
|:---|:---| 
|Supplier   | 
|Customer   |
|Item       |
|A          | Qty restock item
|RestockOrder |
|TransportNote |
|ReturnOrder |
|SKU        |
|Inventory  |
|SKUItem    |
|AA         | Qty internal order
|TestDescriptor |
|AAA        | Date stock item in position
|TestResult |
|Warehouse  |
|Position   |
|InternalOrder |
| FR1   |   SKU, Inventory, SKUItem, Position, AAA |
| FR2   |   Position, Warehouse |
| FR3   |   SKU, RestockOrder, SKUItem, Supplier, Item, AAA, TransportNote |
| FR4   |   Warehouse, Supplier, Customer   |
| FR5   |   SKU, SKUItem, TestDescriptor, TestResult, AAA, Position, Item, ReturnOrder, RestockOrder |
| FR6   |   SKU, SKUItem, AAA, Position, Item, ReturnOrder, RestockOrder |
| FR7   |   Warehouse, Supplier, Customer   |
| FR9   |   Customer, InternalOrder, Inventory, AA, SKU, SKUItem, AAA, Position |
| FR10  |   Customer, InternalOrder, AA, SKU, SKUItem |
| FR11  |   Supplier, Item, SKU |
| FR12  |   TestDescriptor, SKU |









# Verification sequence diagrams 
\<select key scenarios from the requirement document. For each of them define a sequence diagram showing that the scenario can be implemented by the classes and methods in the design>







