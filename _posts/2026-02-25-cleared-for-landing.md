---
title: "Cleared For Landing: Simulating Real-World Consequences"
description: "A new Landing Simulation tab brings fault consequences to life, showing how thrust reverser failures affect an A380 during landing rollout with real-time physics, yaw dynamics and an imported GLB aircraft model."
date: 2026-02-25
categories: [Development]
tags: [gui, 3d-visualisation, three-js, landing-simulation, pyqt5]
pin: false
image:
  path: assets/img/Landing Simulation Tab.png
  alt: Landing simulation showing A380 aircraft on runway with HUD panels displaying flight data and scenario controls
---

## Why a Landing Simulation?

The 3D Engine Schematic tab (covered in the previous blog post) shows what happens inside the engine during a thrust reverser fault. But it does not answer the question every examiner and pilot would ask: what does this fault actually mean for the aircraft? The Landing Simulation tab was built to answer that question directly. It takes the same fault types the AI classifier detects and shows their real-world consequences during an A380 landing rollout, including runway deviation, yaw dynamics and stopping distance. This transforms the project from pure fault detection into a complete safety story.

## Building the Simulation Physics

The tab implements a simplified but physically grounded model of an A380 decelerating on a runway. Four deployment scenarios are available: Normal, Asymmetric Speed, Stall Engine 1 and Incomplete Engine 2. Each scenario uses different thrust reverser deployment parameters that feed into a physics engine calculating deceleration forces from reverse thrust (up to 130 kN per engine), braking drag (1.5 m/s squared baseline), yaw torque from asymmetric thrust (engine spacing of 20 metres) and yaw inertia. The simulation starts at 72 m/s (140 knots) and runs in real time until the aircraft stops, classifying the outcome as SAFE, CAUTION or DANGER based on maximum yaw angle and lateral deviation.

## The A380 Model Challenge

The initial versions used procedural Three.js geometry built from box and cylinder primitives, which looked unconvincing. The decision was made to import a proper A380 GLB model instead. This introduced several technical challenges.

The model had to be auto-scaled to the correct 73-metre fuselage length. The orientation was wrong on first load since the GLB had its fuselage along the Y-axis (vertical in Three.js) rather than along Z (the runway direction). A two-step orientation algorithm was developed: first identify the shortest axis and rotate it onto Y (height), then ensure the longer horizontal axis aligns with Z (fuselage direction). Even after orientation correction, the aircraft initially faced the camera rather than pointing down the runway, requiring an additional 180-degree local Y rotation. Getting this right took multiple iterations, including fixing an attempt that flipped the aircraft upside down by applying the rotation in world space rather than local space.

![Landing Simulation](/assets/img/Landing Simulation Tab.png)
_The Landing Simulation tab showing an A380 on the runway with full HUD overlay, scenario controls and real-time yaw gauge._

## HUD Design and Layout

The simulation features a full heads-up display with six distinct panels. The left panel shows flight data including groundspeed, distance, deceleration and per-engine deployment percentages. The right panel contains the four scenario buttons, scenario descriptions and outcome results. A top-centre speed readout provides the primary reference, while a bottom-centre yaw gauge with needle indicator shows lateral dynamics in real time. A status bar below the gauge reports the current phase (READY, scenario name, STOPPED with outcome).

A significant technical lesson was learned here: CSS `position: fixed` does not work reliably inside QWebEngineView's embedded HTML. All panels had to be restructured to use `position: absolute` within a wrapper div. This was the root cause of the entire right panel being invisible in early versions.

## Camera and Controls

OrbitControls from Three.js were integrated so users can drag to orbit, scroll to zoom and right-drag to pan around the scene. During active scenarios, a chase camera automatically follows the aircraft from behind, smoothly interpolating position and target. If the user grabs the camera during a scenario, the chase disengages so they can explore freely. After the aircraft stops, the camera remains wherever the user left it, with a hint at the bottom of the screen reminding them of the controls.

{% include embed/video.html src='assets/video/Landing Simulation Demo (Compressed).mp4' title='Landing simulation demonstration showing fault scenarios running in real time with yaw dynamics and runway deviation' %}

## GLB Filtering for Engine Schematic

Adding the A380.glb file to the project directory created an unintended side effect: the Engine Schematic tab's auto-detect logic found the A380 model and loaded an aircraft instead of the Trent 900 engine. A filter was added to skip any GLB file with "a380" in the filename and search for alternative engine models in the directory instead.

## System Overview Improvements

The System Overview tab's Quick Test Guide and Monitored Sensors sections were separated into distinct bordered panels with equal width for clearer visual hierarchy. Previously they shared a single container which made them look like one merged block.

## Reflection and What is Next

The Landing Simulation tab completes the operator interface story. The system now covers the full chain from fault detection (EICAS Display) through fault explanation (Engine Schematic with particle physics) to fault consequence (Landing Simulation with runway dynamics). The five-tab GUI demonstrates all four mechatronics domains: mechanical engineering through the digital twin, electronics via virtual sensors, control systems through PLC integration and software development through the Python AI pipeline and 3D visualisation.

Remaining work includes fixing the blank space issue on the System Overview tab.
