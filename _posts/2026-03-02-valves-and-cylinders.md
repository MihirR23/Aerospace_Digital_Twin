---
title: "Valves and Cylinders: Taking Fault Detection Physical"
description: "While awaiting approval for the 3D printed engine prototype, the project expands into pneumatic circuit design using FluidSim and the physical TIA Portal PLC station to demonstrate thrust reverser actuation."
date: 2026-03-02
categories: [Development]
tags: [fluidsim, tia-portal, pneumatics, plc, physical-prototype]
pin: false
image:
  path: assets/img/Festo Pneumatic Lab.jpg
  alt: Festo pneumatic station in the mechatronics lab for physical thrust reverser actuation
---

## Waiting for Approval

The STL files for the Cadly Electric TurboFan model have been submitted to Puja Varsani and Aleksandar Zivanovic for review. The 3D printed prototype would provide the physical half of the digital twin, housing an Arduino Nano with servo actuation and potentiometer feedback to independently validate the AI classifier. While that approval is pending, there is an opportunity to explore another dimension of the project that strengthens the overall system.

## Pneumatic Actuation with FluidSim

Real thrust reversers on aircraft engines are driven by hydraulic actuators. While the project uses digital simulation in NX MCD and AI classification in Python, neither component addresses the physical actuation mechanism that makes thrust reversers move. FluidSim provides a way to demonstrate this understanding.

The plan is to design a pneumatic circuit in FluidSim representing the thrust reverser deployment system for both engines. Two double-acting cylinders represent Engine 1 and Engine 2's translating cowl doors. Each cylinder is controlled by a directional control valve switched by PLC solenoid outputs, giving independent control of each engine's deployment. Flow control valves regulate cylinder speed, allowing physical demonstration of speed-based fault scenarios like Asymmetric Speed and Delayed Deployment by restricting airflow to one cylinder.

Once the circuit is designed and simulated in FluidSim, it will be translated to the physical pneumatic station in the mechatronics lab, controlled by the physical TIA Portal V19 PLC rather than PLCSIM Advanced. This means the project will demonstrate both the simulated PLC environment (PLCSIM Advanced for the digital twin) and the real industrial PLC hardware (for pneumatic control).

## Sensor Integration

The physical station provides access to a range of industrial sensors that map directly to thrust reverser monitoring functions. Limit switches at each end of each cylinder confirm full deployment and full retraction, mirroring the proximity switches used in real aircraft. Pressure sensors on the cylinder lines monitor deployment force, where a stall condition would show pressure building without corresponding movement. Inductive and capacitive sensors at intermediate positions along the cylinder stroke provide position feedback similar to the transcowl position sensors in the NX digital twin. Optical sensors can serve as safety interlocks, confirming the deployment has cleared a certain position. Additional components available at the station will be identified and incorporated as the build progresses.

## Fault Scenario Mapping

The combination of flow control valves and sensors allows physical recreation of the fault scenarios the AI classifier detects in the virtual system. Restricting flow on one cylinder while the other runs freely demonstrates Asymmetric Speed. Setting a limit switch to trigger at a partial position represents Incomplete Deployment. Blocking flow entirely while monitoring pressure rise represents Stall Deployment. These are not simulated faults in software. They are real pneumatic behaviours produced by physical valves and cylinders.

## What is Next

Tomorrow the FluidSim circuit design begins. The circuit will be laid out, simulated, and then built on the physical station in the mechatronics lab. This work runs in parallel with the 3D printing approval process, so no time is lost regardless of the outcome.
