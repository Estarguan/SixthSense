# Case 5: TV, music or a party

**Persona:** Alex hosting a game night with the TV on.

**What happens:** Sustained loud sound from speakers and many voices.

**Normal mode**
- Loudness is measured as RMS in dB and compared with a slowly adapting
  baseline (an exponential moving average).
- The baseline rises with a steadily loud room, so the room is not "a spike".
- If a sound is far above the baseline, baseline updates are frozen so a
  real spike cannot drag the baseline up with it.
- A cooldown (several seconds) stops the same event firing repeatedly.
- Sensitivity presets exist in `audioTriggerEngine.js` (spike thresholds of 18,
  27 and 37 dB above baseline).

**Suspicious mode:** not entered, so no clip is sent anywhere.

**Outcome:** nothing happens. This is the cheapest and most private outcome.

**Risks**
- A TV that plays a scream or "help" can still trigger the keyword matcher,
  since offline speech to text cannot tell a person from a speaker. Gemini then
  sees a normal living room and scores it low, but the clip has been sent. See
  [../privacy.md](../privacy.md).
