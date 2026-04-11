---
title: "The Final Demonstration: Twelve Weeks of Work in Two Videos"
description: "The final demonstration videos are here. Part one walks through the complete AI fault detection pipeline, part two brings the physical Festo pneumatic station to life. This is the project I set out to build."
date: 2026-04-08
categories: [Final Submission]
tags: [final-demonstration, demo, milestone, reflection, ai-pipeline, pneumatics]
pin: true
image:
  path: /assets/img/Proud Pioneer.jpeg
  alt: Proud moment with the completed Digital Twin-Enabled AI Fault Detection project
  class: final-hero-image
---

<div class="reading-progress-bar"><div class="reading-progress-fill"></div></div>

<style>
.final-hero-image,
.post img:first-of-type {
  border-radius: 20px !important;
  border: 6px solid transparent !important;
  background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #ffd700 0%, #ffb700 25%, #ff8c00 50%, #ffb700 75%, #ffd700 100%) border-box !important;
  box-shadow: 0 0 30px rgba(255, 183, 0, 0.5), 0 0 60px rgba(255, 140, 0, 0.3) !important;
  animation: heroGlow 3s ease-in-out infinite !important;
}

@keyframes heroGlow {
  0%, 100% { box-shadow: 0 0 30px rgba(255, 183, 0, 0.5), 0 0 60px rgba(255, 140, 0, 0.3); }
  50% { box-shadow: 0 0 45px rgba(255, 183, 0, 0.8), 0 0 90px rgba(255, 140, 0, 0.5); }
}

.project-complete-badge {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 10;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a1a;
  font-weight: 800;
  font-size: 0.95rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(255, 140, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.4) inset;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.reading-progress-bar { position: fixed; top: 0; left: 0; width: 100%; height: 4px; background: transparent; z-index: 9998; pointer-events: none; }
.reading-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #ffd700, #ff8c00, #ffd700); box-shadow: 0 0 10px rgba(255, 183, 0, 0.6); transition: width 0.1s ease-out; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin: 2.5rem 0; padding: 2rem; background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 140, 0, 0.08)); border-radius: 16px; border: 3px solid #ffd700; box-shadow: 0 0 20px rgba(255, 183, 0, 0.4); }
.stat-card { text-align: center; padding: 1rem; }
.stat-number { font-size: 2.4rem; font-weight: 800; background: linear-gradient(135deg, #ffd700, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: block; line-height: 1.1; }
.stat-label { font-size: 0.85rem; color: var(--text-muted-color, #6c757d); margin-top: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px; }

.before-after { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2.5rem 0; }
.before-after figure { margin: 0; text-align: center; }
.iteration-label { margin: 0 0 0.75rem 0; font-size: 1.2rem; font-weight: 700; background: linear-gradient(135deg, #ffd700, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-transform: uppercase; letter-spacing: 1.5px; }
.before-after img { width: 100%; border-radius: 12px; border: 4px solid #ffd700; box-shadow: 0 0 20px rgba(255, 183, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3); }
.before-after figcaption { margin-top: 0.75rem; font-style: italic; color: var(--text-muted-color, #6c757d); font-size: 0.9rem; }

.journey-links { background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 140, 0, 0.05)); padding: 1.5rem 2rem; border-radius: 12px; border-left: 4px solid #ffb700; margin: 2rem 0; }
.journey-links h3 { margin-top: 0; color: #ff8c00; }
.journey-links ul { margin: 0; padding-left: 1.2rem; }
.journey-links li { margin: 0.6rem 0; line-height: 1.6; }

.lessons-list { counter-reset: lesson; list-style: none; padding: 0; margin: 2rem 0; }
.lessons-list li { counter-increment: lesson; position: relative; padding: 1.25rem 1.5rem 1.25rem 4rem; margin: 1rem 0; background: rgba(255, 183, 0, 0.06); border-radius: 10px; border-left: 4px solid #ffb700; line-height: 1.7; }
.lessons-list li::before { content: counter(lesson); position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 2.2rem; height: 2.2rem; border-radius: 50%; background: linear-gradient(135deg, #ffd700, #ff8c00); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; box-shadow: 0 2px 8px rgba(255, 140, 0, 0.4); }

@media (max-width: 600px) {
  .before-after { grid-template-columns: 1fr; }
  .stat-number { font-size: 2rem; }
  .project-complete-badge { font-size: 0.8rem; padding: 0.45rem 0.85rem; top: 0.75rem; left: 0.75rem; }
}
</style>

<div class="project-complete-badge">🏁 Project Complete</div>

After twelve weeks of late nights, unexpected pivots and more debugging sessions than I can count, the final demonstration videos are complete. The Digital Twin-Enabled AI Fault Detection for Thrust Reversers project is ready to be shown and honestly, I could not be prouder of where it has ended up.

## The Project in Numbers

<div class="stats-grid">
  <div class="stat-card"><span class="stat-number" data-target="99.8" data-suffix="%">0</span><div class="stat-label">Accuracy</div></div>
  <div class="stat-card"><span class="stat-number" data-target="24.7" data-suffix="ms">0</span><div class="stat-label">Latency</div></div>
  <div class="stat-card"><span class="stat-number" data-target="1400" data-suffix="">0</span><div class="stat-label">Scenarios</div></div>
  <div class="stat-card"><span class="stat-number" data-target="7" data-suffix="">0</span><div class="stat-label">Fault Classes</div></div>
  <div class="stat-card"><span class="stat-number" data-target="65" data-suffix="">0</span><div class="stat-label">Features</div></div>
  <div class="stat-card"><span class="stat-number" data-target="19" data-suffix="">0</span><div class="stat-label">Technical Decisions</div></div>
  <div class="stat-card"><span class="stat-number" data-target="12" data-suffix="">0</span><div class="stat-label">Weeks</div></div>
  <div class="stat-card"><span class="stat-number" data-target="37" data-suffix="">0</span><div class="stat-label">Blog Posts</div></div>
</div>

## Part One: The AI Pipeline

The first video walks through the complete virtual system. Siemens NX MCD running the thrust reverser physics, TIA Portal V19 with PLCSim Advanced executing the SCL state machines, the PyQt5 operator interface streaming live sensor data, the embedded Three.js 3D engine viewer and the XGBoost classifier making real-time decisions across seven fault classes. The numbers speak for themselves: 99.8% accuracy with a 24.7 millisecond detection latency, well above the original targets of 90% accuracy and 500 millisecond latency.

{% include embed/youtube.html id='1RjVgGxhk_Y' title='Final Demonstration Part One: AI Pipeline' %}

What you will not see in the video is the journey it took to get here. The original Random Forest classifier that capped out at 91.8%. The velocity masking bug where Engine 1's motion mask was being applied to Engine 2's data, hiding itself for weeks until live classification exposed it. The pivot from Partial_Retraction to Stall_Deployment when NX MCD's retraction actuator refused to stop at mid-stroke. The three iterations of the 1,400-scenario dataset, each one teaching me something about clean parameter ranges and consistent recording methodology. Every one of those setbacks forced a better decision and the final system reflects that.

## Part Two: The Physical Station

The second video is the one I genuinely did not expect to be making back in January. After finishing the AI model ahead of schedule, my submission advisor Mehnaz Hamilton suggested taking the project physical. A few weeks later, thanks to Mehmet Karamanoglu loaning WorldSkills pneumatic equipment, I had two rotary actuators, six magnetic sensors, four piloted check valves and a working Festo EduTrainer station on my bench.

{% include embed/youtube.html id='GxhCI4f9m3M' title='Final Demonstration Part Two: Physical Station' %}

The station runs all seven fault scenarios: Normal Deployment, Delayed Deployment, Incomplete Deployment, Asymmetric Speed, Stall Deployment, Oscillating Deployment and Combined Fault. Each one is driven by a dedicated SCL function block on the S7-1200 PLC, selected through the WinCC HMI on the KTP700 touchscreen and demonstrated with real actuators moving in real time. Watching the piloted check valves lock the actuators at mid-stroke for Incomplete Deployment or seeing Engine 1 oscillate back and forth while Engine 2 deploys cleanly, turned the abstract fault classes into something tangible. The station rebuild from V1 cylinders to V2 rotary actuators, documented in TD-019, was worth every minute.

## V1 to V2: How the Station Evolved

<div class="before-after">
  <figure>
    <h4 class="iteration-label">Iteration 1</h4>
    <img src="/assets/img/Operational Pneumatic Station and HMI.jpeg" alt="V1 station with double-acting cylinders">
    <figcaption>V1 with double-acting cylinders, four fault scenarios</figcaption>
  </figure>
  <figure>
    <h4 class="iteration-label">Iteration 2</h4>
    <img src="/assets/img/Modifying The Pneumatic Station.jpg" alt="V2 station with rotary actuators">
    <figcaption>V2 with rotary actuators, seven fault scenarios</figcaption>
  </figure>
</div>

V1 had two double-acting cylinders, two endpoint sensors per actuator and a 4-slice solenoid manifold. It demonstrated four scenarios reliably (Normal Deployment, Delayed Deployment, Asymmetric Speed and Incomplete Deployment) but could not lock the actuators at mid-stroke. V2 replaced everything with rotary actuators, three magnetic sensors per engine and Festo HGL piloted check valves. The check valves were the unlock: they hold the actuator wherever it is when air is cut, making Stall Deployment, Oscillating Deployment and Combined Fault all physically demonstrable for the first time.

## The Story in Links

If you want to follow the most interesting threads of this project backwards, these are the posts that mattered most:

<div class="journey-links">
  <h3>Turning Points</h3>
  <ul>
    <li><a href="{{ '/posts/breaking-barriers/' | relative_url }}">Breaking Barriers: The XGBoost Pivot and the Velocity Masking Bug</a></li>
    <li><a href="{{ '/posts/physical-station-integration-s7-1200-rejected/' | relative_url }}">Physical Station Integration: Why the S7-1200 Rejected Everything</a></li>
    <li><a href="{{ '/posts/pneumatic-station-v2-seven-fault-scenarios/' | relative_url }}">Pneumatic Station V2: Seven Fault Scenarios on the Festo EduTrainer</a></li>
    <li><a href="{{ '/posts/covering-all-bases-updated-risk-assessment/' | relative_url }}">Covering All Bases: The Updated Risk Assessment</a></li>
    <li><a href="{{ '/posts/schematic-refresh-fluidsim-circuit-updated-for-v2/' | relative_url }}">Schematic Refresh: FluidSim Circuit Updated for V2</a></li>
  </ul>
</div>

## Lessons I Will Carry Forward

Twelve weeks of building something this complex teaches you things you cannot learn in a lecture. These are the ones I want to remember.

<ol class="lessons-list">
  <li><strong>The bug you cannot find is always upstream of where you are looking.</strong> The velocity masking bug was not in the classifier. It was not in the feature extraction. It was in a single-character indexing error from the data generation phase. I spent three days debugging the wrong half of the pipeline before realising the inputs themselves were wrong. Always check the data before you blame the model.</li>
  <li><strong>The best fix is sometimes a complete teardown.</strong> The V1 pneumatic station worked. Four fault scenarios ran reliably. I could have stopped there. Tearing it all down to rebuild with rotary actuators and piloted check valves felt reckless at the time. It turned out to be the decision that made the physical demonstration genuinely impressive instead of merely functional.</li>
  <li><strong>Document the decisions, not just the outcomes.</strong> The 19 technical decision documents are not for me. They are for the next person who reads this blog and wonders why I chose XGBoost over a neural network, or why the operator interface uses PyQt5 instead of WinCC. Outcomes get remembered. The reasoning behind them gets lost unless you write it down.</li>
  <li><strong>Hardware will humble your software assumptions.</strong> The S7-1200 PUT/GET protocol restriction did not appear in any documentation I read before attempting integration. The flow restrictors had to be tuned by ear. The magnetic sensors needed millimetre-precise alignment. Every assumption I had about hardware "just working" was wrong and every one of those wrong assumptions made me a better engineer.</li>
  <li><strong>Ask for help before you are drowning.</strong> The Python conversations with Oluwatunmise, the equipment loan from Mehmet, the steady guidance from Mehnaz. None of those happened because I knew exactly what I needed. They happened because I admitted I did not. The people around you want to help. Let them.</li>
  <li><strong>The deadline is a feature, not a bug.</strong> A finite timeline forced me to ship a working system instead of endlessly refining one that was already good enough. I will keep this with me forever: done is better than perfect and shipped is better than both.</li>
</ol>

## Looking Back

When I started this project in January, I had a rough idea of a digital twin, an AI classifier and a report. What I ended up with is a complete mechatronics system that spans mechanical CAD, physics simulation, PLC control, machine learning, real-time visualisation and a working physical demonstrator. The four pillars of the project, which I set out in my first blog post, all came together in the end.

I have learned more in the last three months than in any other period of my degree. I have learned how to debug a classifier that insists it is right when it is wrong. I have learned that the S7-1200 communication stack will happily reject your read request for reasons that take days to uncover. I have learned that flow restrictors matter, that piloted check valves are magical, and that sometimes the best solution is to tear down the station and rebuild it from scratch.

Most of all, I have learned that the hardest parts of a project are where the real learning happens. Every failed run, every rejected approach, every "why is this not working" moment pushed the project further than any smooth path would have.

## Thank You

There is no version of this project that exists without the people who stood beside me throughout it. None.

To **Mehnaz Hamilton**: thank you for believing in this project from the moment it was nothing more than a vague idea and for never letting me settle for the easy version of it. You saw what this could become long before I did and every meeting we had pushed me further than I thought I could go. Suggesting the physical implementation when I was ready to wind down was the moment this project went from good to something I am genuinely proud of. I cannot thank you enough.

To **Mehmet Karamanoglu**: thank you for trusting me with the WorldSkills equipment and for taking the time to teach me how every piece of it worked. Your generosity and patience turned what would have been a software-only demonstration into a real, working physical system. Watching the rotary actuators move on the bench for the first time would never have happened without you.

To **Oluwatunmise Shuaibu**: thank you for being the friend I could turn to when nothing was working and I did not know what to do next. The Python help saved me hours, but the late-night conversations, the encouragement and the reminders that I was capable of finishing this saved me from much worse. You were there in the moments that mattered most and I will never forget that.

And to everyone who followed along through this blog, who left a comment, who asked how it was going, who quietly cheered me on from a distance: thank you. You have no idea how much it meant to know that people were watching this come together.

The next milestone is not a deadline. It is walking across that graduation stage in a few months, knowing I gave this everything I had and knowing I did not walk this road alone. Today, I am just letting myself be proud of what we built together. Twelve weeks ago this was an idea on a page. Today it is real and it is mine to be proud of.

This is what I came to Middlesex to do.

From the bottom of my heart, thank you. For everything.

<script src="{{ '/assets/js/final-demo.js' | relative_url }}"></script>
