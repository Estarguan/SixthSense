# Case 6: Ambiguous argument

**Persona:** Two housemates arguing loudly about money. One is clearly upset.
Neither is threatening the other.

**Normal mode:** raised voices spike the audio detector. Possibly a keyword
such as "get out".

**Suspicious mode**
- This falls in the prompt's medium band: raised voices where it is unclear if
  it is joking or genuine, one person uncomfortable but not clearly in danger.
- Expected score: 4 to 7.

**Outcome**
- `continue_analyzing`. No alert yet, and the system does not return to normal.
- If the next check scores 8 or more, an alert is sent. If it scores under 4,
  it resets.

**Why this case matters**
- It is the reason there are three outcomes and not two. A binary cut off would
  either spam people over every argument or miss the one that escalates.

**Risks**
- Each continued check sends another clip to Gemini. A very long ambiguous
  situation means repeated uploads. A cap on consecutive checks is a roadmap
  item.
- `SUSPICIOUS_WINDOW_SEC` is defined in `constants.js` but the decision logic
  does not enforce a time limit yet.
