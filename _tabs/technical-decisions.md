---
title: Technical Decisions
icon: fas fa-lightbulb
order: 6
---

A record of key engineering decisions made throughout this project, including the reasoning and trade-offs considered.

---

## TD-001: Use Existing CAD Models Instead of Building from Scratch

**Date:** 27 January 2026

**Decision:** Purchase professionally designed thrust reverser and jet engine CAD models from Cults3D rather than modelling from scratch.

**Context:** The original plan was to build all CAD geometry from scratch in Siemens NX. During the Christmas holidays, I attempted this approach by following YouTube tutorials and adapting them for my requirements.

**Problem:** 
- Jet engine geometry proved more complex than anticipated
- Precise dimensions and tolerances weren't readily available from public sources
- Weeks were being spent on CAD work instead of the core project contribution (AI fault detection)
- Results were unsatisfactory for engineering simulation purposes

**Options Considered:**
1. Continue building from scratch (time-intensive, uncertain quality)
2. Purchase professional CAD models (cost involved, guaranteed quality)
3. Use simplified placeholder geometry (faster, but less realistic simulation)

**Decision Rationale:** Option 2 was selected. The £9.17 investment in RTWILEYRC's Functional Thrust Reverser model saved weeks of modelling time and provided simulation-ready components including blocker doors, cascade vanes and translating cowl mechanisms.

**Trade-offs:**
- (+) Significant time savings
- (+) Professional quality geometry
- (+) Includes functional mechanisms needed for simulation
- (-) Required manual STL to STEP conversion in SolidWorks
- (-) Less flexibility to modify core geometry

**Outcome:** Focus can now shift to PLC control logic, OPC UA integration and Random Forest fault detection—the actual contribution of this project.

---

## TD-002: Request STEP Files from Creator Rather Than Manual Conversion

**Date:** 28 January 2026

**Decision:** Contact RTWILEYRC directly to request STEP files instead of manually converting 87 STL files.

**Context:** After purchasing the High Bypass Engine Nacelle model (87 STL files), manual conversion to STEP format was required for Siemens NX compatibility. Initial attempts using SolidWorks produced files that failed to open correctly in Siemens NX.

**Problem:**
- Manual STL to STEP conversion proved unreliable for complex geometry
- 87 files would require significant time to convert individually
- Converted files were failing to load in Siemens NX
- Fusion 360 required a paid licence
- Fusion360 was attempted on Jason Scott's recommendation but batch conversion remained time-consuming

**Options Considered:**
1. Manually convert all 87 STL files (time-intensive, unreliable results)
2. Use different conversion software (Inventor, FreeCAD, Online Converters)
3. Contact the creator to request native STEP files

**Decision Rationale:** Option 3 selected. The presence of DWG files in the download suggests RTWILEYRC may have native CAD files or assemblies available. Direct communication could save significant time and yield better quality files.

**Status:** Awaiting response from RTWILEYRC.

**Update:** Acquired files from RTWILEYRC.

---

## TD-003: Mechatronics Concept Designer Over Motion Simulation

**Date:** 3 February 2026

**Decision:** Use the Mechatronics Concept Designer (MCD) environment exclusively and delete the previously created Simcenter 3D Motion simulation.

**Context:** The digital twin had physics defined using MCD (rigid bodies, joints, position controls, sensors). A separate Motion simulation had also been created earlier in the project.

**Problem:**
- Simcenter 3D Motion simulation cannot access MCD physics definitions
- The two environments were conflicting, preventing the Runtime Inspector from functioning correctly
- Running both created ambiguity about which solver was controlling the simulation

**Options Considered:**
1. Rebuild all physics in Motion simulation (time-intensive, loses MCD Runtime Inspector)
2. Delete Motion simulation and work exclusively in MCD (preserves all existing work)
3. Maintain both environments for different purposes (conflicts and confusion)

**Decision Rationale:** Option 2 was selected. All physics definitions, sensors and controls had already been built in MCD. The Runtime Inspector and Bullet solver within MCD provide everything needed for data monitoring. Deleting the Motion simulation eliminated conflicts immediately.

**Outcome:** Runtime Inspector functioned correctly with the MCD Bullet solver. All 8 sensors captured live data during simulation.

---

## TD-004: OPC UA Data Pipeline Over Direct NX Export

**Date:** 3 February 2026

**Decision:** Use the Signal Adapter and OPC UA via PLCSIM Advanced for data export, rather than attempting to export CSV data directly from the NX Runtime Inspector.

**Context:** After a successful simulation run, an attempt was made to export sensor data from the MCD Runtime Inspector as CSV files for the Python machine learning pipeline.

**Problem:**
- The MCD Runtime Inspector has no built-in CSV export capability
- Right-clicking graphs only offered zoom options
- The Export checkbox relates to external connections, not file output
- The Simulation Record captured a session but provided no way to save data
- No files were generated in the project directory or temp folder

**Options Considered:**
1. Find a workaround to extract data directly from NX (no viable method found)
2. Use the Signal Adapter to expose sensor data as shared tags, then route data through PLCSIM Advanced and OPC UA to Python

**Decision Rationale:** Option 2 was selected. The Signal Adapter is the designed bridge between NX and external control systems. A 16-parameter configuration was created (8 boolean write parameters for position control activation, 8 double read parameters for sensor feedback). This routes data through TIA Portal and OPC UA to Python, which also demonstrates the full PLC integration that is a core requirement of the project.

**Outcome:** Signal Adapter configured and ready for signal mapping. The data pipeline will flow: NX sensors → Signal Adapter → PLCSIM Advanced → TIA Portal → OPC UA → Python.

---

## TD-005: Analog-Only Control Architecture

**Date:** 5 February 2026

**Decision:** Transition from boolean + analog control to analog-only control for all Position Controls in the digital twin.

**Context:** The original control architecture used boolean signals (`Deploy_Engine_One_Transcowls`, `Retract_Engine_One_Transcowls`) to activate Position Control objects, with separate analog signals providing position and speed parameters.

**Problem:**
- Testing revealed that the NX MCD Position Control `active` parameter does not respond to external signal writes
- Despite correct formula linkages between boolean input signals and Position Control active parameters, the Runtime Inspector consistently displayed `active = true` regardless of the boolean state sent from TIA Portal
- This behaviour persisted across simulation restarts and signal remapping attempts
- With both deploy and retract controls activating simultaneously, they conflicted, causing transcowl bounce during retraction

**Root Cause:** The `active` parameter appears to be exposed for monitoring only, not for external control. This is a limitation in how Siemens NX MCD exposes certain physics object properties.

**Options Considered:**
1. Continue debugging boolean control (time-consuming, unlikely to succeed given the apparent NX limitation)
2. Transition to analog-only control where position and speed values command movement directly

**Decision Rationale:** Option 2 was selected. A single Position Control per transcowl now handles both directions by changing the target position (52mm for deploy, 0mm for retract). Boolean signals, formulas and TIA Portal tags were removed entirely.

**Established Normal Operating Parameters:**

| Parameter | Deploy | Retract |
|-----------|--------|---------|
| Position | 52.0 mm | 0.0 mm |
| Speed | 20.8 mm/s | 20.8 mm/s |

**Outcome:** Deployment and retraction both work correctly without bounce. The architecture is cleaner and provides full fault scenario capability by allowing the PLC to vary position and speed values directly.

---

## TD-006: Python Snap7 for Data Logging

**Date:** 9 February 2026

**Decision:** Use Python Snap7 library for automated data logging instead of TIA Portal Trace or OPC UA, following a recommendation from Oluwatunmise Shuaibu.

**Context:** The project requires 250+ labelled deployment scenarios for Random Forest classifier training. An efficient, automated data logging solution was needed to capture sensor data during normal and fault conditions.

**Methods Evaluated:**

| Method | Outcome |
|--------|---------|
| TIA Portal Trace | Partial success: manual triggering works but automatic trigger unreliable |
| OPC UA | Blocked: requires paid Siemens license not available |
| Python Snap7 | Selected: free, direct S7 protocol access to PLCSIM Advanced |

**TIA Portal Trace:** Initial testing confirmed Trace can record all 10 sensor signals and export to CSV. However, the "Trigger on tag" feature did not reliably activate recording when transcowl position exceeded the threshold. Manual activation and deactivation is inefficient for 250+ recordings.

**OPC UA:** Configured OPC UA server in TIA Portal with security settings (no security policy enabled, user authentication with credentials). Compilation revealed licensing error: "The selected OPC UA license is not sufficient. To use OPC UA, please purchase the correct license and select it." This blocked OPC UA as a viable option.

**Decision Rationale:** Python Snap7 was selected as the data logging solution. Snap7 is an open-source library that communicates directly with Siemens PLCs (and PLCSIM Advanced) via the S7 protocol. Benefits include:

- No licensing requirements
- Direct memory access to PLC data blocks
- Full programmatic control over sampling rate and recording triggers
- Native Python integration for seamless ML pipeline connection
- Automatic file naming and batch recording capability

**Outcome:** Snap7 implementation to be completed in the next session. This approach provides the automation and efficiency required for generating the 250+ scenario dataset but is yet to be proven in practice.

## TD-007: PLCSim Advanced .NET API Over Snap7

**Date:** 10 February 2026

**Decision:** Use PLCSim Advanced native .NET API via pythonnet instead of Snap7 for automated data logging.

**Context:** TD-006 selected Python Snap7 (recommended by Oluwatunmise Shuaibu) as the data logging solution. During implementation, Snap7 failed to connect to PLCSim Advanced due to network accessibility issues.

**Problem:**
- Snap7 connection attempts failed with "TCP: Unreachable peer" errors
- PLCSim Advanced in PLCSIM (softbus) mode assigns the virtual PLC an internal address of 192.168.0.1
- This address exists on an internal virtual network not accessible via standard TCP/IP from the host PC
- The Siemens PLCSIM Virtual Ethernet Adapter required to bridge the networks was not present
- OPC UA had the same network accessibility issue

**Solution:** PLCSim Advanced exposes a native .NET API that allows direct interaction with simulation instances without requiring network connectivity. Python accesses this via the pythonnet package.

**Advantages over Snap7:**
- Direct tag access by name (no memory addresses required)
- No network configuration required
- Works in PLCSIM (softbus) mode without additional adapters
- 100Hz sampling rate achieved

**Decision Rationale:** The native API bypasses all network complexity. Unlike Snap7 which requires TCP/IP connectivity to the virtual PLC, the .NET API communicates directly through the simulation runtime. This eliminated the network configuration issues that blocked Snap7.

**Outcome:** Five fault scenarios successfully recorded and validated. Data pipeline ready for batch recording of remaining scenarios.

---

## TD-008: PLC State Machine Timeout for Fault Scenarios

**Date:** 10 February 2026

**Decision:** Add 5-second timeout to deployment completion check (state 40).

**Context:** Incomplete deployment fault scenarios cause the PLC to wait indefinitely at state 40 for all transcowls to reach 50mm or more. When Engine Two is set to deploy to 35mm, the condition never satisfies, and the state machine hangs.

**Problem:**
- State 40 waits for all transcowl positions to reach 50mm
- Incomplete deployment faults intentionally command lower positions
- The state machine would never advance, preventing data capture

**Solution:** Added Timer_2 to state 40. The state now advances either when all positions reach 50mm or when a 5-second timeout expires.

**New tags required:**
- Timer_2_Start (Bool, %M1.0)
- Timer_2_Finished (Bool, %M1.1)
- IEC_Timer_0_DB_2 (Timer DB)

**Decision Rationale:** The timeout ensures the state machine always completes the full cycle, allowing data capture for fault scenarios where deployment targets are not reached. The 5-second timeout provides sufficient time for normal deployment while preventing indefinite hangs.

**Outcome:** Incomplete deployment scenarios now complete successfully. Data logger captures full cycle data for all fault types.

---
