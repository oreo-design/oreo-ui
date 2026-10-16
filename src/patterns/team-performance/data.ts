import type { MemberPerformance } from "@/components/team-performance";
export const PERIODS = ["2026-09", "2026-08"] as const;
export const periodLabel = (period: string) =>
  period === "2026-09" ? "September 2026" : "August 2026";
const people = [
  ["Olivia Rivers", "Product Designer", "Design", 94, 88, 5, 5, "Completed"],
  ["Tony Park", "Software Engineer", "Engineering", 91, 87, 6, 5, "Completed"],
  ["Amira Grant", "UX Designer", "Design", 88, 86, 5, 4, "Completed"],
  [
    "Yuki Minami",
    "Marketing Specialist",
    "Marketing",
    84,
    77,
    4,
    4,
    "Completed",
  ],
  ["Peter King", "Data Analyst", "Analytics", 76, 79, 6, 4, "Pending"],
  ["Scott Singh", "Security Engineer", "Engineering", 72, 71, 5, 3, "Overdue"],
  ["Ivan Reed", "Software Engineer", "Engineering", 54, 59, 5, 2, "Overdue"],
  ["Leah Morgan", "Brand Designer", "Design", 93, 90, 4, 4, "Completed"],
  ["Noah Brooks", "Growth Lead", "Marketing", 86, 84, 5, 4, "Pending"],
  ["Maya Chen", "Data Scientist", "Analytics", 90, 86, 6, 5, "Completed"],
  ["Alex Torres", "Product Manager", "Product", 82, 80, 5, 4, "Pending"],
  ["Sam Taylor", "Researcher", "Product", 68, 72, 4, 2, "Pending"],
] as const;
export function makePerformanceData(): Record<string, MemberPerformance[]> {
  return Object.fromEntries(
    PERIODS.map((period, p) => [
      period,
      people.map(
        (
          [name, role, department, score, previous, goals, done, review],
          i,
        ) => ({
          id: `member-${i + 1}`,
          name,
          role,
          department,
          score: p ? previous : score,
          previous: p ? Math.max(0, previous - 3) : previous,
          goals,
          goalsDone: p ? Math.max(0, done - 1) : done,
          review: p ? "Completed" : review,
          lastReview: p
            ? `2026-08-${String(28 - i).padStart(2, "0")}`
            : review === "Completed"
              ? `2026-09-${String(24 - i).padStart(2, "0")}`
              : `2026-08-${String(28 - i).padStart(2, "0")}`,
          note: "",
        }),
      ),
    ]),
  );
}
export const PERFORMANCE_MEMBERS = makePerformanceData()["2026-09"];
