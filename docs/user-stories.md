# User stories

Who Sixth Sense is for, and what each of them needs from it. Stories are written
as "As a… I want… so that…" with acceptance criteria that map to behaviour the
system has today (or is planned, marked *planned*).

## Personas

| Persona | Situation | What they fear | What they want |
| --- | --- | --- | --- |
| **Margaret, 78** | Lives alone, mild mobility issues | Falling or choking with nobody there | Help that arrives fast, and a voice that tells her what to do |
| **Dev, 41** | Parent of a 12 year old who is home after school | A stranger at the door, a medical scare | A phone alert only when it matters, not a stream of motion pings |
| **Priya, 29** | Renter, wary of cloud cameras | Footage leaking or being sold | A camera that provably stores and uploads nothing day to day |
| **Sam, 52** | Caregiver, checks in on a parent remotely | Missing an emergency while at work | A clear, ranked alert with context, not raw footage to scrub through |
| **Alex, 34** | Shares a flat, loud game nights | Being woken by false alarms | The system to ignore a party or a TV |

## Stories

### Everyday monitoring (normal mode)

**1. Quiet by default**
As Priya, I want the camera and mic to do only cheap local checks most of the
time, so that my home is not being recorded or sent anywhere.
- No network request to Gemini is made in normal mode.
- No audio or video is written to disk.
- Speech to text runs offline (Vosk).

**2. Ignore the noise I make myself**
As Alex, I want loudness judged against a slowly adapting baseline, so that a TV,
music or a party does not count as a spike.
- Sound is compared with a rolling baseline in dB, not a fixed volume.
- A sustained loud room raises the baseline instead of firing repeatedly.
- A cooldown stops the same loud event re-triggering.

**3. Notice sudden movement**
As Dev, I want sudden fast motion flagged, so that something like a fall or a
struggle is noticed even if nobody speaks.
- Motion is scored from frame to frame and compared with a rolling baseline.
- A short cooldown prevents a burst of triggers from one event.

**4. Hear the words that matter**
As Margaret, I want phrases like "help" or "I'm scared" picked up, so that I can
call for help hands free.
- Keyword matching runs offline and tolerates missing apostrophes ("dont").
- Each match carries a category: boundary, distress or threat.

### Deciding whether it is real (suspicious mode)

**5. A second opinion before I get pinged**
As Dev, I want a trigger to be checked by AI before it becomes an alert, so that
I am not woken for a dropped plate.
- One short clip is sent to Gemini, which returns a score from 0 to 10.
- 8 or more sends an alert, under 4 returns to normal mode, 4 to 7 keeps watching.

**6. Don't mistake play for harm**
As Alex, I want play fighting, joking and theatrical shouting recognised as
harmless, so that a game night does not alert my flatmates' families.
- The analysis prompt explicitly separates consenting play from distress.

**7. Tell me what to do**
As Margaret, I want calm spoken instructions when someone is choking or there is
a fire, so that I know what to do in the first minute.
- For actionable emergencies the analysis includes step by step instructions.
- They are voiced aloud (ElevenLabs) in the room.

### Being alerted

**8. A phone alert that says why**
As Sam, I want a push notification with a short reason and a risk level, so that
I can decide how fast to react.
- Alerts arrive via Expo push on the phone app.
- Alert detail shows the analysis and a recent camera frame.

**9. A live view when I choose to look**
As Sam, I want a live dashboard with status and an alert feed, so that I can
check in on demand.
- The web dashboard shows the camera feed, the current mode and past alerts.

### Trust and control

**10. Show me what leaves my home** *(partly planned)*
As Priya, I want a plain statement of what is sent and when, so that I can trust
it. See [privacy.md](privacy.md).

**11. Tune it to my home** *(planned)*
As Alex, I want to choose sensitivity, quiet hours and my own keywords, so that
the system fits how my household actually sounds.
- Audio sensitivity presets exist in code today; a settings screen does not.

**12. More than one person gets told** *(planned)*
As Margaret, I want my daughter and a neighbour both alerted, so that someone
always responds.
- Today a single push token is registered at a time.

## Out of scope

- Continuous recording or cloud archives of footage.
- Identifying who a person is (no face recognition).
- Contacting emergency services automatically.
