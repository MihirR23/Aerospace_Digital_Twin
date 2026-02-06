---
title: "When Boolean Fails: Transitioning to Analog-Only Control"
description: "Boolean signals were being ignored by NX. The fix required a complete shift to analog-only control, resulting in a cleaner architecture that actually works."
date: 2026-02-05
categories: [Development]
tags: [tia-portal, siemens-nx, signal-adapter, control-systems, troubleshooting]
pin: false
image:
  path: assets/img/Signal Adapter Newly Updated.png
  alt: Updated Signal Adapter configuration with analog-only control
---

## The Problem

Following the advisor meeting earlier today, work began on investigating why boolean deploy/retract signals were not triggering transcowl movement. The signals were correctly mapped in the Signal Adapter, the formulas were correctly linked and TIA Portal was sending the right values. But the transcowls were not responding.

The issue was traced through the Signal Mapping, Signals, Parameters, and Formulas sections of the Signal Adapter. The Position Control `active` parameters were showing TRUE in the Runtime Inspector despite FALSE values being sent from TIA Portal.

---

## Root Cause

The `active` parameter on NX MCD Position Controls appears to be exposed for monitoring only, not for external control. NX ignores external writes to this parameter.

This caused all Position Controls to activate immediately on simulation start. With both deploy and retract controls activating simultaneously, they conflicted with each other, causing the transcowls to bounce during retraction.

---

## The Solution

The fix required transitioning to an analog-only control architecture:

1. Deleted the Retract Position Controls entirely. A single Position Control per transcowl now handles both directions.
2. Removed all boolean signals, formulas, and TIA Portal tags related to the active parameter.
3. Control is now achieved purely through position values (52mm for deploy, 0mm for retract) and speed values (20.8mm/s).

This aligns with what was discussed in the advisor meeting: the PLC should have full authority over deployment behaviour through analog values, not boolean on/off switches.

---

## Results

The simplified architecture works:

- Deployment to 52mm works
- Retraction to 0mm works without bounce
- Sensor feedback confirmed operational
- Engine core speed control works
- Cleaner, more maintainable signal configuration

---

## What's Next

- Implement fault scenarios (asymmetric deployment, incomplete deployment)
- Develop PLC logic for fault detection
- Begin CSV data export for ML classifier training
