---
title: "By the Book: The Official Risk Assessment"
description: "The project risk assessment has been reformatted to align with the PDE3823 template requirements, featuring revised severity scales appropriate for simulation projects."
date: 2026-02-12
categories: [Project]
tags: [risk-assessment, planning, project-management, documentation]
pin: false
image:
  path: assets/img/Risk Assessment Matrix.jpg
  alt: Risk assessment matrix showing likelihood and severity scales
---

## Overview

Following feedback on the university's risk assessment requirements, I have revised the risk assessment originally documented on [5th February]({{ '/posts/planning-for-failure-risk-assessment/' | relative_url }}) to align with the official PDE3823 template format.

The complete risk assessment is available for download: [PDE3823_Risk_Assessment_Mihir_M00955111.xlsx]({{ '/assets/files/PDE3823_Risk_Assessment_Mihir_M00955111.xlsx' | relative_url }})

## What Changed

The original risk assessment identified the same core risks but used a narrative format. The revised version now includes:

**Structured Template Format**

Each risk is now documented with the required fields: Task/Activity, Hazard, Who Might Be Harmed, Risk Likelihood, Risk Severity, Risk Level, Control Measures and the residual risk ratings after controls are applied.

**Revised Severity Scale**

The standard template uses injury-based severity labels (Minor Injury, Major Injury, Death) which are not applicable to a simulation and software project. I adapted the scale to reflect project impact instead:

| Rating | Label | Meaning |
|--------|-------|---------|
| 1 | Near Miss | Issue identified but no impact |
| 2 | Minor Setback | Small delay, less than 1 week |
| 3 | Moderate Delay | 1-2 week delay or partial rework |
| 4 | Major Setback | Significant rework or 2+ week delay |
| 5 | Project Failure | Unable to complete project |

**Numerical Risk Scoring**

Risk levels are now calculated as Likelihood × Severity, with colour coding to indicate High (9-25), Medium (5-8) and Low (1-4) risk levels both before and after control measures.

## Summary

The assessment covers 10 risks across technical, timeline, resource and ethical categories. All identified risks have been reduced to acceptable levels (Low or Medium) through the control measures already implemented throughout the project. The highest initial risk was Project Timeline Delays at level 12, now controlled to level 4 through the schedule buffer created by pre-purchasing the CAD model.
