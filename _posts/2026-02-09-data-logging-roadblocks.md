---
title: "Data Logging Roadblocks: From OPC UA to Snap7"
description: "TIA Portal Trace works but does not scale. OPC UA requires a paid license. The solution is Python Snap7 for direct PLC communication."
date: 2026-02-09
categories: [Development]
tags: [data-logging, opc-ua, snap7, python, tia-portal]
pin: true
image:
  path: assets/img/Normal Deployment CSV Data.png
  alt: CSV export showing normal deployment sensor data with timestamps and 10 sensor channels from TIA Portal Trace
---

## The Data Logging Challenge

The Random Forest classifier needs 250 labelled deployment scenarios for training. That means 250 separate recordings of sensor data, each tagged as normal or one of the fault categories. Manual recording is not practical at that scale. An automated solution was needed.

---

## TIA Portal Trace: Partial Success

TIA Portal Trace was the first approach tested. The good news: it works. A normal deployment cycle was successfully recorded and exported to CSV (`Normal_Deployment_Cycle_001.csv`). The file contains timestamps and all 10 sensor values, confirming the data structure is correct.

The problem is efficiency. The "Trigger on tag" feature, which should automatically start recording when a condition is met (such as transcowl position exceeding a threshold), did not reliably activate. Manual triggering works, but clicking start and stop 250 times is not a viable workflow.

---

## OPC UA: Blocked by Licensing

OPC UA was the next option explored. The server was configured in TIA Portal with security settings (no security policy enabled, user authentication with credentials). Everything looked ready.

Then the compilation revealed the issue: "The selected OPC UA license is not sufficient. To use OPC UA, please purchase the correct license and select it."

OPC UA requires a paid Siemens license that is not available in the current setup. This blocked OPC UA as a viable option entirely.

---

## Python Snap7: The Solution

With TIA Portal Trace being inefficient and OPC UA being unavailable, the solution is Python Snap7. Snap7 is an open-source library that communicates directly with Siemens PLCs (and PLCSIM Advanced) via the S7 protocol.

Benefits:
- No licensing requirements
- Direct memory access to PLC data blocks
- Full programmatic control over sampling rate and recording triggers
- Native Python integration for seamless connection to the ML pipeline
- Automatic file naming and batch recording capability

This approach provides the automation needed for generating 250+ scenarios without manual intervention.

---

## Results

- One successful normal deployment recording exported to CSV
- Data structure validated (timestamps plus 10 sensor channels)
- OPC UA security configuration completed for future reference if a license is obtained
- Snap7 implementation pending

---

## What's Next

- Install the python-snap7 library
- Develop a Python script for automated data recording
- Test connection to PLCSIM Advanced
- Record normal and fault scenarios
- Begin building the labelled dataset for ML training
