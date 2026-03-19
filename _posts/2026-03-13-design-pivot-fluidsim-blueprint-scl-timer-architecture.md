---
title: "Design Pivot: FluidSim as Blueprint and the SCL Timer Architecture"
date: 2026-03-13
categories: [Development]
tags: [fluidsim, scl, tia-portal, technical-decision, plc, iec-timer]
pin: false
image:
  path: /assets/img/Updated FluidSim Schematic.png
  alt: FluidSim pneumatic circuit diagram for the dual-engine thrust reverser deployment system
---

Two decisions made this week shaped the remainder of the physical station workstream. The first was the decision to abandon the live FluidSim-to-PLC connection and retain the FluidSim circuit as a design blueprint only, documented in TD-017. The second was establishing the SCL coding architecture that would be used consistently across all fault scenario function blocks.

## TD-017 — FluidSim Retained as Design Blueprint

The original plan specified a live connection between the FluidSim simulation and the physical S7-1200 via EzOPC and the EasyPort module on the Festo EduTrainer station. This would have allowed FluidSim to run in parallel with the physical hardware, with PLC outputs driving both the virtual and physical components simultaneously.

Following the physical station assessment, this plan was abandoned. The manifold on the station uses double solenoid valves, whereas the FluidSim circuit was designed around single solenoid spring return valves. The two architectures are fundamentally different, the FluidSim circuit does not accurately reflect the physical hardware and would require a complete redesign to do so.

More importantly, the physical PLC connected directly to TIA Portal via PROFINET without requiring FluidSim as an intermediary. The SCL state machine FBs control the physical solenoids directly and receive sensor feedback from the physical proximity sensors, achieving the intended result without the added complexity of the EzOPC bridge.

The FluidSim circuit is retained in the project documentation as a pneumatic design blueprint. It demonstrates the circuit design process, provides a reference schematic for the physical tubing connections and serves as evidence of systematic design methodology in the technical report.

## Establishing the SCL Timer Architecture

Before writing any fault scenario function blocks, a consistent SCL coding pattern was agreed to ensure all blocks follow the same structure. This was necessary because an earlier approach, declaring timers as static variables inside the FB interface, caused issues where timer state was difficult to monitor and reset cleanly between scenarios.

The agreed pattern uses global IEC timer instance DBs, created as data blocks of type IEC_TIMER in the project. These are called unconditionally outside the CASE structure on every scan cycle:

```scl
"IEC_Timer_0_DB".TON(IN := "Timer_1_Start",
                     PT := t#5s,
                     Q  => "Timer_1_Finished");
```

The timer's IN input is driven by a global Bool tag in the PLC tag table, and the Q output is written directly to another global Bool tag. Inside the CASE structure, the SCL only sets these Bool tags to TRUE or FALSE, the timer call itself never appears inside a CASE branch. This gives three practical benefits:

- All timer state is visible in the watch table without needing to open an FB instance DB
- The elapsed time value (`ET`) updates every scan, giving accurate deployment time measurements
- The pattern is identical across all FBs, making the code consistent and straightforward to debug

A dedicated master timer (`IEC_Timer_0_DB_3`) was introduced specifically for deployment time tracking. This timer starts at the first deploy step and continues running across all subsequent states without being reset, so the total elapsed time from trigger is always accurately captured for both engines regardless of state transitions.

## What is Next

With the design decision documented and the coding architecture established, the next session writes the Idle function block and the first basic test to verify the physical hardware end-to-end before the fault scenario FBs are built.
