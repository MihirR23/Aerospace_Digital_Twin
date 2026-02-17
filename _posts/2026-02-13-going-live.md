---
title: "Going Live: From Training Data to Real-Time Fault Detection"
description: "The 1000-scenario dataset completes classifier training, a four-way performance comparison confirms Random Forest as the winner and a real-time AI fault detection GUI brings the system to life."
date: 2026-02-13
categories: [Development]
tags: [random-forest, neural-network, machine-learning, fault-detection, gui, real-time, plcsim-advanced]
pin: false
image:
  path: assets/img/AI Monitoring GUI.png
  alt: Real-time AI fault detection GUI monitoring thrust reverser deployment
---

The 1000-scenario dataset is complete, both classifiers have been retrained, and the project has crossed a significant milestone: the transition from offline model training to a live, real-time fault detection system. This post covers the full four-way classifier comparison, the development of an AI monitoring GUI and the engineering decision to use Python over WinCC for the virtual environment.

## 1000-Scenario Random Forest

The Random Forest classifier was retrained on the expanded 1000-scenario dataset and evaluated across 10 independent runs.

| Metric | 250 Scenarios | 1000 Scenarios |
|--------|---------------|----------------|
| Accuracy | 91.8% ± 2.3% | 91.8% ± 2.1% |
| Recall | 91.8% ± 2.3% | 91.8% ± 2.1% |
| Latency | 2.31ms | 35.98ms |

The overall accuracy was identical, but the per-class results told a more interesting story:

| Fault Type | 250 Scenarios | 1000 Scenarios | Change |
|------------|---------------|----------------|--------|
| Normal | 100% | 100% | 0% |
| Incomplete_Deployment | 100% | 99.8% ± 0.8% | ~0% |
| Combined_Fault | 98% ± 4% | 100% ± 0% | +2% |
| Asymmetric_Speed | 82% ± 7.5% | 72% ± 8.8% | -10% |
| Delayed_Deployment | 79% ± 10.4% | 87% ± 5.1% | +8% |

Asymmetric_Speed dropped by 10 percentage points while Delayed_Deployment improved by 8. The confusion matrix confirmed bidirectional misclassification between these two classes exclusively: 17.5% of Asymmetric_Speed samples were misclassified as Delayed_Deployment and 12.5% in the reverse direction.

![Random Forest 1000-Scenario Evaluation](/assets/img/rf_1000_robustness_evaluation.png)
_Random Forest 1000-scenario robustness evaluation showing accuracy distribution, per-class performance, confusion matrix, and feature importances_

![Random Forest 1000-Scenario Confusion Matrix](/assets/img/rf_1000_confusion_matrix.png)
_Best-run confusion matrix showing bidirectional misclassification between Asymmetric_Speed and Delayed_Deployment_

## 1000-Scenario Neural Network

The Multi-Layer Perceptron (128-64-32 architecture) was also retrained on the 1000-scenario dataset with 3x data augmentation.

| Metric | 250 Scenarios | 1000 Scenarios |
|--------|---------------|----------------|
| Accuracy | 88.8% ± 3.9% | 89.7% ± 1.9% |

The Neural Network showed the same Asymmetric_Speed versus Delayed_Deployment confusion pattern, with 32.5% of Asymmetric_Speed samples misclassified as Delayed_Deployment in the best run. The significant improvement was in variance: dropping from ±3.9% to ±1.9%, confirming that the 250-scenario dataset was borderline insufficient for the Neural Network.

![Neural Network 1000-Scenario Evaluation](/assets/img/nn_1000_robustness_evaluation.png)
_Neural Network 1000-scenario robustness evaluation with training history curve_

![Neural Network 1000-Scenario Confusion Matrix](/assets/img/nn_1000_confusion_matrix.png)
_Neural Network best-run confusion matrix_

## Four-Way Comparison

With both classifiers trained on both dataset sizes, the complete picture emerged:

| Dataset | Random Forest | Neural Network |
|---------|---------------|----------------|
| 250 scenarios | 91.8% ± 2.3% | 88.8% ± 3.9% |
| 1000 scenarios | 91.8% ± 2.1% | 89.7% ± 1.9% |

Random Forest won across all conditions. The key finding was that a larger dataset improved stability (variance) rather than raw accuracy. Both models converged on the same weak points, confirming that the Asymmetric_Speed and Delayed_Deployment confusion is a genuine engineering characteristic of the fault types rather than a model limitation. Both involve reduced actuator velocities, creating overlapping feature patterns that engineered features alone cannot fully separate.

Despite the identical mean accuracy, the 1000-scenario model was selected for deployment. With 40 test samples per class instead of 10, each misclassification shifts accuracy by 0.5% rather than 2%, making the evaluation far more statistically reliable.

## Real-Time AI Fault Detection GUI

With the classifier finalised, the focus shifted to deployment. A Python GUI application was developed using tkinter to provide real-time monitoring and fault detection.

![AI Monitoring GUI](/assets/img/AI Monitoring GUI.png)
_Real-time AI fault detection GUI with live sensor monitoring, fault classification, and severity indicators_

The system architecture follows the complete mechatronics loop: NX MCD simulates the physics, PLCSim Advanced runs the PLC control logic, the Python GUI reads sensor data passively and classifies faults, then writes AI results back to PLC tags for operator visibility.

Six new AI-specific PLC tags were added to TIA Portal to support the integration:

| Tag | Type | Purpose |
|-----|------|---------|
| AI_Fault_Class | Int | Classified fault type |
| AI_Confidence | Real | Classification confidence percentage |
| AI_System_Active | Bool | AI monitoring status |
| AI_Detection_Latency | Real | Time taken for classification |
| AI_Fault_Detected | Bool | Fault present flag |
| AI_Severity | Int | Severity level (Normal/Warning/Critical) |

The GUI provides live sensor display with animated position bars for both engines, a colour-coded severity indicator with fault descriptions, class probability visualisation across all five fault types, fault trend detection with automatic severity escalation, feature anomaly flagging against training data distributions, session statistics tracking, CSV audit logging of every classification and audio alerts on warning and critical faults.

## Interface Decision: Python GUI vs WinCC HMI

The original project plan included developing a WinCC HMI in TIA Portal. However, since the entire system operates in a virtual environment using PLCSim Advanced rather than physical hardware, a Python GUI communicates with the PLC via the identical mechanism that a physical HMI would use: reading and writing PLC tags through the PLCSim Advanced API.

The Python GUI was chosen over WinCC because it integrates AI classification, trend detection, feature anomaly flagging, session statistics and operator controls in a single unified interface. A WinCC HMI cannot natively incorporate machine learning inference or the advanced monitoring features the project requires. This decision is documented in TD-012, with the note that WinCC would be introduced when transitioning the system to physical hardware with a real PLC and HMI panel.

## Reflection

The identical overall accuracy between 250 and 1000 scenarios was unexpected but informative. It suggests the Random Forest had already learned the core decision boundaries with 250 samples and additional data refined the boundary rather than shifting it. The per-class shifts provided genuine engineering insight: as the model saw more examples of both Asymmetric_Speed and Delayed_Deployment, it became clearer that these fault types share fundamental characteristics that static features cannot fully separate.

Moving from offline training to a real-time GUI application represents the transition from development to deployment. The system now demonstrates the complete mechatronics integration loop: physics simulation in NX, PLC control in TIA Portal, AI classification in Python and operator monitoring through the GUI.

## Next Steps

1. Add operator control tabs to the GUI (Normal Operation and Test/Demo mode)
2. Enable fault injection from the GUI for live demonstration
3. Record demonstration video of the integrated system
4. Begin technical report writing
