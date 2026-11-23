# Case 3: Fire or smoke

**Persona:** Sam's parent, cooking, leaves a pan unattended.

**What happens:** Smoke fills the kitchen, then flames.

**Normal mode**
- Motion and loudness detectors are not designed to see smoke. Triggers here
  come from secondary signals: a person moving fast, shouting, or saying "help".
- This is a known gap. The system has no smoke sensor and does not replace a
  smoke alarm.

**Suspicious mode**
- Once escalated, the prompt lists "fire, smoke, or medical emergency" in the
  8 to 10 band.
- The system instruction asks for short spoken steps for actionable emergencies
  (fire is named explicitly).

**Outcome**
- `send_alert` and spoken guidance, for example to get out and call emergency
  services.

**Risks**
- If nobody moves or speaks, normal mode never escalates. A real smoke alarm
  stays the primary defence.
- Roadmap idea: let the dashboard or phone request an on demand check, so a
  person can ask for analysis without waiting for a trigger.
