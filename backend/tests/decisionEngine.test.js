import test from "node:test";
import assert from "node:assert/strict";

import { decide } from "../suspicious_mode/decisionEngine.js";
import {
  CONFIDENCE_ALERT_THRESHOLD,
  CONFIDENCE_NORMAL_THRESHOLD,
} from "../suspicious_mode/constants.js";

const payload = {
  analysis: "Two people shouting near the stove",
  spokenInstructions: "Check on them",
  videoBase64: "AAAA",
};

test("thresholds are ordered so the 'keep watching' band is non-empty", () => {
  assert.ok(CONFIDENCE_NORMAL_THRESHOLD < CONFIDENCE_ALERT_THRESHOLD);
});

test("sends an alert at exactly the alert threshold", () => {
  const result = decide({ confidence: CONFIDENCE_ALERT_THRESHOLD, ...payload });
  assert.equal(result.decision, "send_alert");
});

test("sends an alert above the alert threshold and keeps the full payload", () => {
  const result = decide({ confidence: 10, ...payload });
  assert.equal(result.decision, "send_alert");
  assert.equal(result.confidence, 10);
  assert.equal(result.analysis, payload.analysis);
  assert.equal(result.spokenInstructions, payload.spokenInstructions);
  assert.equal(result.videoBase64, payload.videoBase64);
});

test("keeps analyzing just below the alert threshold", () => {
  const result = decide({ confidence: CONFIDENCE_ALERT_THRESHOLD - 0.1, ...payload });
  assert.equal(result.decision, "continue_analyzing");
});

test("keeps analyzing at exactly the normal threshold", () => {
  const result = decide({ confidence: CONFIDENCE_NORMAL_THRESHOLD, ...payload });
  assert.equal(result.decision, "continue_analyzing");
});

test("returns to normal just below the normal threshold", () => {
  const result = decide({ confidence: CONFIDENCE_NORMAL_THRESHOLD - 0.1, ...payload });
  assert.equal(result.decision, "return_to_normal");
});

test("returns to normal at confidence 0 without leaking the video", () => {
  const result = decide({ confidence: 0, ...payload });
  assert.equal(result.decision, "return_to_normal");
  assert.equal(result.analysis, payload.analysis);
  assert.equal("videoBase64" in result, false, "video should not be passed along");
});

test("only 'send_alert' carries spoken instructions", () => {
  assert.ok("spokenInstructions" in decide({ confidence: 9, ...payload }));
  assert.equal("spokenInstructions" in decide({ confidence: 6, ...payload }), false);
  assert.equal("spokenInstructions" in decide({ confidence: 1, ...payload }), false);
});

test("documented thresholds: 8+ alerts, 4 to under 8 keeps watching, under 4 resets", () => {
  // These use literal numbers on purpose, so changing a threshold is a
  // deliberate, visible decision (see README: "score 8+" / "under 4").
  const decisionFor = (confidence) => decide({ confidence, ...payload }).decision;
  assert.equal(decisionFor(8), "send_alert");
  assert.equal(decisionFor(7.9), "continue_analyzing");
  assert.equal(decisionFor(4), "continue_analyzing");
  assert.equal(decisionFor(3.9), "return_to_normal");
});
