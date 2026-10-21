import { useThemeMode } from "@/lib/theme/useThemeMode";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { MeetingPlanner } from "@/patterns/meeting-planner";
export function MeetingPlannerPage(_: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(false);
  return (
    <MotionConfig reducedMotion="user">
      <MeetingPlanner
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
      />
    </MotionConfig>
  );
}
