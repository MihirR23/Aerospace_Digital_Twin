---
title: "Cracking the Connection: Python Meets PLCSim Advanced"
description: "OPC UA failed. Snap7 failed. The solution was hiding in plain sight: Siemens' own .NET API. Five fault scenarios recorded and validated."
date: 2026-02-10
categories: [Development]
tags: [python, plcsim-advanced, data-logging, automation, machine-learning]
pin: true
image:
  path: assets/img/Data Logging Scenarios.png
  alt: Five recorded deployment scenarios showing normal and fault conditions
---

## The Challenge

The Random Forest classifier needs approximately 250 labelled deployment scenarios for training. Manual data collection using TIA Portal Trace worked, but it required manually activating the trace, monitoring the recording and exporting the data for each scenario. With 250 scenarios required, that workflow was not going to scale.

---

## OPC UA: Network Unreachable

The first alternative explored was OPC UA. The server was enabled in TIA Portal with username and password authentication configured. Initial compilation failed with what looked like a license error but after further investigation, the actual issue was a missing configuration step. Enabling the Runtime License option in the OPC UA server settings resolved the compilation error.

However, connection attempts from Python failed with timeout errors. The root cause was network accessibility. PLCSim Advanced running in PLCSIM (softbus) mode assigns the virtual PLC an internal address of 192.168.0.1 but this address exists on an internal virtual network that is not accessible via standard TCP/IP from the host PC. Ping tests confirmed the address was unreachable.

---

## Snap7: Same Problem

Snap7 was investigated as an alternative using the native S7 communication protocol rather than OPC UA. The python-snap7 package was installed and connection parameters were configured for the PLCSim Advanced instance.

Connection attempts failed with "TCP: Unreachable peer" errors due to the same underlying network issue. The system lacked the Siemens PLCSIM Virtual Ethernet Adapter, which is required to bridge the virtual PLC network to the host system. The adapter was not present in the Windows network adapter list.

---

## The Solution: PLCSim Advanced Native API

Siemens provides a native .NET API for PLCSim Advanced that allows direct interaction with simulation instances without requiring network connectivity. The API is installed with PLCSim Advanced and located in the Common Files directory. Python accesses this API through the pythonnet package, which enables Python to load and call .NET assemblies.

The connection pattern involves adding a reference to the API DLL, importing the runtime namespace, creating an interface to the named PLCSim instance and calling UpdateTagList() to synchronise the tag database. Once connected, sensor values are read using ReadFloat() with the tag name as a string parameter. The API also supports WriteBool() and WriteFloat() for controlling PLC outputs.

This bypasses all network complexity. Unlike OPC UA and Snap7 which require TCP/IP connectivity to the virtual PLC, the .NET API communicates directly through the simulation runtime.

---

## Data Logger Implementation

A Python script was developed to automate the recording process. The script connects to PLCSim Advanced, prompts for a scenario name and waits for deployment to begin by polling the Engine One Left Transcowl Position Sensor. When the position exceeds 1mm, recording starts and sensor values are captured at approximately 100Hz.

The recording loop continues until one of three conditions is met:
- Normal completion when the transcowls retract below 2mm after having been deployed past 50mm
- A maximum recording time of 20 seconds as a safety timeout
- Stuck detection when velocity remains near zero for 5 seconds while position is between 5mm and 50mm

All sensor data is written to a timestamped CSV file with columns for time and the 10 sensor channels.

---

## PLC Modifications

Testing the incomplete deployment scenario revealed a problem. The PLC state machine would wait indefinitely at state 40 for all transcowls to reach 50mm or more. When Engine Two is commanded to only 35mm, this condition can never be satisfied.

A timeout was added to state 40 using a second timer. The state now advances either when all positions reach 50mm or when a 5-second timeout expires. This ensures the state machine always completes the full cycle, allowing data capture for fault scenarios where deployment targets are not achieved.

---

## Results

Five scenario types were successfully recorded, validating the complete data capture pipeline:

| Scenario | Samples | Description |
|----------|---------|-------------|
| Normal_001 | 410 | Both engines deploying to 52mm at 20.8mm/s |
| Asymmetric_001 | 530 | Engine Two at reduced speed (10mm/s) |
| Incomplete_Deployment_001 | 545 | Engine Two commanded to only 35mm |
| Delayed_Deployment_001 | 535 | Engine Two deploying at 5mm/s |
| Combined_Faults_001 | 541 | Engine Two at 40mm position and 10mm/s speed |

The varying sample counts reflect the different cycle durations caused by the fault parameters, with slower speeds and timeout conditions extending the recording time.

---

## What's Next

The current workflow still requires manually editing SCL code, compiling, downloading and running the Python script for each scenario. To efficiently capture the remaining 245 scenarios, the next session will implement automated batch recording.

This requires creating global PLC tags for the deployment parameters so Python can write values directly without recompiling. A state variable tag will allow Python to trigger cycles programmatically. The batch recorder script will define all 250 scenarios with their parameters and labels, then loop through each one automatically.

Estimated time reduction: from 8-10 hours of manual recording to approximately 2-3 hours of automated batch recording.
