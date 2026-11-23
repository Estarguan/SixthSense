# Case 4: Play fighting (false positive avoided)

**Persona:** Alex and a flatmate wrestling over the sofa, shrieking and laughing.

**What happens:** Loud voices, fast movement, someone yells "get off me".

**Normal mode**
- Audio spike, fast motion and possibly a `boundary` keyword all fire. This
  looks alarming to simple detectors, which is exactly why normal mode only
  escalates and never alerts on its own.

**Suspicious mode**
- The prompt tells Gemini to weigh consent and mood: both people laughing or
  smiling, exaggerated reactions, and "play which feels light even when loud".
- Expected score: 0 to 3.

**Outcome**
- `return_to_normal`. No push notification, no voice.

**Why this case matters**
- It is the main reason the system is two stage. Cheap detectors have high
  recall, the model supplies the judgement.
- Gemini is run at low temperature (0.1) to keep scoring consistent.

**Risks**
- Real distress can look like play for a few seconds. If the score lands in 4
  to 7 the system keeps watching instead of dismissing, which is the safer
  failure.
