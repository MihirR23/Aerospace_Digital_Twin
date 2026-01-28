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

---
