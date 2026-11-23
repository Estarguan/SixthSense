# Case documents

Each case walks one scenario through the system: what triggers normal mode,
what Gemini is asked, what the decision engine does, and what the user
experiences. They show intended behaviour; where it depends on tuning or has a
known gap, the case says so.

Decision rule used throughout (see `backend/suspicious_mode/decisionEngine.js`):

| Gemini score | Decision |
| --- | --- |
| 8 to 10 | `send_alert` |
| 4 to 7 | `continue_analyzing` |
| 0 to 3 | `return_to_normal` |

| # | Case | Expected outcome |
| --- | --- | --- |
| 1 | [Choking](01-choking.md) | Alert and spoken first aid |
| 2 | [Real verbal and physical conflict](02-real-conflict.md) | Alert |
| 3 | [Fire or smoke](03-fire-smoke.md) | Alert and spoken guidance |
| 4 | [Play fighting](04-play-fighting.md) | No alert (false positive avoided) |
| 5 | [TV, music or a party](05-loud-but-harmless.md) | No analysis at all |
| 6 | [Ambiguous argument](06-ambiguous-argument.md) | Keeps watching |
| 7 | [Where it can be wrong](false-positives-and-negatives.md) | Known failure modes |

## Template for a new case

```
# Case N: <name>
**Persona:** who is at home
**What happens:** the real world event
**Normal mode:** which detector fires and why
**Suspicious mode:** what Gemini sees, likely score
**Outcome:** decision, alert, voice
**Risks:** how this could go wrong
```
