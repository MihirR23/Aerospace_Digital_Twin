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

## TD-009: Random Forest as Primary Classifier

**Date:** 12 February 2026

**Decision:** Select Random Forest over Multi-Layer Perceptron Neural Network as the primary fault detection classifier.

**Context:** Following successful batch recording of 250 fault scenarios, two machine learning classifiers were developed and evaluated using identical input of 45 engineered features. The project targets specify greater than 90% accuracy, greater than 85% recall, and detection latency under 500 milliseconds.

**Problem:**
- A single classifier needed to be selected for integration with the HMI system
- Single-run evaluations can produce misleading results due to random train/test splits
- Both classifiers showed weakness distinguishing Asymmetric_Speed from Delayed_Deployment

**Evaluation:** Both classifiers were tested across 10 independent runs with different random seeds to establish true performance variance:

| Metric | Random Forest | Neural Network | Target |
|--------|---------------|----------------|--------|
| Accuracy | 91.8% ± 2.3% | 88.8% ± 3.9% | >90% |
| Recall | 91.8% ± 2.3% | 88.8% ± 3.9% | >85% |
| Latency | 2.31ms | 4.36ms | <500ms |

| Fault Type | Random Forest | Neural Network |
|------------|---------------|----------------|
| Normal | 100% | 100% |
| Incomplete_Deployment | 100% | 100% |
| Combined_Fault | 98% ± 4% | 92% ± 8.7% |
| Asymmetric_Speed | 82% ± 7.5% | 81% ± 14.5% |
| Delayed_Deployment | 79% ± 10.4% | 71% ± 7% |

**Decision Rationale:** Random Forest met all three project targets. The Neural Network failed the accuracy target on conservative estimates (mean minus one standard deviation gave 84.9%). Random Forest also offered lower variance, faster inference (2x speed advantage) and interpretable feature importance analysis for technical reporting.

**Known Limitation:** Asymmetric_Speed and Delayed_Deployment exhibit overlapping feature patterns because both involve reduced velocities. This is documented as a genuine engineering challenge rather than artificially widened. Future improvement path: time-series analysis (1D CNN or LSTM on raw sensor data) to capture temporal deployment patterns.

**Outcome:** Random Forest selected as primary classifier. Neural Network retained as comparison model to demonstrate evaluation rigour. Files created: `train_classifier_rf_v2.py`, `train_classifier_nn.py`, `model_robustness_evaluation.py`.

---

## TD-010: 1000-Scenario Dataset Expansion

**Date:** 12 February 2026

**Decision:** Expand the dataset from 250 to 1000 scenarios with unique randomised parameters.

**Context:** The 250-scenario dataset met project targets but had statistical limitations. With an 80/20 train/test split, the test set contained only 50 samples (10 per class), meaning a single misclassification changed accuracy by 2%.

**Problem:**
- Test set too small for statistically reliable evaluation
- Neural Network comparison was unfair due to insufficient training data
- Only 10 test samples per weak class made it unclear whether low scores reflected data limitation or genuine feature overlap
- Limited parameter coverage across the fault space

**Solution:** Generate 1000 scenarios (200 per fault type) with three design principles: unique values using 0.01mm/s increments to prevent duplicates, strict E1/E2 alternation for balanced engine representation and a fixed Normal baseline of 52mm at 20.8mm/s.

| Fault Type | Position Range | Speed Range |
|------------|----------------|-------------|
| Normal | 52.0mm (fixed) | 20.8mm/s (fixed) |
| Asymmetric_Speed | 52.0mm (fixed) | 5.0-16.0mm/s (one engine) |
| Incomplete_Deployment | 20.0-45.0mm | 20.8mm/s (fixed) |
| Delayed_Deployment | 52.0mm (fixed) | 3.0-10.0mm/s |
| Combined_Fault | 25.0-50.0mm | 8.0-25.0mm/s |

**Decision Rationale:** With 1000 scenarios, the test set grows to 200 samples where a single error impacts accuracy by only 0.5%. This provides statistically reliable evaluation, a fairer Neural Network comparison with 800 training samples and comprehensive fault parameter coverage. The 250-scenario model already meets targets so the expansion is an enhancement with no downside risk.

**Outcome:** 661 of 1000 scenarios recorded before session pause (Normal, Asymmetric_Speed, and Incomplete_Deployment complete; Delayed_Deployment at 61/200; Combined_Fault pending). File created: `batch_recorder_1000_final.py` with pause/resume capability.

---

## TD-011: 1000-Scenario Random Forest as Final Classifier

**Date:** 13 February 2026

**Decision:** Select the 1000-scenario Random Forest model as the final deployed classifier despite identical mean accuracy to the 250-scenario version.

**Context:** The 250-scenario Random Forest achieved 91.8% ± 2.3% accuracy. A 1000-scenario dataset was generated to improve statistical reliability and address weak-class performance on Asymmetric_Speed (82%) and Delayed_Deployment (79%).

**Problem:**
- Test set of 50 samples (10 per class) made evaluation sensitive to random sampling effects
- Unclear whether weak-class performance reflected data limitation or genuine feature overlap
- Single misclassification shifted accuracy by 2%, undermining confidence in reported metrics

**Results (1000-scenario, 10 independent runs):**

| Metric | Random Forest | Neural Network |
|--------|---------------|----------------|
| Accuracy | 91.8% ± 2.1% | 89.7% ± 1.9% |
| Recall | 91.8% ± 2.1% | 89.7% ± 1.9% |
| Latency | 35.98ms | 1.87ms |

**Per-class shifts (250 to 1000 Random Forest):**

| Fault Type | 250 Scenarios | 1000 Scenarios | Change |
|------------|---------------|----------------|--------|
| Normal | 100% | 100% | 0% |
| Incomplete_Deployment | 100% | 99.8% ± 0.8% | ~0% |
| Combined_Fault | 98% ± 4% | 100% ± 0% | +2% |
| Asymmetric_Speed | 82% ± 7.5% | 72% ± 8.8% | -10% |
| Delayed_Deployment | 79% ± 10.4% | 87% ± 5.1% | +8% |

**Known Trade-off:** Asymmetric_Speed per-class accuracy dropped from 82% to 72%. This is attributed to the 40 "both engines slow" Delayed_Deployment scenarios which create feature overlap with Asymmetric_Speed. The confusion matrix confirms bidirectional misclassification between these two classes exclusively.

**Decision Rationale:** The 1000-scenario model provides more trustworthy metrics for academic reporting. The test set contains 40 samples per class versus 10, meaning each misclassification shifts accuracy by 0.5% instead of 2%. Overall variance reduced from ±2.3% to ±2.1%, Delayed_Deployment improved by 8 percentage points with halved variance and Combined_Fault reached perfect classification. The system still meets the greater than 90% mean accuracy target.

**Outcome:** Model saved as `fault_classifier_rf_1000.pkl` and deployed in the real-time classification GUI.

---

## TD-012: Python GUI as Primary Interface (Virtual Environment)

**Date:** 13 February 2026

**Decision:** Use a Python tkinter GUI as the primary operator and monitoring interface instead of developing a WinCC HMI in TIA Portal.

**Context:** The project requires a Human-Machine Interface for operator control and AI fault status display. The original plan included WinCC HMI development in TIA Portal. However, the system operates entirely in a virtual environment using PLCSim Advanced rather than physical hardware.

**Problem:**
- WinCC HMI cannot natively integrate machine learning inference or advanced monitoring features
- In a virtual environment, both WinCC and Python communicate with the PLC via the same mechanism (tag read/write)
- Developing both interfaces would duplicate effort without adding technical value

**Options Evaluated:**

| Option | Pros | Cons |
|--------|------|------|
| WinCC HMI in TIA Portal | Standard industrial approach, familiar to examiners | Redundant for virtual PLC, limited AI integration, separate application from classifier |
| Python GUI (tkinter) | Direct PLCSim Advanced API access, integrates AI and operator controls in one application | Non-standard industrial approach |
| Both (WinCC + Python) | Covers all bases | Duplicated effort, two interfaces showing same data |

**Decision Rationale:** The Python GUI communicates with the PLC via the identical mechanism a physical HMI would use: reading and writing PLC tags through the PLCSim Advanced API. It is more capable because it integrates AI classification, trend detection, feature anomaly flagging, session statistics and operator controls in a single unified interface. A WinCC HMI would be introduced when transitioning the system to physical hardware.

**GUI Features Developed:**
- Live sensor display with animated position bars for both engines
- Colour-coded severity indicator (green/amber/red) with fault descriptions
- Class probability visualisation for all five fault types
- Fault trend detection with automatic severity escalation
- Feature anomaly flagging against training data distribution
- Session statistics tracking (average latency, confidence, fault rate)
- CSV audit logging of every classification
- Audio alerts on warning and critical faults
- Start/Stop monitoring controls

**Outcome:** GUI application operational and connected to PLCSim Advanced. Six new AI PLC tags added to TIA Portal (AI_Fault_Class, AI_Confidence, AI_System_Active, AI_Detection_Latency, AI_Fault_Detected, AI_Severity). Next step is adding operator control tabs for fault injection during live demonstration.

---

## TD-013: 7-Class XGBoost Model with Expanded Fault Types

**Date:** 16 February 2026

**Decision:** Replace the 5-class Random Forest classifier with a 7-class XGBoost model trained on 1,400 scenarios, adding Oscillating_Deployment and Stall_Deployment as new fault types.

**Context:** The 5-class Random Forest achieved 91.8% ± 2.3% accuracy across 1,000 scenarios but suffered persistent confusion between Asymmetric_Speed and Delayed_Deployment. Feature engineering improvements (V2 discriminative features, rule-based overrides) failed to resolve this overlap. Additionally, two physically important fault modes were missing from the system: oscillating actuator behaviour and mid-deployment stall conditions.

**Problem:**
- Random Forest could not reliably separate Asymmetric_Speed from Delayed_Deployment despite multiple feature engineering attempts
- The system only covered 5 fault types, missing oscillating and stall failure modes that occur in real thrust reverser systems
- Feature extraction contained a per-engine velocity masking bug that applied Engine 1's motion mask to Engine 2's data

**Solution:** Three changes were made simultaneously:

1. **Algorithm switch to XGBoost.** Gradient boosting builds trees sequentially, focusing on previously misclassified samples. On the existing 1,000-scenario dataset, XGBoost achieved 94.2% ± 0.8% accuracy compared to Random Forest's 91.8% ± 2.1%, resolving the Asymmetric/Delayed confusion more effectively.

2. **Two new fault types added (5 to 7 classes).** 400 additional scenarios were recorded (200 per new type) using dynamic mid-cycle PLC parameter manipulation via the State 40 continuous copy mechanism:

| Fault Type | Mechanism | Sensor Signature |
|------------|-----------|------------------|
| Oscillating_Deployment | Speed Parameter alternates between base speed and 0 during deployment | High velocity variance, multiple velocity sign changes, stop-start motion |
| Stall_Deployment | Speed Parameter set to 0 when position sensor reaches a randomised threshold (10-45mm) | Position freezes mid-travel, velocity drops to zero, low deployment ratio |

3. **Feature extraction corrected and expanded.** Per-engine velocity masks fixed to use each engine's own motion data. Five oscillation features (velocity variance, sign changes) and five stall features (stall ratio, max stall duration) added, bringing the total from 46 to 64 features.

**Originally Planned Fault Type Replaced:** Partial_Retraction was originally planned as the second new fault type. Testing revealed that retraction actuators in the NX MCD model cannot stop at specific mid-points and always return to the home position, making partial retraction physically impossible to simulate. Stall_Deployment was substituted as it produces a similarly distinctive sensor signature (incomplete deployment) through a different physical mechanism.

**PLC Modifications Required:**
- State 40 SCL updated to continuously copy Parameter tags to Control tags on every scan cycle (previously single-copy)
- Timer_2 extended from 5 seconds to 15 seconds to accommodate oscillating deployment cycles
- These changes enable Python to manipulate deployment behaviour mid-cycle by writing to Parameter tags

**Results (1,400 scenarios, 7 classes, 10-run robustness evaluation):**

| Metric | Result | Target |
|--------|--------|--------|
| Accuracy | 97.0% ± 0.7% | >90% |
| Recall | 97.0% ± 0.7% | >85% |
| Latency | <50ms | <500ms |

**Per-Class Accuracy:**

| Fault Type | Accuracy |
|------------|----------|
| Normal | 100% |
| Combined_Fault | 100% |
| Incomplete_Deployment | 100% |
| Stall_Deployment | 99.5% |
| Oscillating_Deployment | 98.8% |
| Delayed_Deployment | 94.0% |
| Asymmetric_Speed | 87.0% |

**Decision Rationale:** The combined changes produced a 5.2 percentage point accuracy improvement (91.8% to 97.0%) with substantially reduced variance (2.3% to 0.7%). Both new fault types achieved near-perfect classification immediately, confirming their sensor signatures are physically distinct from existing classes. The XGBoost algorithm handles the remaining Asymmetric/Delayed overlap more effectively than Random Forest, raising Asymmetric_Speed from the confusion levels seen in earlier testing to 87.0%.

**Outcome:** Model saved as `fault_classifier_best.pkl` and deployed in the real-time classification GUI (V9). The GUI was updated to display all 7 fault classes with corresponding severity levels, probability bars and fault descriptions.

---
