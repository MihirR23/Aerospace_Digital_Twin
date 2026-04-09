---
title: Resources
icon: fas fa-folder-open
order: 8
---

A collection of resources used throughout this project.

---

## CAD Models

| Resource | Creator | Description |
|----------|---------|-------------|
| [Functional Thrust Reverser - Trent 900](https://cults3d.com/en/3d-model/gadget/functional-thrust-reverser-trent-900) | RTWILEYRC | Nacelle with blocker doors, cascade vanes and translating cowl mechanism |
| [3D Printable Jet Engine](https://cults3d.com/en/3d-model/various/3d-printable-jet-engine-minimal-printing-supports) | RTWILEYRC | Jet engine core housed within the nacelle |
| [High Bypass Engine Nacelle](https://cults3d.com/en/3d-model/gadget/high-bypass-engine-nacelle) | RTWILEYRC | Complete nacelle with jet engine included (87 parts) |
| [Emirates Airbus A380-861](https://www.cgtrader.com/free-3d-models/aircraft/commercial-aircraft/emirates-emirates-airbus-a380-861-a6-eoi) | kaichinshih | A380 GLB model used in the Landing Simulation tab |

---

## Tutorials & References

| Resource | Type | Notes |
|----------|------|-------|
| [Jet Engine CAD Tutorial](https://www.youtube.com/watch?v=6TIex4nyz7c) | YouTube | Initial attempt at building from scratch (approach later abandoned) |

---

## Software Tools

| Tool | Purpose |
|------|---------|
| Siemens NX (MCD) | Digital twin simulation, CAD assembly, GLB export |
| TIA Portal V19 | PLC programming (SCL) for both virtual and physical stations |
| S7-PLCSIM Advanced 6.0 | Virtual PLC with .NET API for Python communication |
| SolidWorks | STL to STEP file conversion |
| Python (XGBoost) | 7-class fault classification (99.8% accuracy, 24.7ms latency) |
| Python (PyQt5) | Operator interface with EICAS display, fault injection and 3D viewer |
| Three.js (r128) | 3D engine schematic and landing simulation via WebGL |
| FluidSim | Pneumatic circuit design and simulation (retained as design blueprint) |
| WinCC (KTP700) | HMI operator interface for physical station scenario control |

---

## Hardware (Festo EduTrainer Pneumatic Station)

### Version 2 (Final Configuration)

| Component | Quantity | Purpose |
|-----------|----------|---------|
| Rotary actuators with magnetic sensors | 2 | Thrust reverser deployment (3 positions: retracted, mid-stroke, deployed) |
| Magnetic sensors (per actuator) | 3 | Position feedback at retracted, Halted (mid-stroke) and deployed positions |
| 5/2 way solenoid valves | 2 | Extension and retraction direction control |
| 3/2 way solenoid valves (normally closed) | 2 | Independent air supply control per actuator |
| Festo HGL piloted check valves | 4 | Position locking when air supply is cut |
| Flow restrictors | 2 | Stroke speed reduction for mid-stroke sensor detection |
| Siemens S7-1200 PLC | 1 | Physical station control via TIA Portal V19 SCL |
| Siemens KTP700 Basic HMI | 1 | Touchscreen operator interface for scenario selection |

### Version 1 (Initial Configuration)

| Component | Quantity | Purpose |
|-----------|----------|---------|
| Double-acting pneumatic cylinders | 2 | Thrust reverser deployment (2 positions: retracted, deployed) |
| 4-slice solenoid valve manifold (double solenoid) | 1 | Deploy and retract direction control |
| Digital pressure sensors (3 outputs each) | 2 | Extend and retract pressure monitoring |
| Siemens S7-1200 PLC | 1 | Physical station control |
| Siemens KTP700 Basic HMI | 1 | Touchscreen operator interface |
