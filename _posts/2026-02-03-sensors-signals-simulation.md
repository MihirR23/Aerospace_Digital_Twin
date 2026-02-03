---
title: "Sensors, Signals and a Simulation That Works"
description: "The MCD solver is calibrated to 100Hz, all 8 sensors are live in the Runtime Inspector and the Signal Adapter is configured to bridge NX to TIA Portal."
date: 2026-02-03
categories: [Development]
tags: [siemens-nx, digital-twin, simulation, sensors, signal-adapter]
pin: true
image:
  path: assets/img/Dual Engine with Updated Physics.png
  alt: Dual Trent 900 engines with updated physics configuration in Siemens NX
---

## Solver Configuration

The MCD solver was configured today to match the 100Hz sampling rate specification defined in the project objectives. The step time was set to 0.01 seconds, the inspector sampling was set to every step and the graph sample time was matched at 0.01 seconds. This ensures the simulation generates data at the resolution needed for the Random Forest classifier to detect timing differences between engines.

---

## Position Control Speed Calibration

The transcowl position control speed needed recalculating. The original value of 100 mm/s was replaced with 20.8 mm/s, based on the real-world deployment time of 2.5 seconds over the scaled 52mm stroke in the model. At 100Hz, this produces 250 data points per deployment, which is more than enough for the machine learning pipeline to identify patterns across normal and faulty scenarios.

---

## Runtime Inspector

All 8 sensors were added to the Runtime Inspector with graphing enabled: 4 position sensors and 4 velocity sensors (one of each per transcowl, across both engines). The simulation ran successfully with the inspector capturing live data. Position sensors showed smooth ramps from 0 to -52mm, velocity sensors held constant at approximately 21 mm/s and deployment duration matched the 2.5-second specification.

This validated that the digital twin physics model produces realistic thrust reverser behaviour.

---

## Signal Adapter Configuration

A Signal Adapter was configured with 16 parameters to bridge the NX digital twin to TIA Portal V19 via PLCSIM Advanced. This includes 8 boolean write parameters for position control activation (deploy and retract for each transcowl) and 8 double read parameters for sensor feedback (position in mm and velocity in mm/s for each transcowl).

This is the designed communication bridge between the digital twin and the PLC. Rather than trying to export data directly from NX, the correct approach is exposing sensors and controls as shared tags that TIA Portal can read and write through PLCSIM Advanced.

---

## What Went Wrong

The MCD Runtime Inspector has no built-in CSV export. Right-clicking graphs only offers zoom options, the Export checkbox relates to external connections rather than file output and the Simulation Record tab captured a session but offered no way to save or export the data. No files were generated in the project directory or temp folder after simulation.

This confirmed that the Runtime Inspector is a monitoring tool, not a data export tool. The proper data pipeline goes through OPC UA and PLCSIM Advanced, which is exactly what the Signal Adapter is designed for.

---

## MCD Over Motion Simulation

Earlier in the session, it was discovered that Simcenter 3D Motion simulation cannot access MCD physics definitions. The Motion simulation that had been previously created was deleted and all work continued exclusively within the Mechatronics Concept Designer environment. This resolved conflicts and allowed the Runtime Inspector to function properly with the MCD Bullet solver.

This decision is documented in [Technical Decisions](/Aerospace_Digital_Twin/technical-decisions/) as TD-003.

---

## What's Next

- **Signal Mapping** to connect the 16 Signal Adapter parameters to their corresponding signals within NX
- **TIA Portal V19 PLC Programming** to create SCL logic for deployment sequencing, simultaneous transcowl activation per engine, and safety interlocks
- **PLCSIM Advanced Connection** to establish live tag exchange between the virtual PLC and the NX digital twin
- **HMI Dashboard** design with colour-coded fault indicators
- **Fault Scenario Generation** using the PLC to inject faults across all five categories
- **Python Data Logging and AI Training** to log sensor data via OPC UA and train the Random Forest classifier
