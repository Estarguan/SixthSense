# Security

Sixth Sense began as a hackathon project. It is designed for a single trusted
home network and **should not be exposed to the internet** in its current form.
This document lists the threat model and known weaknesses so they can be fixed
deliberately.

## Reporting a vulnerability

Please open a private security advisory on the GitHub repository, or contact the
maintainers directly, rather than filing a public issue.

## Assets worth protecting

1. The live camera view and any clip.
2. API keys: `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`.
3. The user's push token.
4. The integrity of alerts (no fake alerts, no suppressed alerts).

## Trust assumptions

- Every device on the local network is trusted.
- The machine running the servers is trusted and has an up to date OS.

## Known weaknesses

| # | Issue | Where | Impact | Suggested fix |
| --- | --- | --- | --- | --- |
| 1 | No authentication on any endpoint | `analyzeServer.js` | Anyone on the network can view `/stream`, `/latest-frame`, fetch `/audio/latest`, register a push token or trigger analysis | Shared secret or token on every route |
| 2 | Server listens on all interfaces | `server.listen(3001)` | Reachable from the whole LAN | Bind to `127.0.0.1` unless remote access is needed |
| 3 | CORS allows any origin | `app.use(cors())`, `Access-Control-Allow-Origin: *` | Any website opened in a browser on the network can read frames | Restrict to the dashboard origin |
| 4 | Detection hub accepts any origin | `websockets.serve(..., origins=None)` on `:8765` | A malicious web page can connect to `ws://localhost:8765` and inject fake `motion` or `keyword` events | Allow only the dashboard origin |
| 5 | Hub rebroadcasts unvalidated messages | `server.py` `handler` | Any client can forge events | Validate message `type` and schema |
| 6 | Test endpoints are always on | `/test-speech`, `/test-notification*` | Anyone can spend ElevenLabs credit or send fake alerts | Disable outside development |
| 7 | 200 MB JSON body limit | `express.json({ limit: "200mb" })` | Memory exhaustion by a large request | Lower the limit and cap clip length |
| 8 | Single in memory push token | `pushNotification.js` | A caller can replace the token and silently redirect alerts | Authenticate registration, support several tokens |
| 9 | Hardcoded LAN IP in clients | `app_sense`, `web_sense` | Brittle, and leaks the author's network layout | Move to config |
| 10 | Mobile config committed | `app_sense/google-services.json` | Not a secret by itself, but its API key should be restricted in the cloud console | Restrict the key by app and API |
| 11 | Prompt injection through video | `geminiAnalyzer.js` | Text shown to the camera could try to steer the model to a low score | Treat the score as one signal, keep local triggers |

## Secrets handling

- Keys live in `backend/.env`, which is gitignored. Copy
  `backend/.env.example` and never commit the real file.
- Rotate a key at once if it appears in a commit, log or screenshot.

## Hardening checklist before any wider use

- [ ] Add authentication to the analysis server
- [ ] Bind servers to localhost, or put them behind a reverse proxy with TLS
- [ ] Restrict CORS and WebSocket origins
- [ ] Remove or protect the test endpoints
- [ ] Lower request size limits
- [ ] Restrict the Firebase API key
- [ ] Add dependency auditing (`npm audit`, `pip-audit`)
