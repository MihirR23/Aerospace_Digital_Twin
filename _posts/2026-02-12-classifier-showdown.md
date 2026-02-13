---
title: "Classifier Showdown: Random Forest vs Neural Network"
description: "Two machine learning classifiers compete for the role of primary fault detector. Honest statistical validation across 10 runs reveals the clear winner and a 1000-scenario dataset expansion begins."
date: 2026-02-12
categories: [Development]
tags: [random-forest, neural-network, machine-learning, fault-detection, data-collection]
pin: true
image:
  path: assets/img/model_evaluation_v2.png
  alt: Random Forest V2 evaluation showing confusion matrix and feature importance analysis
---

With 250 fault scenarios recorded, it was time to train and evaluate machine learning classifiers for detecting asymmetric thrust reverser deployment faults. This session involved developing two competing approaches, conducting honest statistical validation and making a critical decision about expanding the dataset.

## The Contenders

Two classifiers were developed to compete for the role of primary fault detector:

**Random Forest** is a traditional machine learning algorithm using an ensemble of 300 decision trees. It is known for stability, interpretability and strong performance on structured tabular data.

**Neural Network** is a Multi-Layer Perceptron with architecture [128, 64, 32] neurons, batch normalisation and dropout regularisation. It represents the deep learning approach with potential to learn complex patterns.

Both classifiers used identical input: 45 engineered features extracted from raw sensor data, ensuring a fair comparison.

## Feature Engineering

The 45 features were organised into four categories designed to capture different aspects of fault behaviour:

| Category | Features | Purpose |
|----------|----------|---------|
| Position | Maximum position, deployment completion flags, position differences | Detect incomplete deployment |
| Velocity | Average velocity, maximum velocity, velocity differences | Detect speed-related faults |
| Timing | Time to maximum position, deployment duration, time to 90% | Detect delayed deployment |
| Differential | Engine asymmetry scores, velocity ratios | Detect asymmetric faults |

## Honest Statistical Validation

Rather than reporting a single optimistic result, both classifiers were evaluated across 10 independent runs with different random seeds. This approach reveals true performance variance and provides conservative estimates.

```python
RANDOM_SEEDS = [42, 123, 456, 789, 101, 202, 303, 404, 505, 606]
for seed in RANDOM_SEEDS:
    result = run_single_experiment(X, y, label_encoder, seed)
    results.append(result)
```

This methodology exposed that while single runs achieved up to 98% accuracy, the realistic mean was 91.8% with some runs as low as 88%.

## Results Comparison

| Metric | Random Forest | Neural Network | Target | Winner |
|--------|---------------|----------------|--------|--------|
| Accuracy | 91.8% ± 2.3% | 88.8% ± 3.9% | >90% | RF |
| Recall | 91.8% ± 2.3% | 88.8% ± 3.9% | >85% | RF |
| Latency | 2.31ms | 4.36ms | <500ms | RF |
| Variance | ±2.3% (stable) | ±3.9% (variable) | Low | RF |

Random Forest achieved all three project targets. The Neural Network failed the accuracy target when using conservative estimates: mean minus one standard deviation gave 84.9%.

![Random Forest Initial Evaluation](/assets/img/model_evaluation.png)
_Initial Random Forest model showing confusion matrix and feature importance analysis_

![Random Forest V2 Evaluation](/assets/img/model_evaluation_v2.png)
_Improved Random Forest with additional features targeting Asymmetric vs Delayed confusion_

![Neural Network Evaluation](/assets/img/nn_robustness_evaluation.png)
_Neural Network robustness evaluation showing accuracy distribution and per-class performance across 10 runs_

## Per-Class Performance

Both models exhibited the same pattern of strengths and weaknesses:

| Fault Type | Random Forest | Neural Network |
|------------|---------------|----------------|
| Normal | 100% | 100% |
| Incomplete_Deployment | 100% | 100% |
| Combined_Fault | 98% ± 4% | 92% ± 8.7% |
| Asymmetric_Speed | 82% ± 7.5% | 81% ± 14.5% |
| Delayed_Deployment | 79% ± 10.4% | 71% ± 7% |

The weak performance on Asymmetric_Speed and Delayed_Deployment is not a model limitation but a data characteristic: both fault types involve reduced velocities, creating overlapping feature patterns at edge cases.

## Decision: Random Forest Wins

Random Forest was selected as the primary classifier based on four factors: a 3% accuracy improvement over the Neural Network, lower variance across runs producing more stable and reproducible results, a 2x inference speed advantage (2.31ms vs 4.36ms), and feature importance analysis that directly supports technical reporting.

This aligns with machine learning literature: traditional algorithms often outperform deep learning on smaller structured datasets.

## Why Expand to 1000 Scenarios?

Despite meeting project targets, several limitations motivated expanding the dataset.

**Limited Test Set Size.** With 250 scenarios and an 80/20 split, the test set contains only 50 samples. A single misclassification changes accuracy by 2%, making results sensitive to random variation. With 1000 scenarios, the test set grows to 200 samples and a single error impacts accuracy by just 0.5%.

**Weak Class Performance.** Asymmetric_Speed (82%) and Delayed_Deployment (79%) may improve with more training variety. With only 10 test samples per class, it was unclear whether this was a data limitation or genuine feature overlap.

**Neural Network Data Requirements.** Deep learning models typically require larger datasets. The Neural Network's higher variance suggested it was undertrained. With 800 training samples, the comparison becomes fairer.

**Parameter Coverage.** More scenarios with unique randomised values ensure comprehensive coverage of the fault parameter space.

## 1000-Scenario Recording System

{% include embed/video.html src='/assets/video/Deployment Scenarios Case Structure.mp4' title='PLC State Machine Case Structure' %}

The batch recorder was designed with three principles: unique values using 0.01mm/s increments to ensure no duplicate parameters, strict alternation between E1 and E2 faults for balanced engine representation and a fixed baseline where Normal scenarios always deploy to 52mm at 20.8mm/s.

| Fault Type | Count | Randomised Parameters |
|------------|-------|----------------------|
| Normal | 200 | Fixed: 52mm @ 20.8mm/s |
| Asymmetric_Speed | 200 | Slow speed: 5.0-16.0mm/s |
| Incomplete_Deployment | 200 | Position: 20.0-45.0mm |
| Delayed_Deployment | 200 | Speed: 3.0-10.0mm/s |
| Combined_Fault | 200 | Position + Speed variations |

{% include embed/video.html src='/assets/video/Simulating Deployment Scenarios.mp4' title='Simulating Deployment Scenarios' %}

{% include embed/video.html src='/assets/video/Batch Recording Deployment Scenarios.mp4' title='Batch Recording in Progress' %}

## Recording Progress

The session completed 661 of 1000 scenarios before pausing:

| Category | Recorded | Status |
|----------|----------|--------|
| Normal | 200/200 | Complete |
| Asymmetric_Speed | 200/200 | Complete |
| Incomplete_Deployment | 200/200 | Complete |
| Delayed_Deployment | 61/200 | In Progress |
| Combined_Fault | 0/200 | Pending |

Recording will resume to complete the remaining 339 scenarios.

## Reflection

This session reinforced the importance of honest evaluation methodology. Single-run results can be misleading and the 10-run approach revealed the true performance distribution. The decision to expand the dataset, while time-consuming, demonstrates methodological rigour that strengthens the project's academic integrity.

The identified confusion between Asymmetric_Speed and Delayed_Deployment represents a genuine engineering challenge where fault symptoms overlap. Rather than artificially widening parameter gaps, this has been documented as a known limitation with a clear path for future improvement through time-series analysis.

## Next Steps

1. Complete the 1000-scenario recording
2. Retrain both classifiers on the larger dataset
3. Compare 250-scenario vs 1000-scenario performance
4. Integrate the best model with the HMI system
