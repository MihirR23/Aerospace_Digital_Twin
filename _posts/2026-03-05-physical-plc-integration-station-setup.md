---
title: "Physical PLC Integration: Station Setup and Pneumatic Plumbing Plan"
date: 2026-03-05
categories: [Development, Project]
tags: [plc, fluidsim, pneumatics, tia-portal, festo, s7-1200]
---

With the FluidSim circuit verified in simulation last week, this session marked the transition from virtual to physical — setting up the Festo EduTrainer station, completing the PLC tag table in TIA Portal and laying out the full pneumatic plumbing plan ready for connection next week.

![Setting Up Pneumatic Station](/assets/img/Setting Up Pneumatic Station.jpeg)

## PLC Tag Table — Complete

The first task was entering the full tag table into the TIA Portal project `Thrust_Reverser_Pneumatic_Control`. All 12 tags are now defined in the default tag table:

| Tag Name | Address | Data Type |
|---|---|---|
| E1_Retracted | %I0.0 | Bool |
| E1_Deployed | %I0.1 | Bool |
| E1_Midstroke | %I0.2 | Bool |
| E2_Retracted | %I0.3 | Bool |
| E2_Deployed | %I0.4 | Bool |
| E2_Midstroke | %I0.5 | Bool |
| E1_Extend_Pressure | %I0.6 | Bool |
| E1_Retract_Pressure | %I0.7 | Bool |
| E2_Extend_Pressure | %I8.0 | Bool |
| E2_Retract_Pressure | %I8.1 | Bool |
| E1_Deploy_Valve | %Q0.0 | Bool |
| E2_Deploy_Valve | %Q0.1 | Bool |

One important station-specific detail: the SM1223 digital I/O module sits in slot 2 of the station's rack, which causes the byte addressing to jump from `%I0.7` directly to `%I8.0`. Attempting to use `%I1.0` would result in the signals not being recognised. This is a hardware characteristic of this particular Festo EduTrainer configuration and required correction during entry.

## Physical Station Assessment

The station was powered on and the available hardware identified:

- 2x double-acting pneumatic cylinders (Engine 1 and Engine 2 transcowls)
- 1x 4-slice solenoid valve manifold — comprising 2x 5/2-way single solenoid spring return and 2x 5/2-way double solenoid spring actuated
- 2x digital pressure sensors (each with three configurable switching outputs: Q1, Q2, Q3)
- Supply pressure: 4 bar

The 5/2 single solenoid spring return slices will be used for this project — one per engine — mapping directly to the FluidSim design. The double solenoid slices will remain unused at this stage.

## Pressure Sensor Configuration

A key discovery this session was that each pressure sensor provides three independent switching outputs (Q1, Q2, Q3), each configurable to a different threshold. This allows a single sensor per engine to cover both extend and retract pressure monitoring:

| Output | Purpose | Threshold |
|---|---|---|
| Q1 | Extend pressure (E1/E2) | 3 bar |
| Q2 | Retract pressure (E1/E2) | 1.5 bar |
| Q3 | Reserved (stall detection if needed) | TBC |

This eliminates the need for additional sensors and keeps the wiring clean.

## Pneumatic Plumbing Plan

The physical tubing connections have been planned and will be executed next session. The sequence is:

1. Main air supply from pressure regulator to port 1 (P) on the manifold
2. Exhaust ports (3 and 5) on each valve slice vented to atmosphere via the shared exhaust block
3. Valve slice 1 port 2 (A) to Engine 1 cylinder extend port; port 4 (B) to Engine 1 retract port
4. Valve slice 2 port 2 (A) to Engine 2 cylinder extend port; port 4 (B) to Engine 2 retract port
5. Pressure sensors tee'd into each engine's lines for extend and retract monitoring

## What is Next

The remaining workstream has several stages to complete before the physical PLC integration is fully operational. In order:

**Next session (physical):**
- Plumb pneumatic tubing as planned above
- Configure pressure sensor thresholds (Q1 = 3 bar, Q2 = 1.5 bar)
- Wire solenoid valve coils to PLC output terminals Q0.0 and Q0.1
- Wire proximity sensors and pressure sensor outputs to PLC input terminals

**Following that (software):**
- Connect TIA Portal to the physical S7-1200 via PROFINET and download the project
- Write SCL code in Main [OB1] for basic deploy and retract control
- Add FluidSIM In/Out modules in FluidSim from the EasyPort/OPC/DDE library
- Configure EzOPC to bridge FluidSim signals to the physical PLC
- End-to-end test: PLC output energises solenoid, cylinder extends, sensors feed back to PLC inputs

**Later (fault scenario SCL logic):**
- Asymmetric deployment (one engine delayed or incomplete)
- Timed deployment sequences
- Pressure fault detection via Q1/Q2 thresholds

Each stage builds on the last and the physical plumbing session next week is the critical path item before any of the software work can be validated on real hardware.
