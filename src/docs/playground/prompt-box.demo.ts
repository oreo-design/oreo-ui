import type { Demo, DemoFrame } from "./demo";

// New playground sequence, 2026-10-12. The earlier requested script could not
// be located in the repository/history; this is not a recovered original.
export function promptBoxDemo(reducedMotion: boolean): Demo {
  const prompt = "Help me turn this design brief into a working prototype.";
  const frames: DemoFrame[] = [
    { at: 0, label: "Ready", values: { value: "", running: false, attachments: false, keywords: false, voice: "mic", voiceStatus: "idle" } },
  ];
  if (reducedMotion) frames.push({ at: 800, label: "Prompt", values: { value: prompt } });
  else for (let i = 1; i <= prompt.length; i++) frames.push({ at: 800 + i * 40, label: "Typing", values: { value: prompt.slice(0, i) } });
  frames.push(
    { at: 3600, label: "Attachment", values: { attachments: true } },
    { at: 5000, label: "Keyword", values: { keywords: true } },
    { at: 6600, label: "Running", values: { running: true } },
    { at: 9000, label: "Ready for voice", values: { running: false, value: "", attachments: false, keywords: false, voice: "wave" } },
    { at: 10400, label: "Listening", values: { voiceStatus: "inputting" } },
    { at: 12800, label: "Thinking", values: { voiceStatus: "thinking" } },
    { at: 15100, label: "Voice complete", values: { voiceStatus: "idle", value: "Make the layout feel a little more spacious." } },
  );
  return { frames, duration: 17200 };
}
