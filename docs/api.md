# API reference

Two servers. Both are unauthenticated and meant for a trusted local network
(see [../SECURITY.md](../SECURITY.md)).

## Analysis server (`http://localhost:3001`)

Defined in `backend/analyzeServer.js`. CORS is open, JSON body limit is 200 MB.

### `POST /analyze`

Send a clip for suspicious mode analysis.

Request:

```json
{ "videoBase64": "<base64 without data: prefix>", "mimeType": "video/webm" }
```

`mimeType` defaults to `video/mp4` if omitted.

Response `200`:

```json
{
  "decision": "send_alert",
  "confidence": 9,
  "analysis": "Text description of what was seen and why",
  "spokenInstructions": "Optional step by step guidance, or empty string",
  "videoBase64": "<echoed back, only when decision is send_alert>"
}
```

`decision` is one of `send_alert`, `continue_analyzing`, `return_to_normal`.
Only `send_alert` includes `spokenInstructions` and `videoBase64`. On
`send_alert` the server also sends a push notification.

Errors: `500 { "error": "<message>" }`.

### `POST /register-token`

Body `{ "token": "<Expo push token>" }`. Stores one token in memory, replacing
any previous one. `400` if `token` is missing.

### `GET /stream`

MJPEG stream (`multipart/x-mixed-replace`) of the frames relayed by the dashboard.

### `GET /latest-frame`

Most recent JPEG frame, `503` if none yet.

### `GET /audio/latest`

Most recent generated speech as `audio/mpeg`, `503` if none yet.

### `WS /ws/frames`

Send binary JPEG frames. Each frame replaces the latest frame and is pushed to
all `/stream` clients. The dashboard sends about 10 frames per second.

### Test helpers

| Endpoint | Effect |
| --- | --- |
| `POST /test-speech` | Generates a fixed choking guidance clip via ElevenLabs, returns `{ ok, bytes }` |
| `POST /test-notification` | Sends a sample high risk push |
| `POST /test-notification-2` | Sends a sample medium risk push |

These should be disabled outside development.

## Detection hub (`ws://localhost:8765`)

Defined in `backend/server.py`. Any message a client sends (valid JSON) is
rebroadcast to every connected client, including the sender.

Messages in use:

```json
{ "type": "motion", "time": "03:14:07 PM", "timestamp": 1732300447.12 }
```

```json
{ "type": "keyword", "phrase": "help", "category": "distress" }
```

`category` is one of `boundary`, `distress`, `threat`.

## Environment variables

| Name | Used by | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | `geminiAnalyzer.js` | Gemini access |
| `ELEVENLABS_API_KEY` | `analyzeServer.js` | Text to speech |
| `ELEVENLABS_VOICE_ID` | `analyzeServer.js` | Voice to use |
| `VOSK_MODEL_PATH` | `monitorKeywords.js` | Optional path to the Vosk model |
