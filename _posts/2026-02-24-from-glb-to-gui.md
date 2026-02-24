---
title: "From GLB to GUI: Rendering the Trent 900 in Real Time"
date: 2026-02-24
categories: [Development]
tags: [3d-viewer, three-js, webgl, particles, digital-twin, pyqt5, thrust-reverser]
pin: true
image:
  path: assets/img/Thrust Redirection Debugging.png
  alt: Debug wireframe rings visible at cascade vane positions on the 3D thrust reverser model during particle system development
---

## From Flat Drawings to Interactive 3D

The V7 Engine Schematic tab used QPainter to render 2D cross-sections of both engines. It worked, but it could not convey the physical reality of what happens during thrust reverser deployment. The transcowl sliding aft, cascade vanes becoming exposed, bypass air being redirected through the vane array: these are three-dimensional phenomena that a flat cross-section simply cannot communicate. The Trent 900 CAD model was already exported as a GLB file from Siemens NX for the digital twin, so the question became whether it could be rendered live inside the PyQt5 operator interface.

The answer was Three.js running in a QWebEngineView widget. A single self-contained HTML file (approximately 1,500 lines of JavaScript) loads the GLB model via a local HTTP server, auto-detects engine components by their NX part names and builds a complete particle physics simulation for five airflow types. PyQt5 communicates with the viewer through a JavaScript bridge, sending live PLC sensor data to drive per-engine deployment in real time.

## Automatic Part Detection

One of the more satisfying aspects of the implementation is that the viewer requires zero manual configuration. When the GLB file loads, the code traverses the scene graph and identifies components by their NX naming convention. Cowl parts (TN1-164 and TN1-165 suffixed with _1 or _2 for each engine), fan assemblies (TN1-713, TN1-826, TN1-825, TN1-827, TN1-737) and cascade vanes (TN1-159 variants) are all detected automatically. The viewer then computes engine bounding boxes, determines front-to-back orientation by comparing fan centroid positions to engine extents and locates the cascade zone from the average axial position of detected vane meshes.

This means the same HTML file would work with any similarly structured GLB export, without hardcoded positions or manual part tagging.

## Physics-Based Particle Systems

Five particle types simulate the airflow through each engine:

**Intake** particles are drawn toward the fan face from ahead of the engine, simulating air being ingested. **Bypass** particles flow through the annular duct between the core and nacelle. **Core exhaust** particles emerge hot and fast from the rear nozzle. **Heat shimmer** particles rise from the exhaust area with turbulent drift. These four types are always present during engine operation.

The fifth type, **redirected thrust**, only appears when the transcowl deploys. These green particles spawn at the cascade vane axial position, just outside the nacelle surface and expand radially outward while moving forward. This is the visual signature of thrust reversal: air that would normally exit the rear of the engine is instead pushed outward and forward through the exposed cascade vanes.

## Deployment-Responsive Particle Density

The most important visual feature is that particle behaviour changes dramatically based on each engine's deployment fraction. This is not just an aesthetic choice; it reflects the actual physics of thrust reverser operation.

When the transcowl is fully deployed (52mm), 95% of bypass particles are suppressed because in reality, that air is now being redirected through the cascade vanes instead of exiting the rear. Core exhaust reduces by 70% because the blocker doors obstruct the flow path. Meanwhile, redirect particles scale linearly with deployment fraction: a fully deployed engine shows 600 active redirect particles, while a half-deployed engine shows roughly 300.

This creates immediately visible differences between fault scenarios. During an incomplete deployment where Engine 1 reaches full extension but Engine 2 stalls at 35mm, Engine 1 shows minimal rear flow with a strong green cascade glow, while Engine 2 still has visible blue bypass streaming from the back and a weaker redirect pattern. The operator can see at a glance which engine is not deploying correctly, without reading any numbers.

| Scenario | E1 Bypass | E2 Bypass | E1 Redirect | E2 Redirect |
|----------|-----------|-----------|-------------|-------------|
| Normal (52/52mm) | 5% alive | 5% alive | 600 particles | 600 particles |
| Incomplete E2 (52/35mm) | 5% alive | 36% alive | 600 particles | 400 particles |
| Stall E2 at 25mm | 5% alive | 52% alive | 600 particles | 290 particles |
| Stowed (0/0mm) | 100% alive | 100% alive | Hidden | Hidden |

## Debugging the Invisible

Getting redirect particles to actually render proved to be the most time-consuming part of development. The console confirmed that all 500 particles were alive and spawning at the correct coordinates, but nothing appeared on screen. The breakthrough came from adding visible debug elements: magenta wireframe torus rings placed at the computed cascade spawn positions.

![Thrust Redirection Debugging](/assets/img/Thrust Redirection Debugging.png)
_Debug wireframe rings confirming correct cascade vane positioning. The rings appeared exactly where expected, proving the coordinate system was correct and isolating the issue to WebGL rendering._

The rings appeared exactly where expected, which confirmed the coordinate maths was correct and narrowed the problem to WebGL rendering. The root cause turned out to be `depthTest: true` on the particle material. Because redirect particles spawn at the nacelle surface (radius x 1.02), the nacelle mesh depth-clips them away before they can be drawn. Switching to a custom material with `depthTest: false` and `depthWrite: false` resolved the issue immediately. The particles now render through the nacelle geometry, which is physically correct since the air is emerging through the cascade vane openings in the nacelle.

{% include embed/video.html src='assets/video/Engine Schematic with 3D Animation (Compressed).mp4' title='3D Engine Schematic with Real-Time Particle Physics' autoplay=true loop=true muted=true %}
_The V8 3D engine schematic running inside the PyQt5 operator interface. Live PLC sensor data drives per-engine deployment with physics-based particle flow responding to deployment state._

## Integration with PyQt5

The 3D viewer communicates with the PyQt5 application through a single JavaScript function: `window.setLiveSensorData(e1pos, e2pos)`. The monitor thread reads sensor values from the PLC at 100Hz and forwards them to the viewer whenever the Engine Schematic tab is active. A local HTTP server on port 18900 serves both the HTML file and the GLB model, avoiding the cross-origin restrictions that would block file:// protocol loading.

One practical issue was the white flash that appeared when switching to the Engine Schematic tab. The QWebEngineView widget defaults to a white background before the page loads. Setting `page().setBackgroundColor(QColor(6, 6, 8))` to match the Three.js scene colour eliminated the flash entirely.

## What is Next

The 3D viewer is now feature-complete for the project demonstration. Probability calibration for the XGBoost classifier's confidence scores remains the next priority, followed by the technical report and presentation preparation. The formal reasoning behind the 3D approach over the 2D schematic is documented in TD-016.
