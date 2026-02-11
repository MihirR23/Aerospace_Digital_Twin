---
title: "250 Scenarios Captured: Automated Batch Recording Complete"
description: "The full training dataset is ready. 250 fault scenarios recorded automatically across five categories, with zero failures and 100Hz sampling."
date: 2026-02-11
categories: [Development]
tags: [python, automation, data-collection, machine-learning, plc]
pin: true
image:
  path: assets/img/validation_samples.png
  alt: Validation plots showing sample recordings across all five fault categories
---

## The Milestone

Today marked a significant milestone: the successful automated capture of 250 deployment scenarios across five fault categories. This dataset forms the foundation for training the Random Forest classifier that will detect asymmetric thrust reverser faults.

---

## The Timing Synchronisation Challenge

The core challenge was synchronising three independent systems: Python (control and recording), TIA Portal PLC simulation and NX MCD physics simulation.

### Recording Starting Mid-Deployment

Initial tests showed recordings starting at 13mm position instead of 0mm. Investigation revealed the PLC state machine was auto-advancing through steps on startup, reaching Step 20 (waiting for engine speed) before Python could begin recording.

**Solution:** Modified Step 0 to wait for an explicit `Cycle_Trigger` signal rather than immediately advancing. The PLC now remains in an idle state until Python explicitly initiates a deployment cycle.

### Excessive Idle Samples

After fixing the state machine, a new problem emerged. Python would trigger the cycle and start recording, but NX MCD simulation was not yet running. This resulted in 1,147 samples of static data before actual movement began.

**Solution:** Reversed the workflow. The user starts NX MCD simulation first, then presses ENTER in Python to trigger the cycle. This ensures the physics simulation is active before deployment begins. Test_Batch_006 achieved first position of 0.8mm with 490 clean samples.

### Connection Timeout After User Input

When waiting for user input, the PLCSim Advanced connection went stale, causing a "DoesNotExist" error when attempting to write tags.

**Solution:** Added `instance.UpdateTagList()` immediately after the input prompt to refresh the connection before writing parameters.

### Incomplete Deployment Detection Bug

The original end-detection logic checked if position exceeded 50mm to mark deployment complete. This failed for Incomplete_Deployment scenarios where the target position was 25-45mm, causing all such recordings to timeout.

**Solution:** Replaced with dynamic detection that tracks maximum position reached and detects retraction. This correctly handles all deployment positions, not just full 52mm deployments.

---

## Fault Scenario Design

The 250 scenarios were distributed equally across five fault categories, with randomised parameters to ensure dataset diversity:

| Fault Type | Count | Parameters |
|------------|-------|------------|
| Normal | 50 | 52.0mm at 20.8mm/s (both engines) |
| Asymmetric Speed | 50 | One engine 5-16mm/s, other at 20.8mm/s |
| Incomplete Deployment | 50 | Target position 20-45mm (one or both) |
| Delayed Deployment | 50 | Speed 3-10mm/s (one or both engines) |
| Combined Fault | 50 | Mixed position and speed anomalies |

Each fault scenario uses randomised values within defined ranges, ensuring the classifier learns to recognise fault patterns rather than memorising specific parameter combinations.

---

## Recording Results

The batch recording completed successfully with 100% capture rate:

| Metric | Result |
|--------|--------|
| Total Scenarios | 250 |
| Successful | 250 (100%) |
| Failed | 0 |
| Session Duration | 50 minutes |
| Sample Rate | 100Hz |

---

## Data Quality Validation

Post-recording validation confirmed distinct patterns across fault types:

| Fault Type | Avg Duration | Max Position Range |
|------------|--------------|-------------------|
| Normal | 7.9s | 52.0mm (consistent) |
| Asymmetric Speed | 10.1s | 52.0mm (longer cycle) |
| Incomplete Deployment | 10.4s | 21.8-52.0mm |
| Delayed Deployment | 10.9s | 28.9-52.0mm |
| Combined Fault | 10.5s | 25.2-51.0mm |

The validation plots demonstrate clear differentiation between fault types, with Normal deployments showing consistent fast cycles while fault scenarios exhibit characteristic slower ramps, reduced positions or asymmetric patterns.

![Velocity validation across fault types](/assets/img/validation_velocities.png){: .shadow }
*Velocity profiles showing distinct patterns between normal and fault scenarios.*

![All transcowl positions](/assets/img/validation_all_transcowls.png){: .shadow }
*Position data from all four transcowls across sample recordings.*

---

## Pause and Resume Capability

Given the 50-minute recording duration, a pause and resume feature was implemented. Progress is saved to a JSON file after each scenario, allowing the batch process to be interrupted with Ctrl+C and resumed later from the exact point of interruption.

---

## Output Structure

The recording system generates a structured dataset ready for machine learning:

```
recordings_batch/
├── labels.csv
├── Normal_001.csv
├── Normal_002.csv
├── ...
├── Combined_Fault_250.csv
├── validation_samples.png
└── progress.json
```

Each CSV contains 10 sensor channels captured at 100Hz: four transcowl position sensors, four transcowl velocity sensors and two engine velocity sensors.

---

## What's Next

With the training dataset complete, the next phase involves:

- Feature extraction from the time-series recordings
- Random Forest classifier training and validation
- Performance evaluation against project targets (greater than 90% accuracy, greater than 85% recall, less than 500ms latency)
- HMI development for real-time fault visualisation
