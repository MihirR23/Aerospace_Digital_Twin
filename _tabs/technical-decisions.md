---
title: Technical Decisions
icon: fas fa-lightbulb
order: 6
---

<style>
  .td-page-intro {
    color: #a0a0b0;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 36px;
  }

  .td-domain-section {
    margin-bottom: 40px;
  }

  .td-domain-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .td-domain-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .td-domain-icon.simulation { background: rgba(66,153,225,0.15); color: #63b3ed; }
  .td-domain-icon.plc { background: rgba(237,137,54,0.15); color: #f6ad55; }
  .td-domain-icon.ml { background: rgba(72,187,120,0.15); color: #68d391; }
  .td-domain-icon.interface { background: rgba(159,122,234,0.15); color: #b794f4; }

  .td-domain-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #efefef;
  }

  .td-domain-count {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #6b6b7b;
    margin-left: auto;
  }

  .td-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  .td-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 18px 20px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .td-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .td-card:hover {
    border-color: rgba(255,255,255,0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .td-card:hover::before { opacity: 1; }

  .td-card.simulation::before { background: linear-gradient(90deg, #4299e1, #63b3ed); }
  .td-card.plc::before { background: linear-gradient(90deg, #ed8936, #f6ad55); }
  .td-card.ml::before { background: linear-gradient(90deg, #48bb78, #68d391); }
  .td-card.interface::before { background: linear-gradient(90deg, #9f7aea, #b794f4); }

  .td-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .td-card-id {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .td-card-id.simulation { color: #63b3ed; }
  .td-card-id.plc { color: #f6ad55; }
  .td-card-id.ml { color: #68d391; }
  .td-card-id.interface { color: #b794f4; }

  .td-card-status {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .td-card-status.active {
    color: #68d391;
    background: rgba(72,187,120,0.1);
  }

  .td-card-status.superseded {
    color: #6b6b7b;
    background: rgba(107,107,123,0.1);
    text-decoration: line-through;
  }

  .td-card-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #efefef;
    line-height: 1.35;
    margin-bottom: 8px;
  }

  .td-card-summary {
    font-size: 0.82rem;
    color: #7b7b8b;
    line-height: 1.55;
    margin-bottom: 12px;
  }

  .td-card-date {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    color: #4a4a58;
  }

  .td-card-expand {
    display: none;
    padding-top: 14px;
    margin-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .td-card.expanded .td-card-expand {
    display: block;
  }

  .td-expand-field {
    margin-bottom: 10px;
  }

  .td-expand-field:last-child {
    margin-bottom: 0;
  }

  .td-expand-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #4a4a58;
    font-weight: 600;
    margin-bottom: 3px;
  }

  .td-expand-value {
    font-size: 0.82rem;
    color: #a0a0b0;
    line-height: 1.6;
  }

  .td-expand-value ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .td-expand-value ul li {
    padding-left: 16px;
    position: relative;
    margin-bottom: 4px;
  }

  .td-expand-value ul li::before {
    content: '>';
    position: absolute;
    left: 0;
    color: #4a4a58;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
  }

  .td-outcome-tag {
    display: inline-block;
    background: rgba(139,139,255,0.1);
    color: #a0a0ff;
    border: 1px solid rgba(139,139,255,0.15);
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    font-family: 'Courier New', monospace;
  }

  .td-superseded-card {
    opacity: 0.55;
  }

  .td-superseded-card:hover {
    opacity: 0.85;
  }
</style>

<p class="td-page-intro">A record of key engineering decisions made throughout this project. Each entry documents the context, alternatives considered, and reasoning behind the chosen approach. Click any card to expand the full detail.</p>

<!-- DIGITAL TWIN / SIMULATION -->
<div class="td-domain-section">
  <div class="td-domain-header">
    <div class="td-domain-icon simulation"><i class="fas fa-cube"></i></div>
    <span class="td-domain-name">Digital Twin / Simulation</span>
    <span class="td-domain-count">4 decisions</span>
  </div>
  <div class="td-card-grid">

    <div class="td-card simulation" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id simulation">TD-001</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">Use Existing CAD Models Over Building from Scratch</div>
      <div class="td-card-summary">Purchased RTWILEYRC's thrust reverser and engine models from Cults3D rather than modelling from scratch in Siemens NX.</div>
      <div class="td-card-date">27 January 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">
            <ul>
              <li>Jet engine geometry proved more complex than anticipated</li>
              <li>Precise dimensions and tolerances not available from public sources</li>
              <li>Weeks spent on CAD instead of core AI fault detection contribution</li>
            </ul>
          </div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Decision Rationale</div>
          <div class="td-expand-value">The investment in professional models saved weeks of modelling time and provided simulation-ready components including blocker doors, cascade vanes, and translating cowl mechanisms.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">Focus shifted to PLC control and AI fault detection</span></div>
        </div>
      </div>
    </div>

    <div class="td-card simulation" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id simulation">TD-002</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">Request STEP Files from Creator</div>
      <div class="td-card-summary">Contacted RTWILEYRC for native STEP files and full assembly rather than manually converting 87 STL files.</div>
      <div class="td-card-date">28 January 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">
            <ul>
              <li>Manual STL to STEP conversion unreliable for complex geometry</li>
              <li>87 files would require significant individual conversion time</li>
              <li>Converted files failing to load in Siemens NX</li>
            </ul>
          </div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Decision Rationale</div>
          <div class="td-expand-value">The presence of DWG files in the download suggested RTWILEYRC may have native CAD files available. Direct communication could save significant time and yield better quality files.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">Acquired files from RTWILEYRC</span></div>
        </div>
      </div>
    </div>

    <div class="td-card simulation" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id simulation">TD-003</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">Mechatronics Concept Designer Over Motion Simulation</div>
      <div class="td-card-summary">Work exclusively in MCD environment and delete Simcenter 3D Motion simulation. The two environments were conflicting.</div>
      <div class="td-card-date">3 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">Simcenter 3D Motion cannot access MCD physics definitions. The two environments were conflicting, preventing the Runtime Inspector from functioning correctly.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">MCD exclusively, all 8 sensors operational</span></div>
        </div>
      </div>
    </div>

    <div class="td-card simulation" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id simulation">TD-004</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">OPC UA Data Pipeline Over Direct NX Export</div>
      <div class="td-card-summary">Signal Adapter exposes sensors as shared tags. MCD Runtime Inspector has no CSV export capability.</div>
      <div class="td-card-date">3 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">MCD Runtime Inspector can display sensor values but provides no mechanism for exporting data to CSV or other formats for ML training.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">16-parameter Signal Adapter configured</span></div>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- PLC CONTROL -->
<div class="td-domain-section">
  <div class="td-domain-header">
    <div class="td-domain-icon plc"><i class="fas fa-microchip"></i></div>
    <span class="td-domain-name">PLC Control</span>
    <span class="td-domain-count">4 decisions</span>
  </div>
  <div class="td-card-grid">

    <div class="td-card plc" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id plc">TD-005</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">Analog-Only Control Architecture</div>
      <div class="td-card-summary">Single Position Control per transcowl using analog values (52mm deploy, 0mm retract). Boolean active parameter ignored by NX.</div>
      <div class="td-card-date">5 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">
            <ul>
              <li>Boolean active parameter exposed for monitoring only, not external control</li>
              <li>All Position Controls activated on simulation start regardless of PLC commands</li>
              <li>Deploy and retract controls conflicted, causing transcowl bounce</li>
            </ul>
          </div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">Analog position/speed control via PLC</span></div>
        </div>
      </div>
    </div>

    <div class="td-card plc td-superseded-card" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id plc">TD-006</span>
        <span class="td-card-status superseded">Superseded</span>
      </div>
      <div class="td-card-title">Python Snap7 for Data Logging</div>
      <div class="td-card-summary">Selected Snap7 over TIA Portal Trace for automated data capture. Later replaced when network limitations emerged.</div>
      <div class="td-card-date">9 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">TIA Portal Trace was inefficient for 250 recordings. OPC UA was blocked by licensing error. Snap7 was recommended by Oluwatunmise Shuaibu.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">Superseded by TD-007</span></div>
        </div>
      </div>
    </div>

    <div class="td-card plc" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id plc">TD-007</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">PLCSim Advanced .NET API Over Snap7</div>
      <div class="td-card-summary">Direct .NET API via pythonnet. Network unreachable in PLCSim softbus mode made Snap7 non-functional.</div>
      <div class="td-card-date">10 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">PLCSim Advanced runs in softbus mode, blocking all TCP/IP networking. Both OPC UA and Snap7 failed for the same root cause.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">100Hz tag read/write via pythonnet</span></div>
        </div>
      </div>
    </div>

    <div class="td-card plc" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id plc">TD-008</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">PLC State Machine Timeout for Fault Scenarios</div>
      <div class="td-card-summary">Timer_2 added to state 40 with timeout. Prevents indefinite hang on incomplete deployment faults.</div>
      <div class="td-card-date">10 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">State 40 waits for all transcowl positions to reach 50mm. Incomplete deployment faults intentionally command lower positions, causing the state machine to hang indefinitely.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">Timer_2 timeout (extended to 15s in TD-013)</span></div>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- MACHINE LEARNING -->
<div class="td-domain-section">
  <div class="td-domain-header">
    <div class="td-domain-icon ml"><i class="fas fa-brain"></i></div>
    <span class="td-domain-name">Machine Learning</span>
    <span class="td-domain-count">4 decisions</span>
  </div>
  <div class="td-card-grid">

    <div class="td-card ml td-superseded-card" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id ml">TD-009</span>
        <span class="td-card-status superseded">Superseded</span>
      </div>
      <div class="td-card-title">Random Forest as Primary Classifier</div>
      <div class="td-card-summary">Selected over Neural Network with 91.8% ± 2.3% accuracy, lower variance, and faster inference.</div>
      <div class="td-card-date">12 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Rationale</div>
          <div class="td-expand-value">Random Forest met all project targets. Neural Network failed accuracy on conservative estimates (84.9% at mean minus one standard deviation). 10-run robustness evaluation used for honest validation.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">Superseded by TD-011, then TD-013</span></div>
        </div>
      </div>
    </div>

    <div class="td-card ml" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id ml">TD-010</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">1000-Scenario Dataset Expansion</div>
      <div class="td-card-summary">Expanded from 250 to 1000 scenarios. Single-error accuracy impact reduced from 2% to 0.5%.</div>
      <div class="td-card-date">12 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Rationale</div>
          <div class="td-expand-value">Test set grew from 50 to 200 samples (10 to 40 per class), providing statistically reliable evaluation and fairer Neural Network comparison with 800 training samples.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">1,000 scenarios recorded (later expanded to 1,400)</span></div>
        </div>
      </div>
    </div>

    <div class="td-card ml td-superseded-card" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id ml">TD-011</span>
        <span class="td-card-status superseded">Superseded</span>
      </div>
      <div class="td-card-title">1000-Scenario RF as Final Classifier</div>
      <div class="td-card-summary">Selected over 250-scenario model for statistical reliability despite identical 91.8% mean accuracy.</div>
      <div class="td-card-date">13 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Rationale</div>
          <div class="td-expand-value">40 test samples per class versus 10. Delayed_Deployment improved by 8 percentage points with halved variance. Combined_Fault reached perfect classification.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">Superseded by TD-013 (XGBoost)</span></div>
        </div>
      </div>
    </div>

    <div class="td-card ml" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id ml">TD-013</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">7-Class XGBoost with Expanded Fault Types</div>
      <div class="td-card-summary">1,400 scenarios, 7 fault classes, 97.0% ± 0.7% accuracy. Added Oscillating_Deployment and Stall_Deployment.</div>
      <div class="td-card-date">16 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">
            <ul>
              <li>Random Forest could not reliably separate Asymmetric_Speed from Delayed_Deployment</li>
              <li>System only covered 5 fault types, missing oscillating and stall failure modes</li>
              <li>Feature extraction contained a per-engine velocity masking bug</li>
            </ul>
          </div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Result</div>
          <div class="td-expand-value">97.0% ± 0.7% accuracy across 7 classes. Both new fault types achieved near-perfect classification. XGBoost handles Asymmetric/Delayed overlap more effectively than Random Forest.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">fault_classifier_best.pkl deployed in GUI V9</span></div>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- OPERATOR INTERFACE -->
<div class="td-domain-section">
  <div class="td-domain-header">
    <div class="td-domain-icon interface"><i class="fas fa-desktop"></i></div>
    <span class="td-domain-name">Operator Interface</span>
    <span class="td-domain-count">1 decision</span>
  </div>
  <div class="td-card-grid">

    <div class="td-card interface" onclick="this.classList.toggle('expanded')">
      <div class="td-card-top">
        <span class="td-card-id interface">TD-012</span>
        <span class="td-card-status active">Active</span>
      </div>
      <div class="td-card-title">Python GUI as Primary Interface</div>
      <div class="td-card-summary">Python tkinter chosen over WinCC HMI. Integrates AI classification, trend detection, and operator controls in a single application.</div>
      <div class="td-card-date">13 February 2026</div>
      <div class="td-card-expand">
        <div class="td-expand-field">
          <div class="td-expand-label">Problem</div>
          <div class="td-expand-value">
            <ul>
              <li>WinCC HMI cannot natively integrate machine learning inference</li>
              <li>In the virtual environment, both WinCC and Python communicate via the same PLC tag mechanism</li>
              <li>Developing both interfaces would duplicate effort without adding value</li>
            </ul>
          </div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Decision Rationale</div>
          <div class="td-expand-value">Python GUI communicates with the PLC via the identical mechanism a physical HMI would use. It integrates AI classification, trend detection, anomaly flagging, session statistics, and operator controls in a single interface. WinCC reserved for future physical hardware transition.</div>
        </div>
        <div class="td-expand-field">
          <div class="td-expand-label">Outcome</div>
          <div class="td-expand-value"><span class="td-outcome-tag">GUI V9 operational with 7-class fault detection</span></div>
        </div>
      </div>
    </div>

  </div>
</div>

<script>
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.td-card')) {
      document.querySelectorAll('.td-card.expanded').forEach(function(card) {
        card.classList.remove('expanded');
      });
    }
  });
</script>
