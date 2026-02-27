---
title: "Polish and Precision: GUI Tweaks and Multi-Fault Fix"
description: "A short session of interface refinements, separating System Overview panels, fixing the blank space bug and correcting the multi-fault label threshold."
date: 2026-02-26
categories: [Development]
tags: [gui, pyqt5, bug-fix, xgboost]
pin: false
image:
  path: assets/img/Fault Status Tweak.png
  alt: EICAS display showing clean fault classification with corrected multi-fault threshold
---

## System Overview Panel Separation

The System Overview tab originally displayed the Quick Test Guide and Monitored Sensors list inside a single shared frame. This made the tab feel cluttered and made it harder to visually distinguish between the operational guidance on the left and the sensor reference on the right.

The fix was straightforward: replace the single `ecam_frame()` container with two independent bordered panels, each with its own title and equal stretch. The Quick Test Guide retains its seven numbered steps for new operators, while the Monitored Sensors panel lists all eight sensor channels (E1/E2, LEFT/RIGHT, POS/VEL) with their units. Both panels now have consistent padding and sit side-by-side at equal width.

## System Overview Blank Space Fix

After separating the panels, a persistent vertical gap appeared between the tab bar and the first line of content. This was visible on the System Overview tab but not on EICAS, which made it particularly frustrating to debug.

Several attempts at CSS-level fixes (adjusting `QTabWidget::pane` padding, `QStackedWidget` borders and widget margins) had no visible effect. The root cause turned out to be a layout distribution issue: the EICAS tab avoids the gap because its main content widget uses `stretch=1`, which absorbs all extra vertical space and pins content flush to the top. The Overview tab had no stretched widget, so Qt's layout engine distributed the extra space evenly, pushing the subtitle label down from the tab bar.

The solution was twofold. First, removing a `setStyleSheet()` call that had been added in a previous attempt. In Qt, setting a stylesheet on a plain `QWidget` activates the CSS box model, which paradoxically added padding instead of removing it. Second, wrapping the bottom row (Detection Pipeline and Confidence Interpretation) in a `QWidget` with `stretch=1`, so it expands to fill remaining vertical space. This mirrors the EICAS pattern and eliminates both the top gap and a bottom gap that appeared when `AlignTop` was tried as an intermediate fix.

## Multi-Fault Label Threshold Fix

The Trend Detector component tracks fault classifications across cycles to identify recurring patterns and escalating issues. One of its alerts, "MULTI-FAULT: X TYPES", was triggering incorrectly. For example, testing an Asymmetric Speed fault followed by a Delayed Deployment and then a Stall would show "MULTI-FAULT: 3 TYPES" on the third cycle, even though the Stall was classified at 99% confidence with every other class at 0%.

The original logic counted unique fault names across the last five cycles in the history buffer. If more than one distinct fault type appeared in that window, it flagged a multi-fault condition. This makes sense for detecting genuinely ambiguous scenarios but not for sequential testing of different fault types.

The fix changes what "multi-fault" means. Instead of checking historical diversity, it now examines the current cycle's probability distribution. The alert only triggers when two or more non-Normal classes exceed 5% probability in the same classification, meaning the model genuinely cannot distinguish between fault types for that particular deployment. A Stall at 99% with everything else at 0% no longer triggers it but a genuinely ambiguous cycle where Asymmetric is at 45% and Delayed is at 40% still would.

The recurring fault detection ("RECURRING: Stall x3") remains unchanged, since consecutive same-type predictions across cycles is a valid operational concern regardless of per-cycle confidence.

## What is Next

With these interface fixes in place, the operator-facing system is now clean and accurate across all five tabs. The virtual system, covering PLC control, digital twin simulation, AI classification and operator interface, is functionally complete.

As discussed with submission advisor Mehnaz Hamilton, the next priority is exploring a physical implementation of the system. The 3D-printable electric turbofan model purchased from Cadly is ready to build. I met with module leader Puja Varsani today during the scheduled session and she advised that before proceeding, I need to formally justify the physical prototype proposal and demonstrate how it ties back to the core project objectives. The next step is preparing that justification, clearly linking the physical build to the digital twin validation and fault detection goals established in the project specification.
