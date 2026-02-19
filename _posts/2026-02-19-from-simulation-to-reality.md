---
title: "From Simulation to Reality: The Physical Implementation Path"
description: "A demonstration of the AI fault detection system to submission advisor Mehnaz Hamilton confirms the core project is finished. Discussion turns to physical implementation for the remaining weeks."
date: 2026-02-19
categories: [Project]
tags: [meeting, advisor, project-management, physical-implementation]
pin: false
image:
  path: assets/img/Electric Turbofan.jpg
  alt: 3D-printable electric turbofan model with functional reverse thrusting
---

## Meeting with Submission Advisor

Today I met with my submission advisor, Mehnaz Hamilton, to outline the current progress of my project. The purpose of the meeting was to demonstrate the AI fault detection system in its current state and discuss the path forward for the remaining weeks of development.

## System Demonstration

I demonstrated the complete system to Mehnaz, walking through the full pipeline: the Siemens NX digital twin simulation, the TIA Portal PLC control, and the Python-based AI classifier with the ECAM-style operator interface. The demonstration included live fault injection across multiple fault types, with the XGBoost model classifying each scenario in real time and displaying results through the GUI.

Mehnaz acknowledged that the core project objectives have been met. The system successfully detects all seven fault types with 99% average confidence in live testing, classification latency is well under the 500ms target, and the operator interface provides clear, actionable information to the user. In terms of the original project specification, the technical work is complete.

## Physical Implementation Discussion

With the core system finished and several weeks remaining before final submission, Mehnaz suggested that I explore a physical implementation of the system. Alongside continued refinement of the virtual system, this would involve transitioning some or all of the monitoring system onto physical hardware.

This is a significant suggestion. The current system runs entirely in simulation: PLCSIM Advanced emulates the PLC and NX MCD provides the digital twin physics. A physical implementation could involve a real Siemens PLC communicating with physical sensors and actuators, with the AI classifier running on a connected workstation.

## Next Steps

I have spoken to Puja, the module leader, about the physical implementation pathway. We will arrange a meeting next week to discuss the scope, feasibility, and what hardware resources are available through the university.

In preparation, I have purchased a 3D-printable electric turbofan model with functional reverse thrusting from Cadly. The purchase includes STL files for 3D printing the physical engine, a PDF assembly guide detailing the required components and pre-existing Arduino code that handles basic functionality: turning on the core engine and deploying and retracting the translating cowls. If the physical implementation is approved, I plan to modify the Arduino code to demonstrate fault injection scenarios, mirroring the fault types already implemented in the virtual system.

![Electric Turbofan](/assets/img/Electric Turbofan.jpg)
_3D-printable electric turbofan model purchased from Cadly for potential physical implementation._

The key questions to address with Puja are whether the university can support 3D printing the model, what additional hardware is needed, and what constitutes a meaningful physical demonstration within the remaining timeline.

In the meantime, development continues on the software side with the PyQt5 GUI rebuild, additional documentation and continued refinement of the virtual system.
