---
title: "Building the Blueprint: FluidSim Circuit Design"
description: "Designing and simulating a pneumatic thrust reverser deployment circuit in FluidSim with two double-acting cylinders, solenoid valve control, flow regulation, proximity sensors and pressure switches."
date: 2026-03-03
categories: [Development]
tags: [fluidsim, pneumatics, plc, sensors, physical-prototype]
pin: false
image:
  path: assets/img/Transcowls Schematics on Fluidsim.png
  alt: FluidSim pneumatic circuit for dual-engine thrust reverser deployment
---

## Circuit Architecture

The pneumatic circuit represents a dual-engine thrust reverser deployment system. Two double-acting cylinders represent Engine 1 and Engine 2's translating cowl doors. Each cylinder is independently controlled by a 5/2-way single solenoid, spring return valve. When the solenoid is energised, the cylinder extends (deploys). When de-energised, the spring return retracts the cylinder. A shared compressed air supply at 0.6 MPa (6 bar) feeds both valves via a T-junction.

## Speed Regulation

Four throttle check valves provide independent speed control for each cylinder's extend and retract movements. Each engine has a dedicated extend speed valve and retract speed valve. These are critical for recreating fault scenarios: restricting flow on one engine while the other runs freely demonstrates Asymmetric Speed and partially restricting both produces Delayed Deployment. The one-way design allows free flow in one direction while throttling the other, giving precise control over deployment and retraction speeds independently.

## Position Sensing

Six proximity sensors were added directly to the cylinders via the Actuating Labels configuration, three per engine. Sensor_1 and Sensor_4 detect the retracted position (0 to 5mm), Sensor_2 and Sensor_5 detect the fully deployed position (95 to 100mm) and Sensor_3 and Sensor_6 detect mid-stroke (45 to 55mm). The retracted and deployed sensors act as limit switches confirming end positions, while the mid-stroke sensors detect incomplete deployment, where the cylinder reaches the middle of its travel but never triggers the fully deployed sensor.

## Pressure Monitoring

Four pressure switches were tapped into the pneumatic lines between the throttle check valves and the cylinder ports, one on each extend and retract line per engine. These provide digital signals to the PLC when pressure exceeds the switching threshold (0.3 MPa). During a stall condition, pressure builds on the extend side without corresponding movement, causing the pressure switch to trigger while the deployed proximity sensor remains inactive. This pressure-without-movement signature is exactly how a real system would detect a stalled actuator.

## Simulation Testing

The circuit was simulated in FluidSim to verify correct operation. Energising the Engine 1 Deploy solenoid extended Cylinder 1A while Engine 2 remained retracted, confirming independent control. Both cylinders retracted cleanly when the solenoids were de-energised, with the spring return restoring the valves to their default position.

{% include embed/video.html src='assets/video/Thrust Reverser Pneumatic Circuit Demo.mp4' title='FluidSim Pneumatic Circuit Simulation' %}

## Component Summary

| Component | Quantity | Purpose |
|-----------|----------|---------|
| Compressed Air Supply (0.6 MPa) | 1 | Shared supply for both engines |
| 5/2-Way Solenoid Valve | 2 | Deploy/retract control per engine |
| Throttle Check Valve | 4 | Extend/retract speed regulation |
| Double-Acting Cylinder | 2 | Represent Engine 1 and 2 transcowls |
| Proximity Sensor | 6 | Retracted, mid-stroke, deployed detection |
| Pressure Switch | 4 | Extend/retract pressure monitoring |

## What is Next

The next step is building the electrical control circuit, wiring the solenoid coils and sensor outputs to prepare for PLC I/O mapping in TIA Portal V19. Once the electrical side is complete, the circuit can be translated to the physical pneumatic station in the mechatronics lab using the real PLC hardware.
