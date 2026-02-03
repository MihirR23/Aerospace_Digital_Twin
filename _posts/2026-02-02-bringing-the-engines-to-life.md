---
title: "Bringing the Engines to Life: Digital Twin Physics Setup"
description: "Both Trent 900 engines are now fully configured in Siemens NX with rigid bodies, joints and motion controls. The digital twin moves."
date: 2026-02-02
categories: [Development]
tags: [siemens-nx, digital-twin, simulation, physics]
pin: true
image:
  path: assets/img/Engines with Physics.png
  alt: Trent 900 digital twin physics in Siemens NX
---

## The STEP Files Made All the Difference

In the [previous post](/Aerospace_Digital_Twin/posts/research-done-build-begins/), I mentioned that Bob Wiley ([RTWILEYRC](https://cults3d.com/en/users/RTWILEYRC/3d-models) on Cults3D) had sent over the full Trent 900 STEP assembly. Today was the day those files were put to work.

The reason STEP files matter so much is that they contain proper solid body geometry, which means Siemens NX can recognise individual parts, faces and edges. This is essential for defining joints and running motion simulations. The STL files from the original purchase were mesh-based and designed for 3D printing, so NX could not work with them in the same way. Without the STEP files, the digital twin would not have been possible.

---

## Engine One: Physics Setup

The first engine was configured with the following physics:

**Rigid Bodies** were created for the engine blades, left transcowl and right transcowl. This tells NX to treat these components as physical objects that can move and interact.

**Cylindrical Joint** was defined on the engine blades with a speed control set to 7,200 degrees per second, replicating approximately 1,200 RPM during reverse thrust.

**Sliding Joints** were defined on both transcowls with upper and lower limits representing the 350mm deployment stroke. This is the distance the transcowl slides back to expose the cascade vanes and blocker doors during thrust reverser deployment.

**Position Controls** were created for both transcowls to switch between deployed and retracted states.

---

## Engine Two: Clone and Configuration

Rather than setting everything up again from scratch, the entire engine assembly was cloned to create a second independent engine. All physics objects and file names were renamed so that modifying one engine does not affect the other. Both engines are now fully functional with matching physics setups.

This is important because the whole point of the project is to detect asymmetric deployment between two engines. Having two independently controllable engines means fault scenarios can be applied to one engine while the other operates normally.

---

## Simulation Test

A simulation was run with both engines operating simultaneously. Smooth operation confirmed across all joints and controls.

<video width="100%" controls>
  <source src="/Aerospace_Digital_Twin/assets/video/Thrust Reverser Test .mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
*Test run showing both engines deploying thrust reversers simultaneously.*

---

## What's Next

- **Set the simulation step size to 0.01 seconds (10ms)** to match the 100Hz sampling rate specification defined in the project objectives
- **Configure fault scenarios** across the five categories: normal deployment, reduced hydraulic pressure, valve delay (200-500ms), incomplete deployment and gradual degradation
- **Export position and velocity data** from the four sliding joints (eight data channels total across both engines) as CSV files for the Python Random Forest machine learning pipeline. The sliding joints themselves capture all necessary sensor data without requiring separate sensor objects in NX
- **Note for the report:** Real Trent 900 systems use dual Linear Variable Differential Transformer (LVDT) sensors per transcowl (upper and lower actuator) for redundancy, while the simulation simplifies to a single actuation point per side
