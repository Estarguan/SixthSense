# Setup

Step by step instructions to run every part of Sixth Sense on macOS. The short
version is in the [README](../README.md).

## Requirements

| Tool | Why |
| --- | --- |
| Python 3 | Detection server and Vosk speech to text |
| Node.js 20+ | Analysis server, keyword listener, web dashboard |
| ffmpeg | Camera discovery in `server.py` |
| sox | Microphone capture for the keyword listener (`brew install sox`) |
| Expo Go or a dev build | Running the phone app |

You also need API keys for Gemini and ElevenLabs.

## 1. Configure keys

```bash
cp backend/.env.example backend/.env
# edit backend/.env and fill in the values
```

## 2. Install dependencies

```bash
cd backend && npm install && pip install opencv-python websockets vosk
cd ../web_sense && npm install
cd ../app_sense && npm install
```

## 3. Download the offline speech model

```bash
cd backend/normal_mode
curl -LO https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
unzip vosk-model-small-en-us-0.15.zip
mv vosk-model-small-en-us-0.15 model
```

The model folder is gitignored. Set `VOSK_MODEL_PATH` to use another location.

## 4. Allow camera and microphone

macOS will ask your terminal for access the first time. Allow both under
System Settings, Privacy & Security.

## 5. Start the backend and dashboard

`start.sh` launches everything but contains absolute paths from the original
author's machine. Edit the four `cd` lines to match your clone, then:

```bash
./start.sh
```

Or start each piece yourself in its own terminal:

```bash
cd backend && python3 server.py                          # motion + WS hub :8765
cd backend && node analyzeServer.js                      # analysis server :3001
cd backend/normal_mode && node monitorKeywords.js        # keyword listener
cd web_sense && npm run dev                              # dashboard
```

## 6. Point the clients at your machine

The code contains a hardcoded LAN address (`10.37.103.237`) in
`web_sense/src/hooks/useStreamRelay.js`, `app_sense/services/notifications.js`
and `app_sense/screens/AlertDetailScreen.js`. Replace it with your computer's
local IP. Your phone must be on the same network.

## 7. Run the phone app

```bash
cd app_sense && npx expo start
```

Open it in Expo Go, allow notifications, and it registers its push token with the
backend.

## Check it works

- The dashboard shows the camera feed.
- Move quickly in front of the camera: a motion event appears.
- Say "help" near the mic: a keyword event appears.
- Trigger analysis from the dashboard and confirm a decision comes back.
- `curl -X POST http://localhost:3001/test-notification` sends a test push.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `MODEL_NOT_FOUND` | Download the Vosk model (step 3) or set `VOSK_MODEL_PATH` |
| `rec` or `sox` not found | `brew install sox`, make sure `/opt/homebrew/bin` is on `PATH` |
| No camera frames | Grant camera permission, close other apps using the camera |
| No push notification | Check the phone registered a token and shares the network |
| No spoken audio | Check `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` |
| Analysis errors | Check `GEMINI_API_KEY` and the server console |
