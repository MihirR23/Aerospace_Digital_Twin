---
title: "Fault Scenarios: Four SCL Function Blocks Tested on the Physical Station"
pin: true
date: 2026-03-19
categories: [Development]
tags: [scl, plc, tia-portal, festo, pneumatics, fault-detection, hmi, wincc]
pin: true
image:
  path: /assets/img/Operational Pneumatic Station and HMI.jpeg
  alt: Operational Festo EduTrainer pneumatic station with KTP700 HMI running fault scenario demonstration
---

This session completed the core physical demonstration, implementing four fault scenario function blocks in SCL and testing each one on the Festo EduTrainer station. All four scenarios are working and demonstrate distinct fault classes that map directly to the XGBoost classifier trained on NX MCD digital twin simulation data.

## SCL Function Block Architecture

Each scenario is a separate Function Block with a CASE-based state machine. All FBs follow the same structure:

- IEC timer DBs are called unconditionally outside the CASE structure on every scan, with global Bool tags driving the IN input and capturing the Q output
- A master timer (`IEC_Timer_0_DB_3`) starts at the first deploy step and runs continuously without resetting, capturing total deployment time from trigger for both engines
- `Cycle_Complete` is set TRUE at the penultimate step and held for 3 seconds before the final reset step, allowing the HMI to display the green completion indicator clearly
- Step 0 resets all outputs, fault flags, timer tags, and deployment times before the next cycle begins
- Steps increment in multiples of 10

Deployment time is captured using `TIME_TO_DINT` on the master timer's `ET` output, written to `Engine_One_Deployment_Time` and `Engine_Two_Deployment_Time` as DInt values in milliseconds.

## Scenario 1 — Normal Deployment

Both engines receive the deploy signal simultaneously and extend at full speed. The master timer captures elapsed time every scan. When both deployed sensors trigger, the final deployment time is frozen for each engine. If the sensors do not trigger within 5 seconds, a fault is flagged and the timeout value is recorded.

Both engines deployed and retracted cleanly with similar deployment times, confirming synchronous operation and establishing the baseline for fault comparison.

## Scenario 2 — Delayed Deployment

Engine 1 deploys immediately on trigger. Engine 2 is held back for 5 seconds before its deploy output fires. The master timer runs from trigger throughout, so Engine 2's recorded deployment time includes the full delay period.

Engine 2's fault indicator activates during the delay state, flagging the hold as a fault condition. On the physical station, Engine 1 consistently showed deployment times around 209ms while Engine 2 showed times exceeding 10,000ms — a clear and unambiguous demonstration of the delayed deployment fault.

## Scenario 3 — Incomplete Deployment

Flow restrictors were fitted to both cylinders to slow the stroke rate sufficiently for the 2-second deploy cutoff to catch both cylinders mid-stroke before they reach full extension. The double solenoid valves hold the cylinders in their last position when both solenoid outputs are de-energised, simulating transcowls that have partially deployed and stalled.

Neither deployed sensor triggers. Both engines are flagged as faulty. After a dwell period the system actively retracts both cylinders. This scenario requires the flow restrictorswithout them the cylinders extend too quickly for the timer-based cutoff to intercept the stroke.

## Scenario 4 — Asymmetric Speed

A flow restrictor is fitted to one engine only, leaving the other to deploy at full speed. Both engines receive the deploy signal simultaneously. The system captures each engine's deployment time independently. When both deployed sensors have triggered, the two times are compared and the slower engine is flagged as faulty.

The fault detection logic compares the two frozen deployment times and sets the fault flag for whichever engine took longer, making the scenario work correctly regardless of which cylinder has the restrictor fitted.

## Physical Test Results

| Scenario | Engine 1 Time | Engine 2 Time | Fault Detected |
|---|---|---|---|
| Normal Deployment | ~209ms | ~209ms | None |
| Delayed Deployment | ~209ms | ~10,356ms | Engine 2 |
| Incomplete Deployment | ~2,000ms (cutoff) | ~2,000ms (cutoff) | Both engines |
| Asymmetric Speed | ~209ms | ~3,000ms (restricted) | Slower engine |

## Physical Demonstration

The following video shows all four scenarios running on the physical station with the KTP700 HMI:

<video width="100%" controls>
  <source src="/assets/video/Brief Pneumatic Demonstration (Compressed).mp4" type="video/mp4">
</video>

## Scenario Switching

Switching between scenarios via the HMI was tested for all combinations. Each time the operator returns to Idle, the Idle FB retracts both cylinders, clears all fault flags, resets all deployment times and timer tags and sets `System_Active` and `Cycle_Complete` to FALSE. No carry-over state was observed between scenarios.

## What is Next

- Investigate connecting the physical PLC data feed to the Python ML pipeline
