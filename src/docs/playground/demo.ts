import type { Values } from "./schema";

export type DemoFrame = { at: number; label: string; values: Values };
export type Demo = { frames: DemoFrame[]; duration: number };
export type DemoStatus = "idle" | "playing" | "paused" | "complete";
type Clock = { now: () => number; later: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>; cancel: (timer: ReturnType<typeof setTimeout>) => void };
const clock: Clock = { now: () => performance.now(), later: (callback, delay) => setTimeout(callback, delay), cancel: timer => clearTimeout(timer) };

/** One pending timer; pause preserves the current dwell, and stop cancels ownership. */
export class DemoPlayer {
  private timer?: ReturnType<typeof setTimeout>;
  private elapsed = 0;
  private startedAt = 0;
  private cursor = 0;
  private status: DemoStatus = "idle";
  private demo: Demo;
  private frame: (frame: DemoFrame) => void;
  private change: (status: DemoStatus) => void;
  private time: Clock;
  constructor(demo: Demo, frame: (frame: DemoFrame) => void, change: (status: DemoStatus) => void, time = clock) {
    this.demo = demo; this.frame = frame; this.change = change; this.time = time;
  }
  play = () => {
    if (this.status === "playing") return;
    if (this.status !== "paused") { this.elapsed = 0; this.cursor = 0; }
    this.startedAt = this.time.now();
    this.status = "playing";
    this.change(this.status);
    this.tick();
  };
  pause = () => {
    if (this.status !== "playing") return;
    this.elapsed += this.time.now() - this.startedAt;
    this.cancel();
    this.status = "paused";
    this.change(this.status);
  };
  stop = () => { this.dispose(); this.status = "idle"; this.change(this.status); };
  replay = () => { this.stop(); this.play(); };
  dispose = () => { this.cancel(); };
  private cancel() { if (this.timer !== undefined) this.time.cancel(this.timer); this.timer = undefined; }
  private tick = () => {
    const elapsed = this.elapsed + this.time.now() - this.startedAt;
    while (this.cursor < this.demo.frames.length && this.demo.frames[this.cursor].at <= elapsed) this.frame(this.demo.frames[this.cursor++]);
    if (elapsed >= this.demo.duration) { this.status = "complete"; this.change(this.status); return; }
    const next = this.demo.frames[this.cursor]?.at ?? this.demo.duration;
    this.timer = this.time.later(this.tick, Math.max(0, next - elapsed));
  };
}
