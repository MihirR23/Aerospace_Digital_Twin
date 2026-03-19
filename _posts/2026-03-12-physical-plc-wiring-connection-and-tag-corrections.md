---
title: "Physical Station: Wiring, PLC Connection and Tag Corrections"
date: 2026-03-12
categories: [Development]
tags: [plc, tia-portal, festo, s7-1200, pneumatics, scl]
pin: false
image:
  path: /assets/img/PLC Tags Corrected.png
  alt: Corrected PLC tag table in TIA Portal showing four output tags for double solenoid valves
---

With the pneumatic plumbing plan established the previous week, this session focused on completing the physical wiring of the Festo EduTrainer station, connecting TIA Portal V19 to the physical S7-1200 and resolving a critical error in the PLC tag table that was identified with the assistance of Mehnaz and Oluwatunmise.

## Tag Table Error — Double Solenoid Valves

The original tag table was designed around the assumption that the two active valve slices were 5/2-way single solenoid spring return valves, requiring only one output per engine. However, when the station was powered up and tested, neither cylinder responded correctly. Mehnaz and Oluwatunmise helped trace the wiring and confirmed that the manifold on this particular station uses 5/2-way double solenoid valves for both engines.

A double solenoid valve has no spring return: both the deploy and retract strokes require an explicit electrical signal from the PLC. The original tag table with only two output tags (`E1_Deploy_Valve` and `E2_Deploy_Valve`) was therefore incorrect. Four output tags are needed, one deploy and one retract per engine.

The tag table was corrected accordingly:

| Tag Name | Address | Data Type |
|---|---|---|
| Engine_One_Retract | %Q0.0 | Bool |
| Engine_One_Deploy | %Q0.1 | Bool |
| Engine_Two_Retract | %Q0.2 | Bool |
| Engine_Two_Deploy | %Q0.3 | Bool |

## Revised Full Tag Table

Following the valve correction, the full tag table was revised to remove tags that no longer applied to the physical hardware. Midstroke tags were removed as the cylinders only have two magnetic sensors each, one at the retracted end and one at the deployed end. Retract pressure tags were removed as pressure monitoring is only meaningful during deployment. The finalised tag table is:

| Tag Name | Address | Data Type | Purpose |
|---|---|---|---|
| Engine_One_Retract | %Q0.0 | Bool | Engine 1 retract solenoid |
| Engine_One_Deploy | %Q0.1 | Bool | Engine 1 deploy solenoid |
| Engine_Two_Retract | %Q0.2 | Bool | Engine 2 retract solenoid |
| Engine_Two_Deploy | %Q0.3 | Bool | Engine 2 deploy solenoid |
| Engine_One_Deployed | %I0.0 | Bool | Engine 1 deployed position sensor |
| Engine_One_Retracted | %I0.1 | Bool | Engine 1 retracted position sensor |
| Engine_Two_Deployed | %I0.2 | Bool | Engine 2 deployed position sensor |
| Engine_Two_Retracted | %I0.3 | Bool | Engine 2 retracted position sensor |
| Engine_One_Extend_Pressure | %I0.6 | Bool | Engine 1 deployment pressure |
| Engine_Two_Extend_Pressure | %I0.7 | Bool | Engine 2 deployment pressure |
| Deploy_Trigger | %M0.0 | Bool | HMI start/stop |
| System_Active | %M0.1 | Bool | System running indicator |
| Engine_One_Fault | %M0.2 | Bool | Engine 1 fault flag |
| Engine_Two_Fault | %M0.3 | Bool | Engine 2 fault flag |
| Scenario_Select | %MW100 | Int | HMI scenario selector |
| Current_State | %MW104 | Int | Current state machine step |

## TIA Portal to Physical PLC Connection

The S7-1200 was connected to the laptop via PROFINET ethernet. TIA Portal V19 was unable to discover the original PLC unit on the station, so a replacement unit was used. Once connected, the project was compiled and downloaded successfully. The PLC confirmed online with a solid green RUN LED.

## What is Next

With the tag table corrected and the PLC online, the next steps are documenting the FluidSim design decision and establishing the SCL coding pattern for the function blocks.
