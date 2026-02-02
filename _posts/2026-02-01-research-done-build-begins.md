---
title: "Literature Review Complete & CAD Model Received"
description: "The literature review is finished, covering five key research areas that underpin the project. Additionally, Bob Wiley has sent the Trent 900 STEP assembly for the digital twin."
date: 2026-02-01
categories: [Research]
tags: [literature-review, digital-twin, cad-model, progress]
pin: true
image:
  path: assets/img/TN1-001 NACELLE MAIN ASSY V2 (sht 2).jpg
  alt: Trent 900 nacelle main assembly STEP file
---

## Literature Review: Done

The literature review is now complete and published on the [Literature Review](/Aerospace_Digital_Twin/literature-review/) tab. It took a fair amount of time to get right, not just finding sources but making sure every claim was backed by credible, verifiable references. The review covers five sections, and each one was chosen because it directly supports a technical decision in this project.

Here is a summary of what was covered and why.

---

## What Was Covered

### 1. Thrust Reverser Systems & Aviation Safety

This section establishes the real-world problem the project is trying to solve. Thrust reverser failures have caused fatal accidents, most notably Lauda Air Flight 004 (1991) and TAM Airlines Flight 3054 (2007). Both involved asymmetric thrust reverser behaviour that existing monitoring systems failed to detect in time. This was discussed because without understanding the safety problem, the rest of the project has no context.

---

### 2. Digital Twin Technology

This section explains what a digital twin is and how it differs from traditional simulation, along with how Rolls-Royce and Airbus already use digital twins for safety-critical aerospace applications. This was discussed because the entire project depends on a digital twin built in Siemens NX to generate realistic deployment data and testing thrust reverser failures on physical hardware is not an option.

---

### 3. AI and Machine Learning for Fault Detection

This section covers why machine learning is used for fault detection over traditional threshold-based methods and specifically why Random Forest was selected over alternatives like neural networks. This was discussed because the AI model is the core of the detection system and the choice of algorithm needed academic justification.

---

### 4. PLC Control Systems & OPC UA

This section covers the role of PLCs in safety-critical control, PLCSIM Advanced for virtual PLC simulation and OPC UA as the communication standard that bridges the PLC with external software. This was discussed because without these technologies, the system components cannot communicate with each other.

---

### 5. Existing Research & Gap Analysis

This section examines existing work that uses similar technologies, including NASA's asymmetric thrust detection research, Huang et al.'s digital twin engine fault diagnosis and Kilic et al.'s ECAM monitoring system. It identifies that no published work combines a digital twin, machine learning, PLC control logic and OPC UA into a single system targeting thrust reverser deployment states. This was discussed because the gap analysis is what justifies the project's existence.

---

## CAD Model Update: STEP Assembly Received

Bob Wiley ([RTWILEYRC](https://cults3d.com/en/users/RTWILEYRC/3d-models) on Cults3D), the original creator of the Trent 900 model, has sent over the full STEP assembly file containing the nacelle and core engine as one complete assembly. This is a significant step forward as the original purchase only included STL files designed for 3D printing, which are not suitable for engineering simulation in Siemens NX. Having the STEP file means the model can be imported directly into NX as a solid body assembly, ready for the digital twin work.

A massive thank you to Bob Wiley for his generosity and willingness to support the project.

---

## What's Next

With the literature review complete and the CAD model in hand, the focus now shifts to:

- **Importing the STEP assembly into Siemens NX** and exploring the model structure (parts, subassemblies and identifying the thrust reverser components within the full engine)
- **Configuring joints and motion** for the blocker doors and translating cowl
- **Embedding virtual sensors** to generate deployment data (position, velocity, timing)
- **Beginning PLC program development** in TIA Portal V19

The research phase is done. Now the build begins.
