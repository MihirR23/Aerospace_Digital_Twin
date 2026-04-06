---
title: "Covering All Bases: The Updated Risk Assessment"
description: "The project risk assessment has been updated with five new physical safety risks and an expanded severity scale following the introduction of the Festo EduTrainer pneumatic station."
date: 2026-04-01
categories: [Project]
tags: [risk-assessment, pneumatics, festo, safety, physical-prototype]
pin: false
image:
  path: /assets/img/Risk Assessment Steps.png
  alt: Risk assessment process showing hazard identification and control measures
---

The original [risk assessment]({{ '/posts/by-the-book-official-risk-assessment/' | relative_url }}) covered simulation and software risks only. With the Festo EduTrainer pneumatic station now part of the project, the assessment needed updating to reflect genuine physical hazards.

The updated risk assessment is available for download: [Mihir's Updated Risk Assessment.xlsx]({{ "/assets/files/Mihir's Updated Risk Assessment.xlsx" | relative_url }})

## Updated Severity Scale

The original scale used project-impact labels which made sense for a simulation project. Working with compressed air and rotary actuators introduces real injury risk, so the scale now includes both injury and project-impact categories at each level:

| Rating | Label | Meaning |
|--------|-------|---------|
| 1 | Near Miss | Issue identified but no impact |
| 2 | First Aid / Minor Setback | Minor treatment needed or small delay less than 1 week |
| 3 | Minor Injury / Moderate Delay | Medical attention required or 1-2 week delay |
| 4 | Major Injury / Major Setback | Serious harm or significant rework and 2+ week delay |
| 5 | Fatality / Project Failure | Loss of life or unable to complete project |

## Five New Physical Station Risks

**Wiring and Commissioning** (Initial: 9, Controlled: 4) covers incorrect wiring causing solenoid valve damage or PLC output module failure. Each actuator was tested individually with simple deploy/retract code before running the full state machine and all wiring was checked against the handover document.

**Operating Rotary Actuators** (Initial: 12, Controlled: 4) is the highest-rated risk on the entire assessment. Rotary actuators under compressed air can cause pinch or crush injuries. Hands are kept clear during operation, air is isolated before any mechanical adjustments and flow restrictors reduce stroke speed.

**Adjusting Flow Restrictors and Sensors** (Initial: 9, Controlled: 2) addresses unexpected actuator movement during physical adjustment and sensor misalignment. The air supply is isolated and the PLC set to STOP before any physical work on the station.

**Compressed Air and Tubing** (Initial: 4, Controlled: 1) covers pressurised air release from disconnected tubing and noise exposure from pneumatic exhaust.

**Borrowed Equipment** (Initial: 6, Controlled: 2) addresses the responsibility of using WorldSkills equipment loaned by Mehmet Karamanoglu. An equipment inventory was documented in the handover notes and all components will be returned to their original configuration.

## Classifier Update

The classifier training rows have also been updated. The task names retain Random Forest as originally planned, but the control measures now reflect the pivot to XGBoost after evaluating multiple algorithms, the dataset expansion from 250 to 1,400 scenarios across 7 fault classes, and the 99.8% accuracy confirmed through 10-run robustness testing.

## Summary

The assessment now covers 15 risks, up from 10, with physical safety added as a new category. All risks are controlled to acceptable levels.
