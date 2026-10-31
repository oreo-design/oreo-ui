/** Family-owned preview adapters and local export bindings. */
import { VoiceSignal, VoiceLatencyBreakdown, TurnLatencyHistory } from "@/components/voice-telemetry";
import { VOICE_TURNS } from "@/patterns/voice-agent/data";
import { definePlayground as define, toggle, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"voice-signal":{...define("Voice Signal",{position:number(3800,0,8000,100),interrupted:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><VoiceSignal turn={VOICE_TURNS[11]} position={v.position} interrupted={v.interrupted} onSeek={n=>set("position",n)}/></div>),source:"voice-telemetry"},
"voice-latency-breakdown":{...define("Voice Latency Breakdown",{budget:number(800,200,1200,100),invalid:toggle(false)},v=><div className="w-full max-w-2xl p-6"><VoiceLatencyBreakdown stages={v.invalid?[{id:"bad",label:"Invalid",ms:-1,tone:"neutral"}]:VOICE_TURNS[11].stages} budget={v.budget} turnLabel="turn 12"/></div>),source:"voice-telemetry"},
"turn-latency-history":{...define("Turn Latency History",{selectedId:number(12,1,12,1),budget:number(800,200,1200,100),empty:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><TurnLatencyHistory turns={v.empty?[]:VOICE_TURNS} budget={v.budget} selectedId={v.selectedId} onSelect={n=>set("selectedId",n)}/></div>),source:"voice-telemetry"}
};
const exports = {
"voice-telemetry": { VoiceSignal, VoiceLatencyBreakdown, TurnLatencyHistory }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "voice-telemetry"; spec.exports = exports; }
export default playgrounds;
