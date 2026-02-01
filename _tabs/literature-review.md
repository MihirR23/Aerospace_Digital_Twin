---
icon: fas fa-book
order: 3
---

<style>
.lit-section {
  border: 1px solid var(--card-border-color, #e0e0e0);
  border-radius: 12px;
  margin-bottom: 1.2rem;
  overflow: hidden;
  background: var(--card-bg, #f8f9fa);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.lit-section:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.lit-section summary {
  padding: 1rem 1.25rem;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  border-left: 5px solid var(--accent-color);
  transition: background 0.2s ease;
}

.lit-section summary:hover {
  background: rgba(0, 0, 0, 0.03);
}

.lit-section summary::-webkit-details-marker {
  display: none;
}

.lit-section summary .icon {
  font-size: 1.3rem;
  min-width: 1.5rem;
  text-align: center;
}

.lit-section summary .arrow {
  margin-left: auto;
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.lit-section[open] summary .arrow {
  transform: rotate(90deg);
}

.lit-section[open] summary {
  border-bottom: 1px solid var(--card-border-color, #e0e0e0);
}

.lit-section .content {
  padding: 1rem 1.25rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Section colours */
.lit-thrust { --accent-color: #4472C4; }
.lit-digital { --accent-color: #70AD47; }
.lit-ai { --accent-color: #ED7D31; }
.lit-plc { --accent-color: #7030A0; }
.lit-gap { --accent-color: #E74C3C; }
</style>

This section presents the research findings and academic sources relevant to the project, covering thrust reverser systems, digital twin technology, AI fault detection, and PLC control systems.

---

<details class="lit-section lit-thrust">
<summary>
  <span class="icon">✈️</span>
  <span>Thrust Reverser Systems & Aviation Safety</span>
  <span class="arrow">▶</span>
</summary>
<div class="content">

<h3>Why Does This Matter?</h3>

<p>Thrust reverser failures have caused fatal accidents:</p>

<p><strong>Lauda Air Flight 004 (1991):</strong> The left engine's thrust reverser deployed uncommanded during climb, causing an uncontrollable dive that killed 223 people. Investigators found 61 maintenance warnings in the month before, all inadequately addressed [1].</p>

<p><strong>TAM Airlines Flight 3054 (2007):</strong> Asymmetric thrust on landing (left engine in reverse, right engine at climb power) prevented spoilers and autobrakes from activating. The aircraft overran the runway, killing 199 people [2].</p>

<p>Both accidents share a common factor: asymmetric thrust reverser behaviour that existing monitoring systems failed to prevent [3].</p>

<h3>Relevance to This Project</h3>

<p>Current systems monitor each engine independently and alert pilots only after a fault occurs. This project introduces real-time synchronisation monitoring between both engines using AI, enabling detection of asymmetric deployment patterns before they become catastrophic.</p>

<h3>References</h3>

<p>[1] Federal Aviation Administration, "Lessons Learned: Boeing 767-300ER, OE-LAV," FAA, 1991. [Online]. Available: <a href="https://www.faa.gov/lessons_learned/transport_airplane/accidents/OE-LAV">https://www.faa.gov/lessons_learned/transport_airplane/accidents/OE-LAV</a></p>

<p>[2] SKYbrary, "A320, São Paulo Congonhas Brazil, 2007," EUROCONTROL, 2007. [Online]. Available: <a href="https://www.skybrary.aero/index.php/A320,_São_Paulo_Congonhas_Brazil,_2007">https://www.skybrary.aero/index.php/A320,_São_Paulo_Congonhas_Brazil,_2007</a></p>

<p>[3] SKYbrary, "Thrust Reversers: Flight Crew Guidance," EUROCONTROL, 2025. [Online]. Available: <a href="https://skybrary.aero/articles/thrust-reversers-flight-crew-guidance">https://skybrary.aero/articles/thrust-reversers-flight-crew-guidance</a></p>

</div>
</details>

<details class="lit-section lit-digital">
<summary>
  <span class="icon">🖥️</span>
  <span>Digital Twin Technology</span>
  <span class="arrow">▶</span>
</summary>
<div class="content">

<h3>Why Does This Matter?</h3>

<p>A digital twin is a virtual replica of a physical asset that updates continuously using real-time sensor data, unlike traditional simulation which relies on fixed parameters set by a designer [1]. A simulation can only show what could happen, while a digital twin reflects what is actually happening to a specific system in the real world [2].</p>

<p>In aerospace, this technology is already in use. Rolls-Royce creates digital twins of their aircraft engines, installing sensors that continuously relay data back to the virtual model to predict maintenance needs and model operational scenarios digitally [3]. Airbus has adopted digital twins across all aircraft programmes, using them to validate designs and optimise production before committing to physical builds [4].</p>

<h3>Relevance to This Project</h3>

<p>This project uses Siemens NX to create a digital twin of a thrust reverser system. Virtual sensors generate deployment data (position, velocity, timing) that feeds into the AI fault detection model. This allows dangerous failure scenarios, such as asymmetric deployment, to be tested safely without risk to physical hardware or personnel.</p>

<h3>References</h3>

<p>[1] AIAA and AIA, "Digital Twin: Definition & Value," Position Paper, Dec. 2020. [Online]. Available: <a href="https://aiaa.org/wp-content/uploads/2024/12/digital-twin-institute-position-paper-december-2020.pdf">https://aiaa.org/wp-content/uploads/2024/12/digital-twin-institute-position-paper-december-2020.pdf</a></p>

<p>[2] TWI Ltd, "Simulation vs Digital Twin," TWI Global, 2024. [Online]. Available: <a href="https://www.twi-global.com/technical-knowledge/faqs/simulation-vs-digital-twin">https://www.twi-global.com/technical-knowledge/faqs/simulation-vs-digital-twin</a></p>

<p>[3] Rolls-Royce, "How Digital Twin Technology Can Enhance Aviation," Rolls-Royce, 2019. [Online]. Available: <a href="https://www.rolls-royce.com/media/our-stories/discover/2019/how-digital-twin-technology-can-enhance-aviation.aspx">https://www.rolls-royce.com/media/our-stories/discover/2019/how-digital-twin-technology-can-enhance-aviation.aspx</a></p>

<p>[4] Airbus, "Digital Twins: Accelerating Aerospace Innovation from Design to Operations," Airbus Newsroom, Apr. 2025. [Online]. Available: <a href="https://www.airbus.com/en/newsroom/stories/2025-04-digital-twins-accelerating-aerospace-innovation-from-design-to-operations">https://www.airbus.com/en/newsroom/stories/2025-04-digital-twins-accelerating-aerospace-innovation-from-design-to-operations</a></p>

</div>
</details>

<details class="lit-section lit-ai">
<summary>
  <span class="icon">🤖</span>
  <span>AI and Machine Learning for Fault Detection</span>
  <span class="arrow">▶</span>
</summary>
<div class="content">

<p>Content coming soon.</p>

</div>
</details>

<details class="lit-section lit-plc">
<summary>
  <span class="icon">⚙️</span>
  <span>PLC Control Systems & OPC UA</span>
  <span class="arrow">▶</span>
</summary>
<div class="content">

<p>Content coming soon.</p>

</div>
</details>

<details class="lit-section lit-gap">
<summary>
  <span class="icon">🔍</span>
  <span>Existing Research & Gap Analysis</span>
  <span class="arrow">▶</span>
</summary>
<div class="content">

<p>Content coming soon.</p>

</div>
</details>
