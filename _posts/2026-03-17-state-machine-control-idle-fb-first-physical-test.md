---
title: "State Machine Control: The Idle Function Block and First Physical Test"
date: 2026-03-17
categories: [Development]
tags: [scl, tia-portal, plc, state-machine, festo, s7-1200, ladder-logic]
pin: false
image:
  path: /assets/img/Functional Pneumatic Station .jpeg
  alt: Physical Festo EduTrainer pneumatic station fully wired and ready for first test
---

With the tag table corrected, the PLC connected, and the coding architecture established, this session wrote the first SCL function block and verified end-to-end physical hardware functionality for the first time.

## OB1 — Ladder Logic Dispatcher

The main OB1 block uses ladder logic rather than SCL. Each network contains a comparator contact that checks the value of `Scenario_Select` against the scenario number. When the values match, the comparator passes power through the rung and enables the corresponding FB instance DB call. This means only one scenario FB executes per scan cycle — whichever matches the current value of `Scenario_Select`.

Five networks are planned in total, one per scenario:

| Network | Scenario_Select Value | FB Called |
|---|---|---|
| Network 1 | 0 | Idle_DB |
| Network 2 | 1 | Normal_Deployment_DB |
| Network 3 | 2 | Delayed_Deployment_DB |
| Network 4 | 3 | Incomplete_Deployment_DB |
| Network 5 | 4 | Asymmetric_Speed_DB |

## The Idle Function Block

The Idle FB is called whenever `Scenario_Select = 0` and serves as the system reset state.

![Idle FB SCL code in TIA Portal](/assets/img/Idle SCL.png) When the operator returns to Idle from any scenario, the FB actively drives both retract outputs TRUE until the retracted position sensors confirm both cylinders are fully home. Once both `Engine_One_Retracted` and `Engine_Two_Retracted` are TRUE, all outputs are released and every tag is reset, fault flags, deployment times, elapsed times, timer start tags, `Cycle_Complete`, `System_Active` and `Current_State`.

This guarantees a clean system state before any scenario runs, regardless of where in the cycle the previous scenario was when the operator switched away.

```scl
// Actively retract both cylinders
"Engine_One_Deploy"  := FALSE;
"Engine_One_Retract" := TRUE;
"Engine_Two_Deploy"  := FALSE;
"Engine_Two_Retract" := TRUE;

// Once confirmed retracted, release outputs and reset all tags
IF "Engine_One_Retracted" AND "Engine_Two_Retracted" THEN
    "Engine_One_Retract"  := FALSE;
    "Engine_Two_Retract"  := FALSE;
    "System_Active"       := FALSE;
    "Engine_One_Fault"    := FALSE;
    "Engine_Two_Fault"    := FALSE;
    "Cycle_Complete"      := FALSE;
    "Current_State"       := 0;
END_IF;
```

## First Physical Test — Basic Deploy and Retract

A basic continuous deploy and retract test was written in a separate FB to verify the physical hardware before building the fault scenario logic. The test used a simple CASE state machine, state 0 waits for `Deploy_Trigger`, state 10 fires both deploy outputs, state 20 retracts both cylinders and state 30 loops back to state 0.

The initial test appeared non-functional. Both cylinders were stationary despite the PLC outputs showing TRUE in the watch table. The cause was straightforward, the air supply valve on the station had not been opened. Once the air supply was connected and the pressure regulator confirmed at 4 bar, both cylinders responded immediately.

With the air on, the test confirmed end-to-end functionality: deploy outputs fire the solenoids, cylinders extend, retract outputs fire the return solenoids and proximity sensors feed back correctly to the PLC inputs. The watch table showed all tags updating as expected.

## What is Next

With the hardware verified, the next session builds the WinCC HMI interface on the KTP700 panel, which will be used to trigger each scenario and monitor system status during the physical demonstration.
