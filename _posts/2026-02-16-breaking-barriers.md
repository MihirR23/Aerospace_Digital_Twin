---
title: "Breaking Barriers: XGBoost and Two New Fault Types Transform the System"
description: "After feature engineering fails to fix classification confusion, an algorithm switch to XGBoost, two new fault types, a critical bug fix and iterative GUI rebuilds push accuracy to 97.0%."
date: 2026-02-16
categories: [Development]
tags: [xgboost, machine-learning, fault-detection, gui, plc, feature-engineering, troubleshooting]
pin: true
image:
  path: assets/img/Deployment Monitoring.png
  alt: Real-time AI fault detection GUI showing EICAS display with live fault classification
---

This session saw the fault detection system undergo its most significant transformation yet. After feature engineering failed to fix a persistent classification weakness, an algorithm switch to XGBoost delivered an immediate improvement. Two new fault types were added (with one planned type abandoned due to physics limitations), a critical per-engine velocity masking bug was discovered and corrected and the GUI was rebuilt through multiple iterations to support the expanded 7-class system. The session was defined by problems encountered, solutions found and honest reporting of what worked and what did not.

## The Asymmetric/Delayed Problem

The 5-class Random Forest classifier had a persistent weakness: Asymmetric_Speed and Delayed_Deployment were being confused with each other. Two approaches were attempted to fix this without changing the algorithm.

**Approach 1: Enhanced Feature Engineering (V2 Features).** New discriminative features were added, including `only_one_slow` and `both_slow_similar`, designed to explicitly distinguish one-engine-slow from both-engines-slow patterns. The result was 91.7% accuracy, essentially identical to V1 (91.9%). The new features showed almost no separation between the two classes (0.43 vs 0.40 for `only_one_slow`), confirming the problem was not solvable through feature engineering alone.

**Approach 2: Rule-Based Override.** A confidence-gated post-classification rule was added to override low-confidence predictions using physical thresholds. The result was worse: accuracy dropped to 90.9%. The override was second-guessing predictions the Random Forest had actually gotten correct, actively making things worse.

Both approaches failed. The Asymmetric/Delayed confusion was not a feature problem or a rules problem. It was a fundamental limitation of how Random Forest handles overlapping decision boundaries.

## The Algorithm Switch: XGBoost

XGBoost (Extreme Gradient Boosting) was selected as an alternative because gradient boosting builds trees sequentially, with each new tree focusing on the samples the previous trees misclassified. This targeted approach handles overlapping classes more effectively than Random Forest's parallel ensemble.

On the same 1,000-scenario dataset with identical features, XGBoost achieved 94.2% ± 0.8% accuracy compared to Random Forest's 91.8% ± 2.1%. The Asymmetric/Delayed confusion improved and overall variance dropped significantly. No re-recording was required: just a better algorithm applied to existing data.

## The Velocity Masking Bug

During live testing of the XGBoost model, a critical feature extraction bug was discovered. The Asymmetric Speed preset (E1 at 8mm/s, E2 at 20.8mm/s) was being classified as Delayed_Deployment with 92% confidence. The XAI panel revealed why: both E1 AVG VEL and MAX AVG VEL showed 8.00mm/s. If E2 was truly deploying at 20.8mm/s, the maximum average velocity should have reflected that.

The root cause was in the feature extraction code:

```python
dm = e1lv > 0.5  # Only E1 left velocity used as motion mask
features['e2_left_avg_vel'] = e2lv[dm].mean()  # E2 averaged during E1's window
```

All four engine velocity features were being calculated using Engine 1's motion mask. When E1 deployed slowly (8mm/s over approximately 6.5 seconds) and E2 deployed quickly (20.8mm/s, finishing in approximately 2.5 seconds), E2's velocity was averaged over E1's longer movement window. Since E2 had already stopped by the time E1 was halfway through its deployment, the averaged velocity was diluted to approximately the same as E1's. To the model, both engines appeared equally slow, which is precisely the Delayed_Deployment signature.

The fix was straightforward: per-engine velocity masks were implemented so each engine's features are calculated using its own movement window. This was applied to both the batch feature extraction pipeline and the real-time GUI and all 1,000 existing recordings were re-extracted with corrected features without needing to re-record anything.

## Expanding to 7 Fault Classes

With the velocity mask fixed and XGBoost performing well, two new physically important fault types were added to the system.

**Oscillating_Deployment** simulates hydraulic pressure fluctuations or valve flutter. During deployment, the speed Parameter tag alternates between the base speed and zero, creating a distinctive stop-start motion pattern with high velocity variance and multiple velocity sign changes. This required modifying the PLC State 40 SCL code to continuously copy Parameter tags to Control tags on every scan cycle (previously a single copy), enabling Python to manipulate deployment behaviour mid-cycle by writing to Parameter tags while the deployment is active.

**The Partial_Retraction Problem.** The original second fault type was Partial_Retraction, where a transcowl would deploy and then retract to a mid-point. However, testing revealed that retraction actuators in the NX MCD model cannot stop at specific mid-points. They always return to the home position (0mm). This is a physics constraint of the simulation, not a software limitation. Partial retraction was therefore physically impossible to simulate in the current digital twin.

**Stall_Deployment** was substituted as the replacement. Instead of retracting to a mid-point, the transcowl deploys normally and then its speed drops to zero mid-travel, simulating an actuator failure, hydraulic lock or mechanical jam. The position freezes at whatever point it had reached. This produces a similarly distinctive sensor signature (incomplete deployment with zero velocity) through a different physical mechanism.

Timer_2 was extended from 5 seconds to 15 seconds to accommodate the longer oscillating deployment cycles. 400 new scenarios were recorded (200 per fault type) using the batch recorder with dynamic mid-cycle PLC parameter control.

## Training Results: 97.0% Accuracy

The combined 1,400-scenario dataset (7 classes, 200 per class) was trained with XGBoost and validated through the standard 10-run robustness evaluation.

| Metric | Result | Target |
|--------|--------|--------|
| Accuracy | 97.0% ± 0.7% | >90% |
| Recall | 97.0% ± 0.7% | >85% |
| Latency | <50ms | <500ms |

Per-class accuracy:

| Fault Type | Accuracy |
|------------|----------|
| Normal | 100% |
| Combined_Fault | 100% |
| Incomplete_Deployment | 100% |
| Stall_Deployment | 99.5% |
| Oscillating_Deployment | 98.8% |
| Delayed_Deployment | 94.0% |
| Asymmetric_Speed | 87.0% |

Both new fault types achieved near-perfect classification immediately, confirming their sensor signatures are physically distinct from existing classes. The velocity mask fix helped Asymmetric_Speed recover from the confusion seen in earlier testing to 87.0%, though it remains the weakest class due to genuine physical overlap with Delayed_Deployment at boundary parameter values.

The progression tells the full story:

| Stage | Accuracy |
|-------|----------|
| 250 scenarios, 5 classes (Random Forest) | 91.8% ± 2.3% |
| 1,000 scenarios, 5 classes (Random Forest) | 91.8% ± 2.1% |
| 1,000 scenarios, 5 classes (XGBoost) | 94.2% ± 0.8% |
| 1,400 scenarios, 7 classes (XGBoost) | 97.0% ± 0.7% |

## Rebuilding the GUI: V7 to V9

The real-time classification GUI required significant rework to support the expanded 7-class system. This was not a single update but an iterative process with multiple issues discovered and resolved.

**V7: Feature Mismatch Crash.** The GUI's built-in feature extraction was still producing the old 46-feature set (V1 names like `e1_left_avg_vel`), while the retrained model expected 64 features with V3 names (including oscillation and stall features). The result was an immediate crash on every classification attempt, displaying `ERR: "['e1_speed_deficit', 'e2..."` in the status bar with the alert log remaining empty. The fix required completely replacing the GUI's `extract_features()` function with the training pipeline's version, adding oscillation features (velocity variance, sign changes), stall features (stall ratio, max stall duration) and the corrected per-engine velocity masks.

**V7: Usability Overhaul.** With the feature mismatch resolved, the GUI was updated for examiner accessibility. Font sizes were increased throughout, a plain-English guide bar was added with state-aware instructions ("PRESS START MONITORING TO BEGIN" changing to "MONITORING ACTIVE" and then "INJECT A FAULT TO TEST DETECTION"), and an Explainable AI panel was added showing the top 5 decision factors with human-readable names instead of raw feature codes.

**V7: Dynamic Fault Injection.** Oscillating and Stall preset buttons were added to the Fault Injection tab. These required spawning background threads to modify PLC Parameter tags mid-cycle, matching how the batch recorder originally generated these fault types. Custom fault sliders were also added for position and speed parameters, along with dedicated dynamic fault buttons for oscillating and stall behaviour.

**V8: Text Visibility.** User testing revealed that the grey helper text (#444444) was nearly invisible against the black ECAM background. All dim colours were brightened from #444444 to #888888, and critical guidance text was further brightened to #aaaaaa with increased font sizes.

**V8: Aircraft Alert Sounds.** The simple beep tones (800Hz, 1200Hz) were replaced with programmatically generated Airbus-style aural alerts. The caution alert uses two ascending tones (C5 at 523Hz followed by E5 at 659Hz) creating a clean attention-getting chime. The warning alert uses a rapid high/low warble (1800Hz alternating with 1400Hz across 3 cycles) replicating the distinctive urgent sound from real cockpit master warning systems. Both are generated as WAV files using Python's wave and struct modules with sine wave synthesis and fade envelopes to prevent audio clicks.

**V9: Bottom Bar Layout Fix.** The START/STOP MONITORING buttons on the Fault Injection tab were compressed to thin horizontal bars with no visible text. The root cause was tkinter's pack geometry: the tabview was packed with `expand=True` before the bottom bar, so the tall Fault Injection tab content consumed all available vertical space. The fix reversed the pack order so the bottom bar claims its 55px first, then the tabview fills the remaining space.

![EICAS Display Tab](/assets/img/Deployment Monitoring.png)
_EICAS Display tab showing live fault classification with severity banner and probability bars_

![Deployment Command Tab](/assets/img/Deployment Command.png)
_Deployment Command tab showing system information and last deployment result_

![Fault Injection Tab](/assets/img/Fault Injection.png)
_Fault Injection tab with preset faults, custom parameters, and dynamic fault buttons_

## Live Testing: Combined Fault Behaviour

A live test of the Combined Fault preset (E1=52mm at 8.0mm/s, E2=35mm at 20.8mm/s) revealed an interesting classification behaviour. The first cycle was classified as Delayed_Deployment at 57% confidence, and the second cycle as Stall_Deployment at 68% confidence, both triggering LOW CONFIDENCE warnings.

This is physically correct rather than a misclassification. The XAI panel showed E2_STALL at 0.86 and MAX_STALL at 0.86, meaning E2's position at 35mm with velocity approaching zero created a strong stall signature that dominated the combined features. The E1_SPD_DEF (speed deficit) of 12.80 was present but the stall features outweighed it. The low confidence (57% and 68% against the 70% threshold) reflects genuine uncertainty due to overlap between Combined, Stall, and Incomplete classes.

This is the system being honestly uncertain rather than confidently wrong, which is exactly the behaviour a safety-critical system should exhibit. The session demonstrated 100% fault rate (neither cycle classified as Normal), 32ms average latency, and the probability bars correctly showed STALL as highest with COMBINED and OSCILLATING also visible.

## Reflection

This session demonstrated that algorithm selection and dataset composition both matter more than feature engineering alone. The failed V2 features and rule-based overrides were valuable negative results that justified the switch to XGBoost. The velocity masking bug was a subtle but critical issue that was only discovered through live testing and XAI inspection, highlighting the importance of verifying that feature extraction matches between training and deployment pipelines.

The Partial_Retraction to Stall_Deployment substitution was a pragmatic engineering decision driven by a genuine physics limitation of the digital twin. Rather than forcing a simulation that could not physically represent the fault, a different fault type was selected that produces an equally distinctive sensor signature. This is documented honestly rather than hidden.

The GUI iterations from V7 through V9 illustrate that deployment is not a single step but an iterative process of testing, discovering problems, and fixing them. Each version addressed real issues found through user testing rather than theoretical concerns.

## Next Steps

1. Apply probability calibration to the XGBoost model to improve live classification confidence scores, addressing the low prediction probabilities observed during Combined Fault and Delayed Deployment testing
2. Validate the calibrated model through live GUI testing across all 7 fault presets, comparing pre- and post-calibration confidence levels
3. If calibration alone is insufficient, perform hyperparameter tuning to sharpen decision boundaries for the overlapping classes
