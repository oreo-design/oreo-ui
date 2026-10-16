import type {
  MixComment,
  MixVersion,
  ProductionTask,
} from "@/components/music-project";
export const MIX_SOURCE = "/examples/music-workspace/mix-demo.wav";
export const MIX_VERSIONS: MixVersion[] = [4, 3, 2, 1].map((n, i) => ({
  id: `v${n}`,
  title: `Mix v${n}`,
  author: i % 2 ? "Allagi" : "Kai Hoshino",
  date: ["Oct 16", "Oct 14", "Oct 12", "Oct 10"][i],
  duration: 238,
  src: MIX_SOURCE,
  note: [
    "Low-end balance and final automation",
    "Arrangement and transitions",
    "Vocal layers and texture",
    "First arrangement sketch",
  ][i],
}));
// Illustrated envelope, not an analysis of the audio. All seeded versions reuse the existing synthesized demo.
export const MIX_SAMPLES = Array.from(
  { length: 180 },
  (_, i) =>
    0.12 +
    Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.43)) * 0.64 +
    (i > 40 && i < 55 ? 0.2 : 0),
);
export const MIX_COMMENTS: MixComment[] = [
  {
    id: "c1",
    versionId: "v4",
    author: "Kai Hoshino",
    seconds: 64,
    text: "The low end feels much cleaner here. Keep this balance.",
    resolved: false,
  },
  {
    id: "c2",
    versionId: "v4",
    author: "Maya Chen",
    seconds: 116,
    text: "Could we leave a little more space before the drop?",
    resolved: false,
  },
];
const child = (id: string, title: string, done = false): ProductionTask => ({
  id,
  title,
  done,
  assignee: "Kai Hoshino",
  due: "Oct 20",
});
export const MIX_TASKS: ProductionTask[] = [
  {
    id: "t1",
    title: "Fix low-end clash with the kick",
    done: false,
    assignee: "Maya Chen",
    due: "Oct 17",
  },
  {
    id: "t2",
    title: "Tighten breakdown transition at",
    seconds: 112,
    versionId: "v4",
    done: false,
    assignee: "Allagi",
    due: "Oct 19",
  },
  {
    id: "t3",
    title: "Bounce stems for mastering",
    done: false,
    assignee: "Kai Hoshino",
    due: "Oct 20",
    children: [
      child("s1", "Drums stem", true),
      child("s2", "Bass stem", true),
      child("s3", "Vocals stem"),
      child("s4", "FX + pads stem"),
    ],
  },
  {
    id: "t4",
    title: "Approve Mix v4 for release",
    done: false,
    assignee: "Ravi Shah",
    due: "Oct 22",
  },
  {
    id: "t5",
    title: "Prepare artwork and track credits",
    done: false,
    assignee: "Maya Chen",
    due: "Oct 23",
  },
  {
    id: "t6",
    title: "Confirm arrangement",
    done: true,
    assignee: "Allagi",
    due: "Oct 15",
  },
];
