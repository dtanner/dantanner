---
title: "Cyclometry"
date: "2020-10-26 20:00:00"
categories: [bikes, telemetry]
draft: true
---

- started with my wondering this in a slack convo:
>>> i'd love to see a scientific study that takes different riders with different approaches to cornering, but the big improvement is that you shove gyroscopes and weight sensors on their bikes to see exactly how they're angling and distributing their weight around the corners.  wouldn't that be awesome?  maybe someone's already done that.?

- i don't have an electrical engineering background. i don't know what kinds of sensors are possible, and don't know how i'd solve the problem.
- todo: link to a list of commonly available sensors
- i haven't coded on an arduino before

# initial idea
## things i want to measure
#### steering angle - 
i.e. which direction the front wheel is pointing.
my first idea was to use an analog hall sensor on the top tube, pointing at a magnet on the headset. a change in the analog value output by the sensor correlates with the steering angle.
how do i measure the exact angle and not just a relative value? e.g. maybe mount the sensor and magnet, then manually calibrate/correlate an output value with the measured angle using a protractor? for now don't worry about left/right awareness (we could use two sensors for that).
example code: 
- https://arduinomodules.info/ky-024-linear-magnetic-hall-module/
- https://www.sunfounder.com/learn/Sensor-Kit-v2-0-for-Arduino/lesson-2-analog-hall-sensor-sensor-kit-v2-0-for-arduino.html

first bought a SunFounder digital hall switch (whoops), then bought a SunFounder analog hall switch to attach to the Uno.
This worked well, but is a little bulky in combination with the Uno. I stumbled upon an ESP 32, which is tiny, has a built-in analog hall switch, AND has built-in bluetooth.  I thought this could be a great compact solution, but unfortunately the hall switch on the device is not very accurate or consistent.
(could show pic of idle sensor output)


#### bike angle
how much the bike is leaning going around the corner. my first idea was to use a sensor that measured the distance from the top tube to the ground on each side of the bike. but that seems really problematic given the uneven surface of a trails. my next idea was to use a combination accelerometer/gyrometer. i don't know if this will correctly account for the centripetal force that occurs while cornering.

#### handlebar pressure
how much pressure is the rider putting on the bars?
how calibrate the pressure measurement?

#### pedal pressure
how much weight is the rider putting on the pedals? used in correlation with the handlebar pressure to understand the weight distribution (front/back in concert with the handlebar pressure, and right/left with a sensor on each pedal and handlebar side)
how calibrate the pressure measurement?
https://www.thisisant.com/developer/ant-plus/device-profiles - `Bicycle Power` profile



# problems to solve
- what microcontroller should i use?
    - starting with arduino uno
        - https://www.circuito.io/blog/arduino-uno-pinout/
- how to accurately collect each type of information?
    - what sensor and capturing technique should i use?
    - how do i attach the sensors and microcontrollers?
- how to save the information being collected? wirelessly to a phone? storage card attached to the devices?
- how many devices will i need? e.g. can i use one device to capture multiple things? can i use my phone for stuff like the accelerometer/gyrometer capture? 
- how to combine information being collected by the different devices? e.g. i'll want to be able to create a chart of where the x-axis is time, and the y-axis is the various values collected.
- assuming i can capture all the data on my bike, how to capture the data on other people's bikes and compare the data?
- https://electronics.stackexchange.com/questions/530721/how-should-i-wire-this-sensor-and-board-for-rugged-experimentation

# thoughts along the way
- when building arduino stuff, start with the Arduino IDE. It makes the simple things easy. There are other IDEs out there, but there's some magic the Arduino IDE takes care of for you that's nice to avoid at first.  Eventually you may reachc a point where you miss a good IDE, and at that point I'd suggest switching to CLion or VSCode and the PlatformIO plugin to write code.  The latest CLion install docs are here:  https://docs.platformio.org/en/latest/integration/ide/clion.html#ide-clion

