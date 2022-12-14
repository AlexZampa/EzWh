# Project Estimation  
Date: 09/04/2022

Version: 2.0


# Estimation approach
Consider the EZWH  project as described in YOUR requirement document, assume that you are going to develop the project INDEPENDENT of the deadlines of the course
# Estimate by size
### 
|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   |       50                      |             
| A = Estimated average size per class, in LOC       |        200                  | 
| S = Estimated size of project, in LOC (= NC * A) | 10000 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  |              1000                 |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 30000 | 
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) |    7     |               

# Estimate by product decomposition
### 
|         component name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
| requirement document    | 60 |
| GUI prototype | 40 |
| design document | 40 |
| code | 600 |
| unit tests | 300 |
| api tests | 200 |
| management documents  | 60 |


# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
| Requirements| |
| &emsp;Context analysis | 32 |
| &emsp;Functional requirements | 160 |
| &emsp;Non functional requirements | 96 |
| &emsp;Use cases | 320 |
| Design ||
| &emsp;GUI prototype | 160 |
| &emsp;Define modules | 48 |
| &emsp;Design document | 160 |
| Implementation ||
| &emsp;Code | 960 |
| &emsp;Unit tests | 240 |
| &emsp;Integration tests | 160 |
| &emsp;API tests | 160 |


###
Gantt chart with above activities

![GanttDiagram](./img/GanttDiagram.png)

# Summary

Report here the results of the three estimation approaches. The  estimates may differ. Discuss here the possible reasons for the difference

|             | Estimated effort                        |   Estimated duration |          
| ----------- | ------------------------------- | ---------------|
| estimate by size | 1000 | 7 |
| estimate by product decomposition | 1300 | 9 |
| estimate by activity decomposition | 2500 | 15 |




