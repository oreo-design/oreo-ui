import type { VoiceTurn, VoiceStage } from "@/components/voice-telemetry/model";
const totals = [642, 706, 664, 599, 868, 670, 701, 610, 645, 864, 587, 621];
const dialogue = [
  [
    "My webhook requests keep failing.",
    "Let’s check the latest response code and endpoint configuration.",
  ],
  [
    "The endpoint returns a 401.",
    "That usually means the signing secret no longer matches.",
  ],
  [
    "We rotated the key this morning.",
    "Update the endpoint with the current signing secret.",
  ],
  [
    "Will old events be retried?",
    "You can replay failed events after the connection is healthy.",
  ],
  [
    "Can we check a test event first?",
    "Yes. Use a test event before retrying the failed deliveries.",
  ],
  [
    "I have updated the secret now.",
    "Check that the endpoint returns a successful status.",
  ],
  [
    "The test delivery looks good.",
    "The connection is ready. Next, select a small replay batch.",
  ],
  [
    "Please start with ten events.",
    "Review the ten selected events before submitting the replay.",
  ],
  [
    "What happens if they fail again?",
    "Keep the failure logs and verify the endpoint response.",
  ],
  [
    "Can we alert the on-call team?",
    "Configure a failure alert in your notification settings.",
  ],
  [
    "Please replay them once our deploy has finished.",
    "Sure. Keep the replay paused until the deployment is ready.",
  ],
  [
    "Okay, the deployment is complete.",
    "You can now review and replay the selected events.",
  ],
];
const tones: VoiceStage["tone"][] = [
  "neutral",
  "blue",
  "orange",
  "purple",
  "mint",
];
export const VOICE_TURNS: VoiceTurn[] = totals.map((total, i) => {
  const fixed = [
    180 + (i % 4) * 5,
    60 + (i % 3) * 2,
    0,
    110 + (i % 4),
    45 + (i % 2),
  ];
  fixed[2] = total - fixed.reduce((a, b) => a + b, 0);
  const stages = fixed.map((ms, j) => ({
    id: ["endpoint", "stt", "llm", "tts", "network"][j],
    label: ["Endpoint", "STT", "LLM TTFT", "TTS TTFB", "Network"][j],
    ms,
    tone: tones[j],
  }));
  const samples = (start: number, end: number) =>
    Array.from({ length: 80 }, (_, k) => {
      const t = k * 100;
      return t >= start && t <= end
        ? 0.14 +
            Math.abs(Math.sin(k * 1.73 + i) * Math.cos(k * 0.41 + i)) * 0.82
        : 0;
    });
  return {
    id: i + 1,
    caller: dialogue[i][0],
    agent: dialogue[i][1],
    duration: 8000,
    callerEnd: 2700,
    agentEnd: 7400,
    stages,
    callerSamples: samples(200, 2700),
    agentSamples: samples(2700 + total, 7400),
  };
});
