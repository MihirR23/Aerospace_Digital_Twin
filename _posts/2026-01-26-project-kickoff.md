---
title: "Project Kickoff: AI-Enhanced Thrust Reverser Monitoring"
description: "Introducing my final year project, developing an AI-powered monitoring system for aircraft thrust reverser deployment using digital twin technology."
date: 2026-01-26
categories: [Project]
tags: [introduction, objectives, planning]
pin: true
image:
  path: assets/img/Aircraft_Instruments.jpg
  alt: Aircraft cockpit instruments and monitoring displays
---

## The Problem

On 26th May 1991, Lauda Air Flight 004 disintegrated mid-air over Thailand. The cause was an uncommanded thrust reverser deployment at cruising altitude. All 223 people on board lost their lives.

Sixteen years later, TAM Airlines Flight 3054 suffered a similar fate. Asymmetric thrust reverser deployment caused the aircraft to veer off the runway in São Paulo, killing 199 people.

**What are thrust reversers?** They are systems that redirect engine exhaust forward during landing, reducing stopping distance by 30-40%. They are critical safety components, but only when both engines deploy symmetrically. If one reverser deploys while the other doesn't, the resulting asymmetric forces can cause the aircraft to veer uncontrollably.

**The gap:** Current monitoring systems focus on individual actuator positions. What's missing is sophisticated synchronisation analysis between engines: the ability to detect when left and right actuators aren't deploying at the same time and speed.

---

## Why I Chose This Project

Aviation has fascinated me since childhood. Watching programmes like Air Crash Investigation, I became captivated not by the disasters themselves but by how engineers analyse failures and redesign systems to prevent them from happening again.

This project allows me to combine that passion with my mechatronics engineering skills. It addresses a real-world safety challenge while integrating all four pillars of mechatronics: mechanical systems, electronics, control systems and software.

The goal isn't just academic. It's to demonstrate how digital twin technology and AI can enhance aviation safety monitoring.

---

## Project Aim

To develop an AI-enhanced monitoring system that detects asymmetric thrust reverser deployment in real-time using digital twin simulation and machine learning.

---

## Objectives

1. **Develop a digital twin** in Siemens NX to simulate dual thrust reverser actuators, generating realistic deployment data at 100Hz

2. **Implement real-time control** using TIA Portal V19 and S7-PLCSIM Advanced 6.0 with PLC logic and safety interlocks

3. **Train an AI fault detector** using a Random Forest classifier to detect asymmetric deployment, incomplete deployment, timing mismatches and actuator degradation

4. **Validate system performance** across multiple failure scenarios, targeting >90% accuracy, >85% recall and <500ms detection latency

---

## Approach

This project integrates four key technologies:

| Component | Tool | Purpose |
|-----------|------|---------|
| Digital Twin | Siemens NX | Physics-based simulation of dual pneumatic actuators |
| Control System | TIA Portal V19 + S7-PLCSIM Advanced 6.0 | PLC programming in SCL and virtual testing |
| AI/ML | Python + scikit-learn | Random Forest fault classification |
| Interface | HMI Dashboard | Real-time monitoring with health status indicators |

The system architecture connects these components via OPC UA communication, enabling real-time data exchange between the digital twin and control system, with the AI module analysing sensor data to detect faults.

---

## What's Next

With the project scope defined and blog infrastructure complete, the immediate next steps are:

- Beginning the literature review on thrust reverser systems, digital twin technology, and AI fault detection methods
- Starting CAD model development in Siemens NX
- Researching existing industry solutions and regulatory standards
