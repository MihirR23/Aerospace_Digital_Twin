---
title: "Advisor Meeting: Rethinking the Control Architecture"
description: "A meeting with submission advisor Mehnaz Hamilton revealed a fundamental limitation in the current setup. Boolean control is out, analog control is in."
date: 2026-02-05
categories: [Project]
tags: [meeting, control-systems, architecture, fault-injection]
pin: true
image:
  path: assets/img/Meeting Notes - 1.jpg
  alt: Meeting notes from submission advisor meeting with Mehnaz Hamilton
---

## The Problem with Boolean Control

The current setup uses boolean (on/off) control for position controls and speed controls, with speeds pre-configured in NX. This works for basic operation, but it severely limits fault injection capabilities. The PLC can only start or stop movement. It cannot vary the speed or position targets dynamically.

For generating diverse fault scenarios, this is a problem. The Random Forest classifier needs training data that covers a range of fault conditions, not just "working" and "not working".

---

## The Revised Approach

The solution discussed with Mehnaz Hamilton involves restructuring how NX and TIA Portal communicate:

1. Set all speeds in NX to 0 as the default
2. Change Signal Adapter parameters from active (boolean) to speed and position (analog/Real values)
3. TIA Portal sends actual values that overwrite the NX defaults
4. The PLC gains full authority over deployment behaviour

This shifts the control logic entirely to the PLC, which is where it belongs for a proper control systems demonstration.

---

## Fault Scenario Control

With analog control, the PLC can inject faults by manipulating the values it sends to NX:

**Asymmetric deployment:** Send different speeds to each engine. One deploys at 20.8 mm/s, the other at 15 mm/s.

**Reduced hydraulic pressure:** Send lower speed values across the board, simulating a system struggling to achieve normal deployment rates.

**Incomplete deployment:** Send reduced position targets. Instead of 52mm full stroke, send 35mm to simulate a transcowl that stops short.

**Gradual degradation:** Progressively reduce speed values over multiple deployment cycles, simulating wear or hydraulic system deterioration.

None of this is possible with boolean on/off control.

---

## Transcowl Control Enhancement

For each transcowl position control, three parameters should be exposed to TIA Portal:

| Parameter | Data Type | Purpose |
|-----------|-----------|---------|
| active | Bool | Activates the control |
| speed | Real | Sets deployment velocity |
| position | Real | Sets target position |

This provides complete control over each transcowl's behaviour directly from the PLC, enabling the diverse fault scenarios needed for Random Forest training data generation.

---

## Action Items

1. Set all position control and speed control speeds to 0 in NX
2. Update Signal Adapter to expose speed and position parameters (not just active)
3. Update TIA Portal tags from Bool to Real where applicable
4. Remap signals between NX and PLCSIM Advanced
5. Rewrite SCL code to send analog values instead of boolean on/off commands

This is a significant rework but it is necessary for the fault injection capabilities the project requires.
