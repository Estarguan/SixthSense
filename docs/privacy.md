# Privacy

The project's central promise is that the home is not recorded or uploaded
unless something looks wrong. This page states exactly what that means, so the
claim can be checked against the code.

## What happens in normal mode

| Data | Where it goes | Stored? |
| --- | --- | --- |
| Camera frames | Read by OpenCV on your machine for motion scoring | No |
| Microphone audio | Read locally for loudness and offline speech to text (Vosk) | No |
| Transcripts | Matched against a local phrase list | No, only a match event is sent |
| Live frames for the dashboard | Browser to the analysis server on your own network at about 10 fps | Latest frame only, in memory |

Nothing in normal mode is sent to Gemini, ElevenLabs or any other cloud service.

## What happens when something triggers

| Data | Where it goes | Why |
| --- | --- | --- |
| One short video clip (about 10 seconds) | Google Gemini 2.5 Flash | To score whether it is a real emergency |
| Spoken guidance text | ElevenLabs | To turn instructions into speech |
| Alert text and score | Expo push service, then the phone | To notify the user |

The clip is sent only after a local trigger. The server does not write clips to
disk, but the third parties named above process what is sent to them under their
own terms. Review those terms before using this at home.

## What is not collected

- No accounts, no analytics, no ad identifiers.
- No face recognition or identification of people.
- No long term archive of footage or audio.

## Honest caveats

- **In memory is not nothing.** The server holds the latest frame and the latest
  generated speech until it restarts, and the frame is viewable at `/stream` and
  `/latest-frame` by anything that can reach the server.
- **Triggers can be wrong.** A TV saying "help" can cause a clip to be uploaded.
  Privacy depends on trigger precision as well as on design.
- **Bystanders.** Guests and neighbours are recorded too. See [ethics.md](ethics.md).
- **Third party retention.** Data sent to Gemini, ElevenLabs and Expo is subject
  to their retention policies, which this project does not control.
- **Local network exposure.** See [../SECURITY.md](../SECURITY.md).

## How to verify

1. Run with the network blocked: normal mode should keep working.
2. Search the code for outbound calls: only `geminiAnalyzer.js`,
   `analyzeServer.js` (ElevenLabs) and `pushNotification.js` call out.
3. Watch for disk writes: none are made by the servers for clips or audio.

## Possible improvements

- Reject non local clients on port 3001 by default.
- A visible indicator whenever a clip is being sent.
- A log of every upload (time and reason, never content) the user can inspect.
- Optional on device analysis for users who never want to upload.
