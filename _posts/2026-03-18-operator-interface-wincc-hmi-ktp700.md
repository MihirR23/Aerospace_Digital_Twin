---
title: "Operator Interface: Building the WinCC HMI on the KTP700"
date: 2026-03-18
categories: [Development]
tags: [hmi, wincc, tia-portal, ktp700, plc, scl]
pin: false
image:
  path: /assets/img/HMI Main Overview.png
  alt: WinCC Main Overview screen on the KTP700 showing engine status indicators and controls
---

With the physical PLC station verified, this session built the operator interface using Siemens WinCC on the KTP700 Basic panel available in the lab. The KTP700 is a 7-inch 800x480 touchscreen panel that connects directly to the S7-1200 via PROFINET, giving the operator full control over scenario selection, start and stop triggering, and live system monitoring without needing a laptop or TIA Portal watch table.

## HMI Connection

The KTP700 was added to the TIA Portal project as a new HMI device. The PROFINET connection between the panel and the PLC was established in the Devices and Networks view by dragging a connection between the two devices. This automatically makes all PLC tags accessible to the HMI. The project was compiled and downloaded to both the PLC and the HMI panel successfully.

## Main Overview Screen

The Main Overview is the home screen the operator sees at all times. It is divided into four sections across the 800x480 display, using a dark grey background for readability under lab lighting.

**Engine 1 and Engine 2 panels** each contain three circle indicators. Colour animations are configured using range-based appearance settings: grey indicates inactive, green indicates the deployed or retracted sensor is confirmed, and red indicates a fault has been detected. The circles are linked to `Engine_One_Deployed`, `Engine_One_Retracted`, `Engine_One_Fault`, and their Engine 2 equivalents.

**Controls panel** contains four buttons. The START button uses a SetBit event to set `Deploy_Trigger = TRUE`. The STOP button uses ResetBit to clear it. SCENARIOS navigates to the Scenario Select screen and FAULT STATUS was initially planned but removed as the Main Overview already covered all relevant status information.

**Status panel** contains a circle indicator linked to `Cycle_Complete` showing orange during an active cycle and green when the cycle completes. An IO field linked to `Current_State` displays the current step number. The `Cycle_Complete` tag was introduced specifically because the CASE state machine steps through states too quickly for the HMI to display individual step colours reliably — holding `Cycle_Complete = TRUE` for 3 seconds at the end of each cycle gives the panel enough time to display the green completion state clearly.

**Pressure Status panel** contains two IO fields linked to `Engine_One_Extend_Pressure` and `Engine_Two_Extend_Pressure`, displaying 0 or 1 to indicate whether deployment pressure is confirmed on each engine. Deployment time IO fields were also added, linked to `Engine_One_Deployment_Time` and `Engine_Two_Deployment_Time`, displaying the frozen deployment time in milliseconds once each cycle completes.

## Scenario Select Screen

![WinCC Scenario Select screen on the KTP700](/assets/img/HMI Scenario Select.png)

The Scenario Select screen provides five buttons, each using a SetTag event to write a value to `Scenario_Select`:

| Button | Value Written |
|---|---|
| Idle | 0 |
| Normal Deployment | 1 |
| Delayed Deployment | 2 |
| Incomplete Deployment | 3 |
| Asymmetric Speed | 4 |

A Symbolic IO field on the right side of the screen is linked to `Scenario_Select` via a text list named `Scenario_Names`, displaying the scenario name as text rather than a number. This confirms to the operator which scenario is loaded before they navigate back to Main Overview to press START. Navigation buttons at the bottom of the screen link back to Main Overview and forward to the fault status view.

## Additional Tags Added

Several new tags were added to the PLC tag table to support the HMI and the deployment time tracking system:

| Tag Name | Address | Data Type | Purpose |
|---|---|---|---|
| Cycle_Complete | %M1.2 | Bool | Green indicator at end of each cycle |
| Timer_1_Start | %M0.4 | Bool | IEC timer 1 input |
| Timer_1_Finished | %M0.5 | Bool | IEC timer 1 output |
| Timer_2_Start | %M0.6 | Bool | IEC timer 2 input |
| Timer_2_Finished | %M0.7 | Bool | IEC timer 2 output |
| Timer_3_Start | %M1.0 | Bool | IEC timer 3 input |
| Timer_3_Finished | %M1.1 | Bool | IEC timer 3 output |
| Timer_4_Start | %M1.3 | Bool | Master deployment timer input |
| Timer_4_Finished | %M1.4 | Bool | Master deployment timer output |
| Engine_One_Deployment_Time | %MD108 | DInt | Frozen deployment time Engine 1 in ms |
| Engine_Two_Deployment_Time | %MD112 | DInt | Frozen deployment time Engine 2 in ms |
| Engine_One_Deployment_Elapsed_Time | %MD116 | DInt | Live elapsed time Engine 1 in ms |
| Engine_Two_Deployment_Elapsed_Time | %MD120 | DInt | Live elapsed time Engine 2 in ms |

DInt was used for the deployment time tags rather than Int because millisecond values in the delayed deployment scenario can exceed 32,767ms, which is the maximum value for a 16-bit Int.

## What is Next

With the HMI complete and all tags finalised, the next session implements the four fault scenario function blocks in SCL and tests each one on the physical station.
