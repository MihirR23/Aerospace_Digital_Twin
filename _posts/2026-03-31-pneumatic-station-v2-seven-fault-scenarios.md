---
title: "Pneumatic Station V2: Seven Fault Scenarios on the Festo EduTrainer"
description: "A complete rebuild of the pneumatic station with rotary actuators, three-position sensing, and piloted check valves, enabling seven physically demonstrable thrust reverser fault scenarios."
date: 2026-03-31
categories: [Development]
tags: [festo, pneumatics, plc, scl, tia-portal, s7-1200, hmi, rotary-actuator, fault-detection]
pin: true
image:
  path: /assets/img/Modifying The Pneumatic Station.jpg
  alt: Festo EduTrainer pneumatic station with rotary actuators during modification
---

The first version of the pneumatic station used double-acting cylinders with two positions: retracted and extended. It worked but the fault scenarios were limited to what could be achieved with a binary actuator. Version 2 replaces the cylinders entirely with rotary actuators, each fitted with three magnetic sensors, giving three discrete stopping positions per engine. This post documents the hardware setup, the valve logic and all seven fault scenarios now running on the station.

## New Hardware

The upgraded station uses equipment loaned by Mehmet Karamanoglu from the WorldSkills inventory. Each engine's thrust reverser is represented by a rotary actuator with three magnetic sensors positioned at the retracted end, the mid-stroke point and the extended end. The mid-stroke sensor is the key addition. It represents incomplete deployment and gives the station a physical analogue for fault classes that previously only existed in the NX MCD digital twin.

Each actuator is controlled by a paired valve arrangement. A 5/2 way valve handles extension and retraction, driven by PLC outputs. A 3/2 way valve is plumbed alongside and controls the air supply. When the 3/2 valve is de-energised, air is cut off. Four Festo HGL piloted check valves then lock the actuator in position, preventing drift or back-driving. Flow restrictors are fitted to reduce stroke speed so the mid-stroke sensor reliably detects the actuator before it overshoots.

## I/O Addressing

All twelve tags sit on the base CPU module with no signal module offset.

**Inputs:**

- Engine 1 Retracted: %I0.0
- Engine 1 Deployed: %I0.1
- Engine 1 Halted: %I0.2
- Engine 2 Retracted: %I0.3
- Engine 2 Deployed: %I0.4
- Engine 2 Halted: %I0.5

**Outputs:**

- Engine 1 Deploy: %Q0.0
- Engine 1 Retract: %Q0.1
- Engine 1 Air Cutoff: %Q0.2
- Engine 2 Deploy: %Q0.3
- Engine 2 Retract: %Q0.4
- Engine 2 Air Cutoff: %Q0.5

The 3/2 valves are normally closed. Energising them opens the air supply. De-energising cuts air and the piloted check valves lock the actuator wherever it is.

## Seven Fault Scenarios

Each scenario runs as a separate SCL function block called from OB1 based on the Scenario_Select variable on the HMI. Every FB follows the same structure: retract both actuators to stowed, wait for the start trigger, execute the deployment sequence, dwell, retract, cycle complete, then reset and loop.

**Normal Deployment** deploys both engines simultaneously at full speed. Both reach full extension and no fault is flagged. This is the baseline.

**Delayed Deployment** deploys Engine 1 to full extension first. Only after Engine 1's deployed sensor triggers does Engine 2 begin deploying. Engine 2 is flagged as delayed because it did not deploy simultaneously with Engine 1.

**Incomplete Deployment** deploys both engines but cuts air when the Halted sensor triggers at mid-stroke. The piloted check valves lock both actuators at the mid-position. Neither engine reaches full extension and both are flagged as faulted.

**Asymmetric Speed** deploys both engines simultaneously but Engine 1 has its flow restrictor adjusted to slow its stroke. Both engines reach full extension but Engine 1 takes measurably longer. The deployment time difference is recorded independently for each engine using a one-shot freeze guard on the timer capture.

**Stall Deployment** deploys both engines simultaneously but cuts Engine 1's air supply after 500ms. The piloted check valves lock Engine 1 wherever it reached in that time, somewhere between the retracted and Halted sensors. Engine 2 continues to full extension normally.

**Oscillating Deployment** deploys both engines but reverses Engine 1 twice during the stroke. Engine 1 extends for 500ms, retracts for 300ms, extends for 500ms, retracts for 300ms, then finally extends to full deployment. Engine 2 deploys straight through. The back-and-forth creates a distinctive oscillating signature.

**Combined Fault** deploys both engines but applies different faults to each. Engine 1 stops at mid-stroke when the Halted sensor triggers. Engine 2 continues past mid-stroke but has its air cut 300ms after the Halted sensor, stopping it between mid-stroke and full extension. Both engines are faulted at different positions.

## Deployment Time Capture

A bug in the initial code caused both engines to record identical deployment times even when one was physically slower. The deployed sensor stays TRUE after triggering, so the time capture was being overwritten every scan cycle. The fix uses the deployment time variable itself as a one-shot guard: the time is only written when the sensor is active AND the stored time equals zero. Since all times reset to zero at the start of each cycle, this ensures each engine's time freezes on the first scan its target sensor triggers.

## Demonstration

{% include embed/youtube.html id='_i9wB09T9JA' title='Pneumatic Station Version 2 Demonstration' %}

## What is Next

With all seven scenarios running reliably on the physical station, the next steps are final presentation preparation and recording the formal demonstration video for submission.
