---
title: "A Change of Plan: Pivoting My CAD Approach"
description: "How failed attempts at modelling a jet engine from scratch led me to discover professional CAD resources that accelerated my project timeline."
date: 2026-01-27
categories: [Development]
tags: [siemens-nx, cad, solidworks, decision-making]
pin: true
image:
  path: assets/img/Cults3D Trent 900 Engine.png
  alt: Functional Thrust Reverser Trent 900 model from Cults3D
---

## The Original Plan

When I first scoped this project, my plan was ambitious: build a complete jet engine with thrust reverser deployment from scratch in Siemens NX. I wanted full control over every component, every dimension, every mechanism.

During the Christmas holidays, I set to work. I followed a [YouTube tutorial](https://www.youtube.com/watch?v=6TIex4nyz7c) that walked through creating a jet engine and attempted to adapt it for my purposes.

---

## What Went Wrong

The execution didn't match the vision. Several problems emerged:

The complexity of jet engine geometry proved far more demanding than anticipated. Each component required precise dimensions and tolerances that weren't readily available from public sources. The tutorial I followed was designed for visual representation, not engineering simulation with functional thrust reversers.

More critically, I was spending weeks on CAD modelling when my project's core contribution is the AI fault detection system, not the engine geometry itself. The time investment wasn't aligning with my project objectives.

After multiple failed attempts and unsatisfactory results, I made the decision to pivot.

---

## The Search for Existing Models

I began searching for professionally-made CAD models that could serve as the foundation for my digital twin. The requirements were specific:

- Must include thrust reverser mechanism with blocker doors
- Must be available in STEP format for Siemens NX compatibility
- Must have sufficient detail for physics simulation

I evaluated several platforms including GrabCAD, TurboSquid and Cults3D. Many models were either too expensive, only available in mesh formats (STL) or lacked the thrust reverser components I needed.

---

## Finding the Right Model

After careful inspection, I found exactly what I needed on Cults3D, created by **RTWILEYRC**. The [Functional Thrust Reverser - Trent 900](https://cults3d.com/en/3d-model/gadget/functional-thrust-reverser-trent-900) model included:

- Complete nacelle structure
- Functional blocker doors (the panels that redirect airflow)
- Cascade vanes (the louvered grills that guide reversed thrust)
- Translating cowl mechanism
- Detailed assembly documentation

The model cost £9.17, a worthwhile investment that saved weeks of modelling time.

I also discovered that RTWILEYRC had created a compatible [jet engine core](https://cults3d.com/en/3d-model/various/3d-printable-jet-engine-minimal-printing-supports) that is housed within the nacelle, which I downloaded separately.

---

## Technical Work: STL to STEP Conversion

The purchased files were in STL format, which is mesh-based and not ideal for engineering simulation. I needed STEP files for proper solid body manipulation in Siemens NX.

Using SolidWorks, I manually converted each STL file to STEP format one by one. This process preserved the geometry while giving me the parametric solid bodies needed for:

- Defining rigid bodies for physics simulation
- Setting up collision detection between components
- Creating joints for the blocker door deployment mechanism

---

## Next Steps

Tomorrow's focus is assembly and physics setup in Siemens NX:

- Import all STEP files into an assembly
- Define rigid body properties for each component
- Set up collision bodies for interaction detection
- Create joints to simulate blocker door deployment
- Begin testing the deployment kinematics

This pivot from building from scratch to leveraging existing professional models means I can now focus my energy where it matters most: the PLC control logic, OPC UA integration and Random Forest fault detection that form the core contribution of this project.

---

## Update: Conversion Complications

When opening the converted STEP files in Siemens NX, several failed to load correctly. The manual STL to STEP conversion process proved unreliable for complex geometry.

I purchased an additional model from RTWILEYRC, the [High Bypass Engine Nacelle](https://cults3d.com/en/3d-model/gadget/high-bypass-engine-nacelle) (£9.05), which includes the jet engine within the assembly. However, this model contains 87 STL files requiring conversion.

With a recommendation from Jason Scott, I attempted to use Autodesk Fusion360 for batch conversion. I explored Fusion 360 but it required a paid licence.

Rather than manually converting 87 files with uncertain results, I've contacted RTWILEYRC directly to enquire about obtaining STEP files and potentially a pre-assembled model (the DWG files suggest an assembly may exist). Awaiting their response.

---

## Acknowledgements

Credit to **RTWILEYRC** on Cults3D for creating the high-quality thrust reverser and engine models that made this pivot possible.
