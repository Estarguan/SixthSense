# Contributing

Thanks for helping. Sixth Sense is a privacy first home safety project, so a few
extra principles apply beyond normal good practice.

## Ground rules

1. **Normal mode stays local.** No cloud call, no storage of audio, video or
   transcripts. A change that breaks this needs a very strong reason.
2. **Escalate, don't alert.** Cheap detectors only trigger suspicious mode. Alerts
   come from the decision engine.
3. **Be honest about limits.** If a change adds a failure mode, document it in
   `docs/cases/false-positives-and-negatives.md`.
4. **No secrets in git.** Use `backend/.env`, copied from `backend/.env.example`.

## Getting started

Follow [docs/setup.md](docs/setup.md). Read
[docs/architecture.md](docs/architecture.md) for how the pieces fit.

## Where things live

| Area | Path |
| --- | --- |
| Motion, audio and keyword triggers | `backend/normal_mode/` |
| Gemini analysis and decisions | `backend/suspicious_mode/` |
| Alerts and server | `backend/analyzeServer.js`, `backend/services/` |
| Web dashboard | `web_sense/` |
| Phone app | `app_sense/` |

## Making a change

1. Branch from `main`, for example `feat/pet-filter` or `fix/push-score`.
2. Keep changes focused, one concern per pull request.
3. Run what exists: `npm run lint` in `web_sense`, and exercise the keyword
   matcher without a mic as shown in `backend/normal_mode/KEYWORDS.md`.
4. Update docs if behaviour, endpoints, thresholds or data flows change.
5. Describe what you changed, why, and how you tested it.

## Commit messages

Short imperative subject, for example `Fix confidence scale in push alert`.
Explain the why in the body when it is not obvious.

## Good first contributions

See [ROADMAP.md](ROADMAP.md), especially the known issues list.

## Security and privacy issues

Do not open a public issue. Follow [SECURITY.md](SECURITY.md).
