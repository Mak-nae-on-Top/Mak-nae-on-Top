# ♚Mak-nae-on-Top

Development of an optimization route guide application for indoor fire evacuation using beacons

<br>

![npm 8.3.1](https://img.shields.io/badge/npm-8.3.1-blue.svg)
![react native 0.66.4](https://img.shields.io/badge/react%20native-0.66.4-blue.svg)
![react 17.0.2](https://img.shields.io/badge/react-17.0.2-blue.svg)
![Spring Boot 2.0](https://img.shields.io/badge/Spring%20Boot-2.0-green.svg)
![Mysql 5.6](https://img.shields.io/badge/Mysql-5.6-green.svg)
![JDK 1.8](https://img.shields.io/badge/JDK-1.8-green.svg)
![license](https://img.shields.io/badge/license-MIT-orange.svg)

<br>

## 🗺️Table of Contents

- [Introduction](#Introduction)
  - Novelty
  - IEEE Paper
- [Structure](#Structure)
- [Application](#Application)
  - Setup
  - Implementation
- [Algorithm](#Algorithm)
  - A\* algorithm
  - Trilaterration
- [Server](#Server)
  - Setup
  - Diagram
- [IoT(Arduino)](#IoT)
  - System Overview
- [📌Contributors](#Contributors)

<br>

# 📝Introduction

Still, damage to fire accidents continues to occur. According to the U.S. Fire Administration, the average number of fire accidents from 2010 to 2019 was 1,300,000.
In detail, in 2019, 40.4% were externally occurring fires, 29.9% in residential spaces, 15.1% in vehicles, 9.4% in non-residential spaces, and 5.2% in other areas, and 39.3% of fires in buildings can be confirmed.
In order to prevent accidents involving indoor fires, this study was conducted by developing an app that informs the optimal route for indoor fire evacuation by using beacons.

<br>

> ### Novelty

    1. Use beacons to determine the exact location of the user in the building.

    2. Develop user-friendly application such as informing users of the beacon installation location by providing users with the ability to upload and modify building blueprints.

    3. Identify the density of people in the building and calculate the weight value to inform the optimal path.

<br>

> ### IEEE Paper

We are currently working on a fix.

[Link to our paper](https://github.com/Mak-nae-on-Top/Mak-nae-on-Top/blob/main/Development_of_an_optimization_route_guide_application_for_indoor_fire_evacuation_using_beacons.pdf)

<br>
<br>

# 🍌Structure

> Structure

<p align="center"><img src="./Image/system.png" style="width:700px"></p>

    1. When the manager uploads a blueprint for each floor, the application converts it to a map.
    2. When the manager enters the name of each room, the user’s location data is obtained using bluetooth beacon.
    3. In peacetime, the application shows an optimized route to the destination that the user wants.
    4. In the event of a fire, a fire alarm that is linked to the server notifies the server of the occurrence of the fire, and the server notifies the user of the fire through the application.
    5. The application displays the fastest escape route from the current user location on the map considering the current population cluster.

<br>
<br>

# 🎙️Application

> ### 1. Setup

    코드 위치 링크로
    사용한 툴과 코드 실행 방법

> ### 2. Implementation

<br>

- Sidebar
- Beacon detecting
- Set destination
- Login / Signup
- Upload blueprint
- Connect to server
- Coordinates with Canvas

<br>
<br>

# 🍚Algorithm

> ### 1. A\* algorithm

<br>

<p align="center"><img src="./Image/route.png" style="width:1200px"></p>

    1. 휴리스틱 함수 h(n)을 이용해서 A알고리즘에게 현재 위치n에서 목표까지의 최소비용을 산정한다.
    2.
    3.
    4.

<br>
<br>

> ### 2. Trilaterration

<br>

<p align="center"><img src="./Image/trilateration.png" style="width:600px"></p>

<br>

Using Tx Power (transmission strength) and RSSI (reception strength), the straight-line distance between a beacon and a smart device can be calculated. After installing at least 3 beacons, measure the indoor location by trilaterration.

    1. Nodes A, B, and C are the locations where the beacon is installed, and D is the location (x,y) of the smart device.
    2. The calculated distances from nodes A, B, and C to the smart devices are e, f, and g D, respectively, which is determined using the path loss model.

<br>
<br>

# 🌳Server

> ### 1. Setup

    [Server code git link](https://github.com/Mak-nae-on-Top/Server)  
    - Server: Spring boot 2.6.3  
    - Database: MariaDB  
    - Executable file location: Server/build/libs/demo.0.0.1-SNAPSHOT.jar  


> ### 2. Diagram

<br>
<br>

# 📹IoT

<p align="center"><img src="./Image/trilateration.png" style="width:600px"></p>

    1.
    2.
    3.
    4.

> ### 1. System Overview

<br>
<br>

# 📌Contributors

| Name                                                                                                              | Univ                   | Major                          | Where to find you                       | Role      |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------ | --------------------------------------- | --------- |
| Junseong Moon <br /> <img src="https://avatars.githubusercontent.com/u/28281779?v=4" width="100" />               | Jeju National Univ     | Software convergence education | [Github](https://github.com/gnoes)      | Paper     |
| Namho Kim <br /> <img src="https://avatars.githubusercontent.com/u/34561570?v=4" width="100" />                   | Chungnam National Univ | Computer Science Engineering   | [Github](https://github.com/gitnamu)    | Backend   |
| Geonyeol Ryu <br /> <img src="https://avatars.githubusercontent.com/u/34560965?v=4" width="100" />                | Chungnam National Univ | Computer Science Engineering   | [Github](https://github.com/rjsduf0503) | Frontend  |
| Migyeong Kim <br /> <img src="https://avatars.githubusercontent.com/u/51354302?v=4" width="100" />                | Jeju National Univ     | Computer Engineering           | [Github](https://github.com/rmfosem613) | IoT       |
| Minsoo Sun <br /> <img src="https://avatars.githubusercontent.com/u/65339890?v=4" width="100" />                  | Jeju National Univ     | Computer Engineering           | [Github](https://github.com/tjsalstn33) | Algorithm |
| Sarah Horning <br /> <img src="https://ca.slack-edge.com/T02SGDF7CJH-U02TKKULPJL-7e3a7bbfb8c3-512" width="100" /> | Purdue Unive           | CNIT                           | [Github](https://github.com/tjsalstn33) | Paper     |

<br>
<br>

# LICENSE

    Copyright © (Mac-nae-on-top)

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
