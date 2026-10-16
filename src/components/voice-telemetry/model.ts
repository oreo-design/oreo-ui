export type VoiceStage = {
  id: string;
  label: string;
  ms: number;
  tone: "neutral" | "blue" | "orange" | "purple" | "mint";
};
export type VoiceTurn = {
  id: number;
  caller: string;
  agent: string;
  duration: number;
  callerEnd: number;
  agentEnd: number;
  stages: VoiceStage[];
  callerSamples: number[];
  agentSamples: number[];
};
export type VoicePhase =
  | "ready"
  | "listening"
  | "processing"
  | "speaking"
  | "complete"
  | "interrupted";
export function validStages(stages: VoiceStage[]) {
  return (
    stages.length > 0 &&
    new Set(stages.map((s) => s.id)).size === stages.length &&
    stages.every((s) => s.id && Number.isSafeInteger(s.ms) && s.ms >= 0) &&
    Number.isSafeInteger(stages.reduce((a, s) => a + s.ms, 0))
  );
}
export const latency = (turn: VoiceTurn) =>
  turn.stages.reduce((a, s) => a + s.ms, 0);
export function validTurn(t: VoiceTurn) {
  return (
    Number.isSafeInteger(t.id) &&
    t.id > 0 &&
    validStages(t.stages) &&
    [t.duration, t.callerEnd, t.agentEnd].every(
      (n) => Number.isFinite(n) && n > 0,
    ) &&
    t.callerEnd + latency(t) < t.agentEnd &&
    t.agentEnd <= t.duration &&
    [t.callerSamples, t.agentSamples].every(
      (a) =>
        a.length > 0 &&
        a.length <= 512 &&
        a.every((n) => Number.isFinite(n) && n >= 0 && n <= 1),
    )
  );
}
export function phaseAt(
  t: VoiceTurn,
  position: number,
  interrupted = false,
): VoicePhase {
  if (interrupted) return "interrupted";
  if (position <= 0) return "ready";
  if (position >= t.duration) return "complete";
  if (position < t.callerEnd) return "listening";
  if (position < t.callerEnd + latency(t)) return "processing";
  if (position < t.agentEnd) return "speaking";
  return "complete";
}
export function percentile(values: number[], p: number) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[
    Math.max(0, Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1))
  ];
}
export function advance(position: number, elapsed: number, duration: number) {
  return Math.min(duration, Math.max(0, position) + Math.max(0, elapsed));
}
export function partialText(
  text: string,
  position: number,
  start: number,
  end: number,
) {
  return text.slice(
    0,
    Math.max(
      0,
      Math.min(
        text.length,
        Math.ceil(((position - start) / (end - start)) * text.length),
      ),
    ),
  );
}
