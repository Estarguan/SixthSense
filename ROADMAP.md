# Roadmap

Where Sixth Sense is going. Items are grouped by horizon, not promised dates.

## Known issues (fix first)

| Issue | Detail |
| --- | --- |
| Push score scale mismatch | `pushNotification.js` treats `confidence` as 0 to 1 and thresholds on 0.8 and 0.5, but the analyzer returns an integer 0 to 10. A score of 8 is shown as 80 and every alert reads "High Risk" |
| Push body is empty | The push code reads `analysis.summary`, but `analysis` is a plain string, so the fallback text is always used |
| Hardcoded addresses | LAN IP `10.37.103.237` appears in the web and phone clients |
| `start.sh` paths | Absolute paths from the original author's machine |
| `SUSPICIOUS_WINDOW_SEC` unused | Defined in `constants.js`, never enforced, so `continue_analyzing` has no time limit |
| Test endpoints always on | See [SECURITY.md](SECURITY.md) |
| No tests for the decision path | Only the keyword matcher can be tested without hardware |

## Now

- Fix the known issues above.
- Add authentication and bind servers to localhost by default.
- Unit tests for `decisionEngine.js`, the keyword matcher and the audio engine.
- A single config file for hosts and ports shared by backend and clients.

## Next

- **Settings.** Sensitivity presets, quiet hours and custom keywords from the app.
- **Several recipients.** Notify more than one device or person.
- **Alert quality.** Mark an alert as wrong and use that to tune thresholds.
- **Analyze now.** A manual action for emergencies normal mode cannot sense,
  such as a silent fall.
- **Cap on repeated checks** while a situation stays ambiguous.
- **Upload log.** Show the user every time a clip left the device, and why.

## Later

- Multiple cameras and rooms.
- Pets and children aware tuning.
- More languages for keywords and speech recognition.
- Optional on device analysis so nothing needs to be uploaded.
- Integration with a real alert path (a trusted contact call, or emergency
  services) with explicit user consent.
- An evaluation set of labelled clips with published precision and recall.

## Not planned

- Continuous recording or cloud footage archives.
- Face recognition or identifying individuals.
- Using the system to monitor people who have not agreed to it.
  See [docs/ethics.md](docs/ethics.md).
