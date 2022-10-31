# EzWh

`EzWh` is a software application to:
- manage suppliers and restock orders;
- manage the reception of ordered items;
- manage internal orders and deliveries.

Team project for the exam of the course `Software Engineering I` of "Politecnico of Turin`. 

The server of the application was implemented using `node.js` with the web framework ` Express` and tested using the testing framework `Jest` and `Mocha`.

To read the complete requirements check the file `OfficialRequirements.md`.

### Project Layout

The application was delivered following the Waterfall software process.
The repo contains:
- requirement documents
    - `/OfficialRequirements.md`: contains the complete and official requirements of the project
    - `/RequirementsDocument.md`: contains the functional and non functional requirements, the stories and personas, the use case diagrams, the glossary, the system design and the deployment diagram
    - `/change1/`: folder that contains the requirements changed during the development of the project
- design documents
    - `/DesignDocument.md`: contains the high and low level design and the verifications sequence diagrams (written usign 'plantuml')
    - `/UML/Diagrams.mdj`: contains the design of the application using UML (written using 'StarUML')
    - `/GUIPrototype.md`: contains all the prototypes of the GUI
    - `/API.md`: contains the definitions of the APIs implemented by the server
- code
    - `/code/server`: contains the source code of the server
    - `/code/client`: contains the source code of the client (already given by the course and not implemented by us)
- test cases
    - `/UnitTestReport.md`: contains the criteria for the black box and white box unit tests
    - `/APITestReport.md`: contains the dependency graph, the integration approach and the coverage of the requirements
    - `/code/server/unit_test`: contains all the unit tests
    - `/code/sevrer/test`: contains all the integration tests
    - `/code/server/acceptanceTest`: contains all the acceptance tests
- estimation document
    - `/Estimation.md`: contains the estimation of the project
    - `/GANTT/`: folder that contains the estimation using the Gantt diagram
    - `/TimeSheet.md`: contains the effort (in person hours) spent per week and per activity

