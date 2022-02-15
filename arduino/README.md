> #### 1. Beacon

<p align="center"><img src="../Image/ibeacon.jpg" style="width:700px"></p>

We made iBeacon using BLE module hm-10 and Arduino Uno board. &nbsp;&nbsp; [Link to code](https://github.com/Mak-nae-on-Top/Mak-nae-on-Top/blob/main/arduino/hm-10/hm-10.ino)

[The characteristics of Beacon]

- long transmission and reception range
- low power consumption
- accurate indoor location
- small size, and convenience

> #### 2. Fire detector

<p align="center"><img src="./Image/FireDetector.jpg" style="width:700px"></p>

When the flame sensor detects a fire, it sends a message to the server through http communication. At this time, the buzzer sensor notifies the danger by sound.

[Link to code](https://github.com/Mak-nae-on-Top/Mak-nae-on-Top/blob/main/arduino/fireDetector/fireDetector.ino)

1. **Composition**

   - Nodemcu esp8266 development board
   - Flame sensor
   - Buzzer sensor
   - 5-pin cable

<br>

2. **Update Firmware**

   To use AT command, need to update the firmware to the latest version. Update is performed using ESP8266 Flasher without additional installation.
