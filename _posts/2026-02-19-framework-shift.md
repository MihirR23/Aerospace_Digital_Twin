---
title: "Framework Shift: Rebuilding the Interface in PyQt5"
description: "CustomTkinter hit a wall with DPI scaling across multiple displays. The solution was a complete GUI rebuild in PyQt5, culminating in a 2,130-line interface with real-time 2D thrust reverser animation and 99% classification confidence."
date: 2026-02-19
categories: [Development]
tags: [pyqt5, gui-development, digital-twin, fault-detection, 2d-animation, dpi-scaling, customtkinter]
pin: true
image:
  path: assets/img/Engine Schematic.png
  alt: PyQt5 Engine Schematic tab showing real-time 2D thrust reverser cross-section with deployment status panel
---

CustomTkinter V15 was the production GUI: 99% confidence across all seven fault types, 24.7ms average latency, ECAM-style alerts and a sound system that could wake up a flight deck. Everything worked perfectly on the development laptop. Then I plugged in an external monitor and a 4K television and the entire interface fell apart.

## The DPI Scaling Wall

When tested across multiple displays, widgets overlapped, text clipped, and scrolling was unreliable. V16 attempted six different approaches to fix scaling within CustomTkinter: ScrollableFrame wrappers, automatic DPI detection, user-selectable display profiles, dynamic font sizing, forced maximisation and a complete rebuild with font scaling only. None produced a consistent result across all three screens.

The fundamental limitation is that CustomTkinter has no mechanism to scale widget internals (padding, borders, internal text layout) proportionally with display size. Font scaling alone is insufficient because widget containers remain fixed-size. V16 was abandoned after six iterations and V15 remained the production version.

## The PyQt5 Decision

Rather than continuing to patch CustomTkinter, the decision was made to rebuild in PyQt5 (documented in TD-014). PyQt5 offered several advantages for this use case: native DPI awareness through Qt's high-DPI scaling, professional signal/slot architecture for thread-safe PLC communication, QTabWidget with proper geometry management, and matplotlib integration through FigureCanvas. The rebuild was a calculated risk given the project timeline, but six weeks of schedule buffer made it viable.

## Building from Scratch

PyQt5 V1 recreated the core interface: EICAS Display with live sensor gauges and deployment graph, System Overview with fault type reference table and Fault Injection with seven preset buttons and custom parameter controls. The signal/slot architecture replaced tkinter's `root.after()` callbacks with `pyqtSignal` emissions from the monitor thread, eliminating the thread safety issues that had plagued earlier versions.

## The Confidence Comeback

V3 addressed critical issues in the monitor loop that emerged during live testing. Retraction detection was failing because the position threshold check was too aggressive, causing the system to trigger classification before the full deployment-retraction cycle completed. The cycle detection sensor logic was refined, graph rendering was fixed to show clean zero-points between cycles and SCL State 70 timeout was adjusted. After these fixes, all seven fault types returned to 99% average confidence in live testing, matching the CustomTkinter V15 baseline.

## Adding the Engine Schematic

With the core system validated, development moved to a feature that was previously impractical in CustomTkinter: a real-time 2D thrust reverser cross-section animation. The Engine Schematic tab (V7) renders two engine cross-sections using QPainter, with translating cowls that animate from live sensor data. As the PLC drives the digital twin through a deployment cycle, the schematic shows the cowl sliding aft to expose cyan cascade vanes, with colour-coded states (green for stowed, amber for transit, cyan for deployed).

![Engine Schematic](/assets/img/Engine Schematic.png)
_PyQt5 Engine Schematic tab rendering real-time 2D thrust reverser cross-sections driven by live sensor data from the digital twin._

Data readouts display position, velocity and individual left/right sensor values for each engine. A deployment status panel at the bottom shows "ALL SYSTEMS NOMINAL" during idle periods, then switches to display the classified fault type with severity badge and E1/E2 comparison bars when a fault is detected. The schematic only repaints when its tab is visible, preventing unnecessary rendering overhead during PLC communication.

## Layout Iteration

The schematic required several iterations to resolve layout issues. ENGINE labels initially overlapped the nacelle drawings and were moved above each engine. Readout text was clipping off the right edge due to positions being relative to the moving cowl, which was fixed by anchoring readouts at a fixed x-coordinate. A retraction delay was caused by live sensor data overwriting the zeroed positions after classification, solved with a hold flag that suppresses updates until the next cycle begins. The legend was repositioned from the top-right corner to a centred horizontal strip below the title to avoid clashing with the data readouts.

The final PyQt5 V7 totals 2,130 lines across four tabs (EICAS Display, System Overview, Fault Injection, Engine Schematic), with the ThrustReverserSchematic widget alone accounting for approximately 200 lines of QPainter rendering code. Eight live sensor feeds (4 position and 4 velocity) are wired directly to the schematic, all flowing through the same 16 Signal Adapter parameters that link NX MCD to TIA Portal.

## What is Next

The Engine Schematic tab needs minor tweaks to polish the visual layout and will be tested across the laptop, monitor and TV displays to verify the DPI scaling improvements that motivated the PyQt5 rebuild. Further development will explore additional PyQt5 capabilities including potential predictive dashboard features and enhanced data visualisation. The CustomTkinter V15 and PyQt5 V7 will run side by side for a final comparison before the framework decision is formally closed.
