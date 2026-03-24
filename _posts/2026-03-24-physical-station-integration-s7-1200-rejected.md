---
title: "Physical Station Integration: Why the S7-1200 Rejected Everything We Threw at It"
date: 2026-03-24
categories: [Development]
tags: [snap7, plc, s7-1200, python, physical-station, debugging, tia-portal]
pin: true
image:
  path: /assets/img/Linking Physical Station to ML Pipeline.png
  alt: Physical Station tab connected to the S7-1200 with the ML classification pipeline ready
---

Version 10 of the operator interface set out to do something the virtual pipeline could not: read live data from the physical Festo EduTrainer station and run it through the XGBoost classifier in real time. What followed uncovered a fundamental constraint of the S7-1200 communication stack, two separate snap7 API incompatibilities and ultimately a decision to remove the feature entirely. This post documents what went wrong, why, and what any future attempt would need to do differently.

## What Was Attempted

The proposed Physical Station tab would connect directly to the S7-1200 at 192.168.2.17 using snap7, poll PLC tags every 100ms via a main-thread QTimer and trigger AI classification automatically after each deployment cycle completed. Rather than streaming continuous sensor data as the virtual pipeline does, the physical mode would read the deployment time values recorded by the PLC state machine, synthesise a position and velocity time series from those values and pass that series through the full 65-feature extraction pipeline. The trigger logic used two redundancy paths: a primary trigger on the rising edge of `Cycle_Complete` (M1.2) and a fallback on `Current_State` returning to zero with non-zero deployment times already set.

## Problem 1: snap7 v2.x Dropped Integer Area Constants

The first error appeared immediately on connecting. Every poll cycle returned `'int' object has no attribute 'name'`. The original code used `read_area()` with raw hexadecimal constants: `0x81` for Process Inputs and `0x83` for Markers. In snap7 v2.0.2, `read_area()` was updated to require `Areas` enum objects rather than integers. The natural fix would have been to import `snap7.types.Areas`, however that module does not exist in v2.0.2 at all. The correct approach is to use the dedicated area methods instead: `eb_read()` for Process Inputs and `mb_read()` for Markers. Both accept plain integer byte offsets with no enum dependency and are the recommended pattern for all snap7 v2.x integrations.

## Problem 2: The S7-1200 Refused Everything

With the API fixed, all three read calls returned a new error:

![Terminal output showing CLI: function refused by CPU repeating across every poll cycle](/assets/img/CPU Errors.png)

This persisted across every method tried, including `db_read()` against an existing Data Block. The snap7 client connected successfully and reported `get_connected()` as True, but the CPU rejected every data request at the hardware level.

After enabling PUT/GET communication, setting the protection level to Full Access, and downloading both changes to the device, the error remained unchanged. The reason is that the S7-1200 does not support direct external access to I-area or M-area memory via the S7 protocol that snap7 uses. This is an architectural constraint of the CPU, not a configuration issue. PUT/GET on the S7-1200 is restricted to Data Blocks only. Reading process image inputs or marker memory from an external client requires those values to be explicitly copied into a Data Block within the PLC program, after which `db_read()` will work correctly.

## The Decision

Implementing a mirroring Data Block in TIA Portal, re-testing, and integrating DB-based reads into the Physical Station tab would have required significant additional development time. The virtual pipeline via PLCSim Advanced already provides a complete, validated, end-to-end demonstration of the AI classification system with full tag access and no hardware-level restrictions. The Physical Station tab was removed and the system continues to operate as specified using the .NET API.

## What a Future Attempt Should Do

Any future physical PLC integration should begin with a dedicated `PhysicalData` DB in TIA Portal, with optimised block access disabled. The PLC program copies all required tags into that DB on every scan cycle. Python then reads exclusively from that DB via `db_read()`. Direct I-area or M-area reads will not succeed on the S7-1200 family regardless of any settings, so the DB mirroring layer is not optional. It is the required architecture for this hardware.

## What is Next

- Record the final system demonstration video
- Draft Chapter 5 (Results and Discussion) of the technical report
- Draft Chapter 6 (Conclusions and Future Works)
- Finalise presentation preparation
