# Where it can be wrong

A safety system that only lists successes is not credible. These are the known
failure modes and what limits them.

## False positives (alert when nothing is wrong)

| Source | Why it happens | Current mitigation | Gap |
| --- | --- | --- | --- |
| Pets | Fast motion, barking, crashes | Two stage design, Gemini sees context | No pet specific tuning |
| TV or phone speaking a keyword | Offline STT hears a speaker as a person | Gemini should score a calm room low | The clip is still uploaded |
| Staged or theatrical conflict | Looks like harm | Prompt separates consent and play | Dependent on model judgement |
| Children playing loudly | Shrieking, running | Same as above | Could alert caregivers often |
| Dropped or slammed objects | One off loud spike | Cooldown, baseline | Single spikes still escalate |

## False negatives (no alert when something is wrong)

| Source | Why it happens | Gap |
| --- | --- | --- |
| Silent emergencies (fall, stroke) | Little sound or fast motion | Nothing triggers normal mode |
| Slow harm, coercion | No spike to detect | Spike detectors only see sudden change |
| Camera angle | Person out of frame | Only one camera is supported |
| Muffled speech | Vosk small model, background noise | Keywords may be missed |
| Models miss things | Gemini is a probabilistic judge | A low score is not proof of safety |
| Service outage | Gemini or the network is down | Analysis fails and no alert is produced |

## Other limits

- **Language.** Keywords and the Vosk model are English only.
- **Latency.** Recording, upload and analysis take seconds, not instants.
- **No emergency dispatch.** The system alerts people, it does not call anyone.
- **Not a smoke alarm or medical device.** Do not rely on it as one.

## How to improve

- Collect labelled test clips per case and report precision and recall.
- Add a manual "analyze now" action for situations normal mode cannot sense.
- Let users review and mark alerts as wrong, to tune thresholds.
