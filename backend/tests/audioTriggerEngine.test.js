import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_CONFIG,
  SENSITIVITY_PRESETS,
  calculateRms,
  computeConfidence,
  detectSpike,
  resolveConfig,
  rmsToDb,
} from "../normal_mode/audioTriggerEngine.js";

const close = (actual, expected, epsilon = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < epsilon, `expected ${actual} to be close to ${expected}`);

// ---- calculateRms ----------------------------------------------------

test("RMS of silence is 0", () => {
  assert.equal(calculateRms(new Float32Array(100)), 0);
});

test("RMS of a constant signal equals its amplitude", () => {
  close(calculateRms(new Float32Array(100).fill(0.5)), 0.5);
});

test("RMS ignores sign: a square wave of +/-0.25 has RMS 0.25", () => {
  const samples = Float32Array.from({ length: 100 }, (_, i) => (i % 2 ? 0.25 : -0.25));
  close(calculateRms(samples), 0.25);
});

// ---- rmsToDb ---------------------------------------------------------

test("full-scale RMS is 0 dB", () => {
  close(rmsToDb(1), 0);
});

test("an RMS of 0.1 is -20 dB", () => {
  close(rmsToDb(0.1), -20);
});

test("zero RMS maps to the floor instead of -Infinity", () => {
  assert.equal(rmsToDb(0), DEFAULT_CONFIG.DB_FLOOR);
});

test("very quiet input is clamped to the floor and loud input to 0 dB", () => {
  assert.equal(rmsToDb(1e-12), DEFAULT_CONFIG.DB_FLOOR);
  assert.equal(rmsToDb(10), 0);
});

test("a custom floor is respected", () => {
  assert.equal(rmsToDb(0, -60), -60);
});

// ---- detectSpike -----------------------------------------------------

test("no spike when the rise is under the threshold", () => {
  const { isSpiking, spikeAmountDb } = detectSpike(-30, -50); // +20 dB < 37
  assert.equal(isSpiking, false);
  assert.equal(spikeAmountDb, 20);
});

test("spikes at exactly the threshold when the sound is loud enough", () => {
  const { isSpiking } = detectSpike(-23, -60); // +37 dB, above the loudness floor
  assert.equal(isSpiking, true);
});

test("ignores a big relative jump that is still quiet in absolute terms", () => {
  // +50 dB over baseline, but -50 dB is below the -45 dB floor.
  assert.equal(detectSpike(-50, -100).isSpiking, false);
});

test("a more sensitive preset spikes on a smaller rise", () => {
  const high = resolveConfig({ sensitivityPreset: "high" });
  assert.equal(detectSpike(-30, -50, DEFAULT_CONFIG).isSpiking, false);
  assert.equal(detectSpike(-30, -50, high).isSpiking, true);
});

// ---- computeConfidence -----------------------------------------------

test("confidence always stays between 0 and 1", () => {
  const extremes = [-200, -100, 0, 100, 1000];
  for (const amount of extremes) {
    for (const duration of [0, 500, 5000, 1e6]) {
      for (const db of [-100, -45, 0]) {
        const c = computeConfidence(amount, duration, db);
        assert.ok(c >= 0 && c <= 1, `out of range: ${c}`);
      }
    }
  }
});

test("a huge, long, loud spike reaches full confidence", () => {
  close(computeConfidence(DEFAULT_CONFIG.SPIKE_THRESHOLD_DB + 30, 1500, 0), 1);
});

test("a spike right at the threshold, instant and quiet, has near-zero confidence", () => {
  const c = computeConfidence(DEFAULT_CONFIG.SPIKE_THRESHOLD_DB, 0, DEFAULT_CONFIG.MIN_LOUDNESS_FLOOR_DB);
  close(c, 0);
});

test("confidence grows with spike size, duration, and loudness", () => {
  const base = computeConfidence(40, 300, -30);
  assert.ok(computeConfidence(55, 300, -30) > base, "bigger spike");
  assert.ok(computeConfidence(40, 1200, -30) > base, "longer spike");
  assert.ok(computeConfidence(40, 300, -10) > base, "louder peak");
});

// ---- resolveConfig ---------------------------------------------------

test("defaults to the least sensitive ('low') preset", () => {
  const config = resolveConfig();
  assert.equal(config.SPIKE_THRESHOLD_DB, SENSITIVITY_PRESETS.low.SPIKE_THRESHOLD_DB);
  assert.equal(config.SPIKE_THRESHOLD_DB, DEFAULT_CONFIG.SPIKE_THRESHOLD_DB);
});

test("presets get progressively easier to trigger", () => {
  const { high, medium, low } = SENSITIVITY_PRESETS;
  assert.ok(high.SPIKE_THRESHOLD_DB < medium.SPIKE_THRESHOLD_DB);
  assert.ok(medium.SPIKE_THRESHOLD_DB < low.SPIKE_THRESHOLD_DB);
});

test("a named preset overrides the defaults it defines", () => {
  assert.equal(resolveConfig({ sensitivityPreset: "high" }).SPIKE_THRESHOLD_DB, 18);
});

test("accepts camelCase and UPPER_SNAKE overrides on top of a preset", () => {
  const config = resolveConfig({
    sensitivityPreset: "medium",
    spikeThresholdDb: 30,
    COOLDOWN_MS: 1234,
  });
  assert.equal(config.SPIKE_THRESHOLD_DB, 30);
  assert.equal(config.COOLDOWN_MS, 1234);
});

test("ignores callbacks and unknown keys instead of polluting the config", () => {
  const config = resolveConfig({ onTrigger: () => {}, notAThing: 1 });
  assert.equal("onTrigger" in config, false);
  assert.equal("notAThing" in config, false);
});

test("an unknown preset name falls back to the defaults", () => {
  const config = resolveConfig({ sensitivityPreset: "extreme" });
  assert.deepEqual(config, DEFAULT_CONFIG);
});
