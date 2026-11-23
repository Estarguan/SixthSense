import test from "node:test";
import assert from "node:assert/strict";

import { detectKeywordTrigger, KEYWORDS } from "../normal_mode/keywordTriggerEngine.js";

test("does not trigger on an ordinary sentence", () => {
  const result = detectKeywordTrigger("what should we make for dinner tonight");
  assert.equal(result.matched, false);
  assert.equal(result.mode, "normal");
  assert.deepEqual(result.matches, []);
});

test("triggers on a single distress phrase", () => {
  const result = detectKeywordTrigger("help");
  assert.equal(result.matched, true);
  assert.equal(result.mode, "suspicious");
  assert.equal(result.category, "distress");
});

test("matching ignores case and surrounding punctuation", () => {
  const result = detectKeywordTrigger("HELP!!! Somebody...");
  assert.equal(result.matched, true);
  assert.equal(result.phrase, "help");
});

test("handles apostrophes whether or not speech-to-text keeps them", () => {
  for (const text of ["I'm scared", "im scared", "I’m scared"]) {
    const result = detectKeywordTrigger(text);
    assert.equal(result.matched, true, `should match: ${text}`);
    assert.equal(result.category, "distress");
  }
});

test("categorizes boundary and threat phrases", () => {
  assert.equal(detectKeywordTrigger("don't touch me").category, "boundary");
  assert.equal(detectKeywordTrigger("dont touch me").category, "boundary");
  assert.equal(detectKeywordTrigger("I will kill you").category, "threat");
});

test("collapses overlapping variants into a single match", () => {
  // "ill hurt you" is contained in "i will hurt you"; only one should be reported.
  const result = detectKeywordTrigger("I will hurt you");
  assert.equal(result.matches.length, 1);
  assert.equal(result.phrase, "i will hurt you");
});

test("reports every distinct phrase in one transcript", () => {
  const result = detectKeywordTrigger("leave me alone, I'm scared, help");
  const phrases = result.matches.map((m) => m.phrase).sort();
  assert.deepEqual(phrases, ["help", "i'm scared", "leave me alone"]);
  assert.ok(phrases.includes(result.phrase), "headline phrase is one of the matches");
});

test("echoes the original transcript back", () => {
  const transcript = "Please HELP me";
  assert.equal(detectKeywordTrigger(transcript).transcript, transcript);
});

test("is safe on empty, missing and null input", () => {
  for (const input of ["", "   ", undefined, null]) {
    const result = detectKeywordTrigger(input);
    assert.equal(result.matched, false);
    assert.equal(result.mode, "normal");
  }
});

test("every flagged phrase has a category and triggers itself", () => {
  for (const { phrase, category } of KEYWORDS) {
    assert.ok(category, `missing category for: ${phrase}`);
    assert.equal(detectKeywordTrigger(phrase).matched, true, `should trigger: ${phrase}`);
  }
});

test(
  "does not trigger on words that merely contain a keyword",
  { todo: "known limitation: matching is substring-based, so 'helpful' matches 'help'" },
  () => {
    assert.equal(detectKeywordTrigger("that was really helpful").matched, false);
  },
);
