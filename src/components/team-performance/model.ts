export type ReviewState = "Completed" | "Pending" | "Overdue";
export type MemberPerformance = {
  id: string;
  name: string;
  role: string;
  department: string;
  score: number;
  previous: number;
  goals: number;
  goalsDone: number;
  review: ReviewState;
  lastReview: string | null;
  note: string;
};
export type PerformanceSort = {
  key: "name" | "score" | "change";
  direction: "asc" | "desc";
};
export function scoreBand(score: number) {
  return !Number.isFinite(score) || score < 0 || score > 100
    ? { label: "Unavailable", color: "default" as const }
    : score >= 90
      ? { label: "Excellent", color: "mint" as const }
      : score >= 80
        ? { label: "Good", color: "blue" as const }
        : score >= 70
          ? { label: "Developing", color: "orange" as const }
          : { label: "Needs attention", color: "pink" as const };
}
export function reviewCounts(rows: MemberPerformance[]) {
  return rows.reduce(
    (sum, m) => {
      sum[m.review]++;
      return sum;
    },
    { Completed: 0, Pending: 0, Overdue: 0 },
  );
}
export function performanceSummary(rows: MemberPerformance[]) {
  const count = rows.length,
    goals = rows.reduce((s, m) => s + m.goals, 0),
    done = rows.reduce((s, m) => s + m.goalsDone, 0);
  return {
    count,
    average: count ? rows.reduce((s, m) => s + m.score, 0) / count : null,
    delta: count
      ? rows.reduce((s, m) => s + m.score - m.previous, 0) / count
      : null,
    top: rows.filter((m) => m.score >= 90).length,
    attention: rows.filter((m) => m.score < 70).length,
    goals,
    done,
    achievement: goals ? (100 * done) / goals : null,
  };
}
export function performanceRows(
  rows: MemberPerformance[],
  query: string,
  department: string,
  review: string,
  sort: PerformanceSort,
) {
  return rows
    .filter(
      (m) =>
        (department === "All departments" || m.department === department) &&
        (review === "All reviews" || m.review === review) &&
        `${m.name} ${m.role} ${m.department}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => {
      const x =
        sort.key === "name"
          ? a.name.localeCompare(b.name)
          : sort.key === "score"
            ? a.score - b.score
            : a.score - a.previous - (b.score - b.previous);
      return (sort.direction === "asc" ? x : -x) || a.id.localeCompare(b.id);
    });
}
export function validatePerformance(
  score: string,
  done: string,
  total: number,
  note: string,
) {
  if (!/^\d{1,3}(\.\d)?$/.test(score) || Number(score) > 100)
    return "Enter a score from 0 to 100, with at most one decimal place.";
  if (!/^\d+$/.test(done) || Number(done) > total)
    return `Completed goals must be a whole number from 0 to ${total}.`;
  if (note.trim().length > 500)
    return "Keep the review note within 500 characters.";
  return "";
}
export function performanceCSV(rows: MemberPerformance[]) {
  const cell = (v: string | number) =>
    '"' +
    String(v)
      .replace(/^[=+@\-\t\r]/, "'$&")
      .replace(/"/g, '""') +
    '"';
  return [
    [
      "Name",
      "Role",
      "Department",
      "Score",
      "Change (points)",
      "Review",
      "Last review",
      "Goals completed",
      "Goals total",
      "Note",
    ],
    ...rows.map((m) => [
      m.name,
      m.role,
      m.department,
      m.score,
      m.score - m.previous,
      m.review,
      m.lastReview ?? "",
      m.goalsDone,
      m.goals,
      m.note,
    ]),
  ]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
}
