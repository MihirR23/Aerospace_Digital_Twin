---
title: "Schematic Refresh: FluidSim Circuit Updated for V2"
description: "The FluidSim pneumatic schematic has been redrawn to match the physical V2 station, replacing cylinders with semi-rotary actuators and adding piloted check valves for position locking."
date: 2026-04-05
categories: [Development]
tags: [fluidsim, pneumatics, festo, schematic, rotary-actuator, documentation]
pin: true
image:
  path: /assets/img/Modified FluidSim Schematic with Rotary Actuators.png
  alt: Updated FluidSim schematic showing V2 pneumatic circuit with semi-rotary actuators and piloted check valves
---

The original FluidSim schematic, created when the physical station used double-acting cylinders and a 4-slice solenoid manifold, no longer reflected what the station actually looked like. With the V2 rebuild complete and all seven fault scenarios running on rotary actuators with piloted check valves, the schematic needed to be updated to serve as an accurate blueprint of the physical build.

## What Changed

The V1 schematic had cylinders with two endpoint sensors and a shared manifold. The V2 schematic has:

**Semi-rotary actuators** replace the double-acting cylinders, with three actuating label positions defined: A-, A± and A+ for Engine 1 and B-, B± and B+ for Engine 2. These correspond to the three physical sensor positions on the rotary actuators: retracted, halted (mid-stroke), and deployed.

**Piloted check valves with pilot control** have been added, two per actuator, between the throttle check valves and the actuator ports. These represent the Festo HGL valves on the physical station and provide the position locking behaviour when air is cut. Port 2 connects to the actuator, port 1 to the throttle check valve and port 21 (pilot) to the air line between the 3/2 valve and the 5/2 valve.

**3/2 way single solenoid valves** (normally closed) have been added per engine, upstream of the 5/2 valves. These represent the air cutoff valves on the physical station. When energised, they open the air supply to both the 5/2 valve and the pilot ports on the check valves. When de-energised, the air cuts and the check valves lock the actuator.

**5/2 double solenoid valves** remain per engine for direction control, matching the physical 5/2 valves with separate deploy and retract solenoid outputs.

**Throttle check valves** (formerly flow restrictors) stay in place between the 5/2 valves and the piloted check valves to control stroke speed so the mid-stroke sensor has time to trigger before the actuator overshoots.

## What This Gives Me

The updated schematic serves three purposes going forward:

First, it provides a clean reference drawing for the technical report, showing the pneumatic architecture without the clutter of a photograph.

Second, it documents the pivot from V1 to V2 alongside TD-019, giving anyone reading the report a clear before-and-after comparison of how the station evolved.

Third, it serves as a teaching aid for the final presentation, making it easier to explain the role of each component (particularly the piloted check valves, which are the key enabler for the incomplete deployment and stall scenarios) without relying on the physical hardware being in the room.
