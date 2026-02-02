---
layout: page
title: About
icon: fas fa-user
order: 2
---

## About This Project Monkey

On 26th May 1991, Lauda Air Flight 004 disintegrated mid-air over Thailand after a thrust reverser deployed unexpectedly during cruise flight. All 223 people on board perished. Sixteen years later, TAM Airlines Flight 3054 overran the runway in São Paulo when asymmetric thrust reverser deployment caused the aircraft to veer uncontrollably which resulted in the lost of 199 lives.

These tragedies share a common thread: the failure to detect and respond to thrust reverser deployment anomalies in real-time.

This project aims to address that gap.

![Boeing 787 with thrust reversers deployed](/assets/img/Boeing%20787%20Thrust%20Reverser.jpg){: .shadow style="max-width: 100%" }
*Boeing 787 with thrust reversers deployed during landing. Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Boeing_787_landing_with_thrust_reversers_activated_crop.jpg)*

### The Challenge

Thrust reversers redirect engine exhaust forward during landing, reducing stopping distance by 30-40%. When both engines deploy symmetrically, the system works as designed. But when one deploys and the other doesn't or when deployment timing differs by mere milliseconds, the resulting asymmetric forces can be catastrophic.

Current monitoring systems focus on individual actuator positions. What's missing is sophisticated synchronisation analysis between engines, the critical measurement that could prevent asymmetric deployment disasters.

### The Solution

This project develops an AI-enhanced monitoring system that combines:

- **Digital Twin Technology** - A physics-based simulation of dual pneumatic actuators in Siemens NX, generating realistic deployment data at 100Hz
- **Industrial Control Systems** - Real-time PLC logic with safety interlocks, programmed in SCL using TIA Portal V19 and S7-PLCSIM Advanced 6.0
- **Machine Learning** - A Random Forest classifier trained to detect asymmetric deployment, timing mismatches, incomplete deployment and actuator degradation
- **Real-time Monitoring** - An HMI dashboard displaying live synchronisation status with traffic-light health indicators

### System Architecture

![System Architecture](/assets/img/System%20Architecture.png){: .shadow style="max-width: 100%" }

### Performance Targets

| Metric | Target |
|--------|--------|
| Classification Accuracy | >90% |
| Fault Recall | >85% |
| Detection Latency | <500ms |

---

## About Me

I'm Mihir Ragoonauth, a final year Mechatronics and Robotics Engineering student at Middlesex University.

My path to engineering began not in a classroom, but in front of a television screen. Watching Air Crash Investigation as a child, I was captivated not by the disasters themselves, but by the forensic precision with which investigators pieced together what went wrong and more importantly, how engineers redesigned systems to ensure it never happened again. Programmes like Heathrow: Britain's Busiest Airport and Ultimate Airport Dubai showed me the other side: the orchestrated complexity of keeping thousands of flights moving safely every day.

That fascination never faded. It evolved into a dream of becoming an aerospace engineer, someone who doesn't just understand how aircraft work but who actively makes them safer.

### Career Aspirations

My ambition is to work at the forefront of aerospace engineering with industry leaders like Boeing, GE Aerospace, Rolls Royce or British Airways. But one company stands out above the rest: **Airbus**.

Their ZEROe programme is to develop the world's first hydrogen-powered commercial aircraft represents exactly the kind of bold, sustainable innovation I want to be part of. Aviation accounts for 2-3% of global CO₂ emissions and Airbus is engineering the solution. That's the future I want to help build.

One day, I hope to contribute to the future of sustainable aviation and perhaps even realise my dream of starting my own airline.
