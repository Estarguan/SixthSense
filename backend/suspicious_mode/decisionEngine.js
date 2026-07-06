import {
  CONFIDENCE_ALERT_THRESHOLD,
  CONFIDENCE_NORMAL_THRESHOLD,
} from "./constants.js";

const CHOKING_PATTERN = /\bchok(e|ed|ing|es)?\b/i;

export function decide({ confidence, analysis, spokenInstructions, videoBase64 }) {
  // Choking is always an immediate alert regardless of confidence score
  // if (CHOKING_PATTERN.test(analysis)) {
  //   return {
  //     decision: "send_alert",
  //     confidence: 10,
  //     analysis,
  //     spokenInstructions,
  //     videoBase64,
  //   };
  // }

  if (confidence >= CONFIDENCE_ALERT_THRESHOLD) {
    return {
      decision: "send_alert",
      confidence,
      analysis,
      spokenInstructions,
      videoBase64,
    };
  }

  if (confidence < CONFIDENCE_NORMAL_THRESHOLD) {
    return { decision: "return_to_normal", confidence, analysis };
  }

  return { decision: "continue_analyzing", confidence, analysis };
}
