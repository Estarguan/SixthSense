# Case 1: Choking

**Persona:** Margaret, 78, alone in the kitchen.

**What happens:** She chokes on food. She cannot speak clearly, grabs her throat
and stumbles.

**Normal mode**
- Motion: a sudden burst of movement can exceed the rolling motion baseline.
- Audio: a cough or crash may spike above the baseline.
- Keywords: if she manages "help", the offline matcher flags it as `distress`.
- Any one of these is enough to enter suspicious mode. Nothing has left the
  device yet.

**Suspicious mode**
- A short clip is recorded and sent to Gemini 2.5 Flash.
- The prompt places "someone unable to respond" and "medical emergency" in the
  8 to 10 band.
- Gemini returns `confidence`, an `analysis`, and `spokenInstructions`.

**Outcome**
- Score 8 or more: `send_alert`. A push notification goes to the phone.
- The spoken instructions are turned into speech by ElevenLabs and played in the
  room. The built in test phrase (`/test-speech`) shows the style: short,
  direct steps for abdominal thrusts, ending with "until the object is cleared
  or emergency services arrive".

**Risks**
- Silent choking with little motion may not trigger anything in normal mode.
- Spoken first aid is guidance, not a replacement for calling emergency
  services. The system does not call anyone itself.
