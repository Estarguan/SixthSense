# Case 2: Real verbal and physical conflict

**Persona:** Dev's teenager is home when an intruder or an aggressive visitor
becomes violent.

**What happens:** Shouting, a struggle, someone says "get out" or "leave me
alone".

**Normal mode**
- Keywords: "get out" and "leave me alone" are `boundary` phrases; "I'll hurt
  you" style phrases are `threat`.
- Audio: shouting spikes well above the baseline.
- Motion: fast movement across the frame.
- Several detectors firing together is the strongest sign, but any one suffices
  to escalate.

**Suspicious mode**
- Gemini is told to look for one person frightened or trying to escape while the
  other does not stop, real crying or screaming, weapons used aggressively.
- Expected score: 8 to 10.

**Outcome**
- `send_alert`, push to the phone with the analysis.
- `spokenInstructions` is normally empty here (there is no first aid step), so
  no voice message is played.

**Risks**
- The one person alert goes to whoever's token is registered. If that person is
  the one in danger, the alert may not reach anyone else.
- See [false-positives-and-negatives.md](false-positives-and-negatives.md) for
  the opposite error, a heated but harmless argument.
