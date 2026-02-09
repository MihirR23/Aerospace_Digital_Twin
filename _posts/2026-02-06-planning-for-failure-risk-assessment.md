---
title: "Planning for Failure: A Comprehensive Risk Assessment"
description: "Thirteen risks identified across five categories, each with mitigation strategies and contingency plans. Here is how the project is structured to handle things going wrong."
date: 2026-02-06
categories: [Project]
tags: [risk-assessment, planning, project-management]
pin: false
image:
  path: assets/img/Risk Assessment.jpg
  alt: Risk assessment matrix for the thrust reverser monitoring project
---

## Why Risk Assessment Matters

A capstone project with four integrated technical domains (CAD, control systems, communication protocols, machine learning) has plenty of opportunities for things to go wrong. Rather than hoping for the best, this risk assessment identifies potential obstacles upfront and defines what to do if they materialise.

Thirteen risks have been identified across five categories: technical, timeline, resource, financial and ethical.

---

## Technical Risks

### Pre-Purchased Model Integration

**Likelihood:** Low | **Impact:** Medium

The Trent 900 model from Cults3D may require modification or contain errors. This risk has been largely mitigated by purchasing the model early and verifying compatibility. Bob Wiley provided STEP assembly files, which eliminated the original concern about file format issues.

**Contingency:** If the model proves unusable, fall back to a simplified scratch-built model focusing only on the thrust reverser section.

---

### Thrust Reverser Component Design

**Likelihood:** Medium | **Impact:** Medium

Creating accurate translating cowls, cascade vanes, blocker doors and actuator assemblies requires precise geometric relationships.

**Mitigation:** Base dimensions on published specifications, use reference images from maintenance manuals and prioritize functional accuracy over aesthetic perfection.

**Contingency:** If modeling exceeds 2 weeks, simplify geometries to basic shapes that still demonstrate correct motion paths.

---

### Motion Simulation Convergence

**Likelihood:** Medium | **Impact:** Medium

Physics-based simulation may fail to converge due to improper constraints or conflicting joint definitions.

**Mitigation:** Start with simplified physics, gradually add complexity and validate against known deployment times (2-3 seconds typical). My advisor-recommended analog control architecture specifically helps avoid convergence issues.

**Contingency:** Switch to kinematic motion (position-driven) rather than dynamic simulation (force-driven). This still generates valid position/velocity data for AI training.

---

### Insufficient AI Training Data

**Likelihood:** Low | **Impact:** High

May not generate enough diverse scenarios (target: 150+) to train a robust classifier.

**Mitigation:** Use parametric simulation to auto-generate variations. Systematically vary parameters: actuator pressure, timing offset, friction coefficients. Apply data augmentation techniques.

**Contingency:** Switch to binary classification (normal vs fault) rather than multi-class (5 fault types). This requires less training data while still demonstrating AI capability.

---

### AI Model Underperformance

**Likelihood:** Medium | **Impact:** Medium

The classifier fails to achieve 90% accuracy target.

**Mitigation:** Implement multiple algorithms (Random Forest, SVM, Decision Trees). Perform systematic hyperparameter tuning. Engineer high-quality features.

**Contingency:** Document why accuracy fell short and present the rule-based system as "Version 1.0" with ML as a future enhancement.

---

## Timeline Risks

### Falling Behind Schedule

**Likelihood:** Low-Medium | **Impact:** High

Accumulated delays jeopardize final deliverables.

**Mitigation:** The pre-purchased engine model saves 2-3 weeks upfront, creating a significant buffer. Weekly progress tracking against the Gantt chart. Front-load work where possible.

**Minimum Viable Deliverables:**
- Simplified thrust reverser components (6 parts vs 10)
- 100 simulations (vs 150 target)
- Single ML algorithm (vs three comparisons)
- Rule-based fault detection if ML proves problematic

**Contingency:** If more than 1 week behind by Week 6, immediately descope to minimum viable deliverables.

---

## Resource Risks

### Software Access Issues

**Likelihood:** Low | **Impact:** High

Loss of Siemens NX license or hardware failure.

**Mitigation:** Verify university license access early. Maintain regular backups across multiple locations. University lab computers available as backup. Python ecosystem is completely free.

**Contingency:** Use university lab computers exclusively or pivot to open-source alternatives for basic geometry work.

---

### Skill Gaps

**Likelihood:** Low-Medium | **Impact:** Medium

Insufficient knowledge in NX Motion simulation or advanced ML techniques.

**Mitigation:** Allocate pre-project time for tutorials. Leverage online resources and lecturer consultations. Start simple, add complexity incrementally.

**Contingency:** Document the learning process and focus on demonstrating engineering problem-solving rather than perfect implementation.

---

## Financial Risks

### Model Purchase Cost

**Likelihood:** N/A (Already Occurred) | **Impact:** Low

The Trent 900 model cost £10.

**Strategic Justification:** This investment eliminated 20-30 hours of fan blade and nacelle modeling. At £10/hour for engineering time, that represents £200-300 in time savings. A 20-30x return on investment.

---

## Safety and Ethics Risks

### Intellectual Property and Attribution

**Likelihood:** Low | **Impact:** Low

Improper use or attribution of purchased model.

**Mitigation:** Review license terms (educational use permitted). Properly attribute the original creator in project documentation. Thrust reverser components are 100% original work.

---

### Data and Ethical Issues

**Likelihood:** Very Low | **Impact:** Low

All data is synthetic (computer-generated). No human participants, personal data or confidential information. Standard university project approval is sufficient.

---

## Risk Matrix Summary

| Risk | Likelihood | Impact | Severity |
|------|------------|--------|----------|
| Pre-Purchased Model Issues | Low | Medium | Low-Med |
| Thrust Reverser Components | Medium | Medium | Medium |
| Simulation Convergence | Medium | Medium | Medium |
| Insufficient AI Data | Low | High | Medium |
| AI Underperformance | Medium | Medium | Medium |
| Schedule Delays | Low-Med | High | Medium |
| Software Access | Low | High | Medium |
| Skill Gaps | Low-Med | Medium | Medium |
| Model Purchase Cost | N/A | Low | Low |
| IP/Attribution | Low | Low | Low |
| Ethics/Data | Very Low | Low | Low |

---

## Risk Management Philosophy

The approach follows three pillars:

**Strategic Investment:** The £10 model purchase reduced technical risk and nearly doubled the schedule buffer. Minimal cost for substantial benefit.

**Layered Contingencies:** Each risk has multiple fallback positions, from minor simplification to minimum viable solutions.

**Continuous Monitoring:** Weekly checkpoints with predefined triggers. Green means on track. Amber (more than 3 days behind) means adjust allocation. Red (more than 1 week behind by Week 6) means activate contingency plans.

---

## Conclusion

This risk assessment transforms the project from "hoping nothing goes wrong" to "knowing what to do when something does." With 5 weeks of schedule buffer, clearly defined contingencies and systematic monitoring, the project is structured to handle obstacles without derailing the final deliverables.
