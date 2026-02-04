---
title: "First Contact: The PLC Communicates with the Digital Twin"
description: "TIA Portal V19 is now connected to the Siemens NX digital twin via PLCSIM Advanced. The first SCL program successfully controls both engines and reads live sensor data."
date: 2026-02-04
categories: [Development]
tags: [tia-portal, plcsim-advanced, scl, digital-twin, integration]
pin: true
image:
  path: assets/img/Dual Engine Test Run.png
  alt: Dual Trent 900 engines test run in Siemens NX with TIA Portal integration 
---

## Signal Adapter Bug Fixes

The Signal Adapter needed some debugging before it would run properly. The original formulas attempted to combine sensor values using the "&" operator, which performs bitwise AND operations and is incompatible with decimal values. Additionally, velocity sensor signals were incorrectly set to "Length/mm" dimension instead of "Velocity/mm/s", causing unit mismatch errors.

All 8 sensor signals now have correct data types (double) and appropriate units. The Signal Adapter formulas are simply pass-through mappings that assign each parameter directly to its signal without any calculations.

---

## Engine Core Speed Controls

Two speed control parameters were added to the Signal Adapter for engine core rotation (Engine_One and Engine_Two). These allow the PLC to start and stop the engine blade rotation at 7,200°/s, completing the command interface for the digital twin. The total signal count is now 14: 6 commands going to NX and 8 sensor values coming back.

---

## TIA Portal V19 Integration

A new TIA Portal project was created with an S7-1500 PLC. 14 tags were configured to match the NX Signal Adapter signals:

- **Command tags (Bool)** using Q addresses for PLC outputs to NX
- **Sensor tags (Real)** using I addresses for NX inputs to PLC

All 14 signals were successfully mapped between NX MCD and PLCSIM Advanced. The addressing is important: Q addresses are for commands going out to NX, I addresses are for sensor data coming in from NX. Internal M addresses do not automatically exchange with PLCSIM Advanced.

---

## First SCL Test Program

A state machine was written in SCL to sequence the deployment process:

- **State 0:** Start engines, set transcowls to retracted position
- **State 5:** Start 30-second timer
- **State 10:** Wait for timer completion
- **State 20:** Stop engines, deploy transcowls

The test confirmed bidirectional communication. PLC commands successfully controlled the NX physics and sensor data flowed back to the PLC in real time. This is the core integration that the entire project depends on.

---

## Realistic Engine Deceleration

Initially it looked like the engine core control was not working because the blades continued spinning after setting the speed control to FALSE. It turned out this is actually correct behaviour. The simulation realistically models engine deceleration rather than instant stopping, just like a real aircraft engine spooling down after the throttle is cut.

The physics engine handles momentum and gradual slowdown automatically. This is a good sign that the digital twin produces realistic behaviour, which strengthens the validity of the fault detection data.

---

## What Went Wrong

**Signal Adapter formula errors:** The "&" operator caused errors because it performs bitwise AND, not grouping. Fixed by setting correct dimensions and units for each signal type.

**TIA Portal F-CPU password issue:** Selecting a fail-safe CPU (F-CPU) added password-protected safety blocks. Resolved by removing the F-runtime group.

**Tag configuration mismatches:** Initial tags used wrong data types (DInt instead of Real) and wrong address areas (M instead of I/Q). Data types must match across the pipeline: NX outputs double precision values so TIA Portal tags need Real data types.

---

## What's Next

- **Implement fault scenarios in SCL** covering asymmetric deployment, valve delay and incomplete deployment
- **Add data logging** to capture sensor values during fault runs
- **Generate 200+ labelled scenarios** for Random Forest training
- **Develop HMI dashboard** for real-time monitoring
