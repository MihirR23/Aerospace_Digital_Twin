---
title: "Beyond 2D: Building a 3D Engine Viewer"
description: "Building a Three.js 3D engine viewer with particle physics, embedding it in PyQt5 via QWebEngineView and feeding it live PLC sensor data from the digital twin."
date: 2026-02-23
categories: [Development]
tags: [3d-visualisation, three-js, pyqt5, digital-twin, glb, engine-schematic, particles]
pin: false
image:
  path: assets/img/Experimenting with 3D Animation.png
  alt: 3D Trent 900 engine viewer with particle systems showing thrust reverser deployment
---

The V7 GUI includes a 2D Engine Schematic tab built with QPainter that shows a simplified cross-section of both engines with animated transcowl deployment. While functional, it lacks the visual impact needed to demonstrate the digital twin concept convincingly. A 3D visualisation using the actual Trent 900 CAD geometry would bridge the gap between the NX MCD simulation and what the operator sees on screen.

The goal was not to replace the 2D schematic but to build a V8 experimental version alongside it, allowing side-by-side comparison of both approaches before committing to one for the final submission.

## Loading the Trent 900 GLB

The first challenge was getting the purchased Trent 900 CAD model into a web-based 3D viewer. The model was exported from Siemens NX as a GLB file (GL Binary), a compressed format supported by Three.js through its GLTFLoader. Draco compression was used to reduce the file size while preserving the assembly hierarchy and part names.

A custom HTML viewer was built using Three.js r128 with GLB file loading and Draco decompression, an assembly tree display showing all named parts from the NX hierarchy, auto-detection of engine assemblies (Engine_Assembly_1 and Engine_Assembly_2) by traversing the scene graph and node sorting to ensure Engine 1 always maps to index 0 regardless of GLB traversal order.

## Cowl Detection and Direction

Auto-detection searches the part names for keywords like "cowl", "translat" and "sleeve" to identify the translating cowl nodes (TN1-164 and TN1-165 in the Trent 900 assembly). Once cowl parts are tagged, the system identifies fan nodes to determine engine orientation.

The direction detection logic works by computing the fan centroid position along the engine's long axis, then comparing its distance to each end of the engine bounding box. Whichever end the fan is closer to becomes the "front" (intake) and the opposite end becomes the "back" (nozzle/exhaust). This determines the aftSign multiplier that drives all particle flow directions and cowl deployment.

This proved to be one of the most challenging aspects. The initial implementation compared the fan position to the engine centre, which was unreliable because the fan is offset from the geometric centre. Multiple iterations were needed to get the direction detection working correctly, and this remains an area requiring further validation.

## Particle Physics System

Five particle types simulate the airflow through each engine:

**Intake** (pale blue) particles are drawn into the fan from ahead of the engine, moving aft. **Bypass** (light blue) particles represent cold air flowing through the bypass duct, redirected through cascade vanes when the cowl deploys. **Exhaust** (orange-red) particles simulate hot core gas expelled from the nozzle, moving aft. **Redirect** (green) particles show reverse thrust airflow pushed forward through the cascade zone during deployment, serving as the key visual indicator of thrust reversal. **Heat shimmer** (amber) particles create rising thermal distortion behind the nozzle.

Each particle type uses the engine's aftSign to determine its spawn position and movement direction. When deployed, bypass particles check whether they have passed the cascade zone (35% from front) and redirect radially outward and forward instead of continuing aft. The redirect particles (500 per engine, 3x size for visibility) spawn at the cascade zone and move forward, visually demonstrating the reverse thrust effect.

![3D Engine Viewer](/assets/img/Experimenting with 3D Animation.png)
_Three.js 3D engine viewer with particle systems showing the Trent 900 model loaded from NX GLB export._

## PyQt5 V8 Integration

The V8 Python script replaces the V7 2D Engine Schematic tab with a QWebEngineView widget that loads the 3D HTML viewer. The integration uses a JavaScript bridge where the PyQt5 application calls `window.setLiveSensorData(e1pos, e2pos)` via `page().runJavaScript()` to feed live PLC sensor data into the 3D viewer.

QWebEngineView loads the HTML from the same directory as the Python script. Sensor data is snapped to zero below 2mm to prevent jitter from NX sensor settling (approximately 1.75mm). The JavaScript bridge only fires when the Engine Schematic tab is active as a performance optimisation. A graceful fallback displays installation instructions if PyQtWebEngine is not installed. V7 remains untouched as the stable working version.

## Cleanup and Simplification

The original HTML viewer supported multiple loading methods (2x STL, STEP with OpenCASCADE, GLB). Since the project only uses GLB exports from NX, approximately 350 lines of dead code were removed: the STL Loader class and all STL file handling, the STEP/OpenCASCADE loading pipeline and tessellation quality controls, the two-tab loader interface, manual cowl axis direction buttons (replaced by auto-detection) and standalone deployment controls and fault injection buttons (the PyQt5 Fault Injection tab handles this through the PLC).

The deployment control panel was stripped down to just Wireframe and Reset View buttons, since all fault injection is driven by the PyQt5 GUI through PLCSim Advanced, not by the HTML viewer directly.

## Current Status and Known Issues

The 3D viewer loads the GLB model, detects engines and cowl parts, spins the fans and responds to deployment commands via the JavaScript bridge. However, several issues remain unresolved.

The intake airflow and hot core exhaust may still travel in the wrong direction depending on the model orientation. The direction detection logic has been rewritten multiple times but needs validation with the actual model loaded. The V8 viewer has not been tested end-to-end with PLCSim Advanced and TIA Portal running simultaneously. The JavaScript bridge code is in place but the full pipeline (NX simulation to TIA Portal to Python to 3D viewer) needs verification. Running QWebEngineView with Three.js particle systems alongside the Python classifier, matplotlib graphs and PLC communication may also introduce latency that needs profiling.

## What is Next

The immediate priority is fixing particle directions by validating intake and exhaust flow with the actual Trent 900 GLB loaded. Console logs show the direction detection output, which can be used to diagnose any remaining inversions. End-to-end testing will run the full pipeline (NX MCD, TIA Portal, PLCSim Advanced, V8 GUI, 3D viewer) and verify that fault injection from the PyQt5 tab drives the 3D deployment correctly.

The V7 (2D) and V8 (3D) versions will be evaluated side by side for the final submission. If the 3D viewer cannot be made reliable in time, V7 with the proven 2D schematic remains the fallback. A standalone JavaScript prototype could also be explored as a middle ground if the HTML/Python integration proves too fragile.
