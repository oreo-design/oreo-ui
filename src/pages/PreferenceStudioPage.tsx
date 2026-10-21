import { useThemeMode } from "@/lib/theme/useThemeMode";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { PreferenceStudio } from "@/patterns/preference-studio";
export function PreferenceStudioPage(_: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(false);
  return (
    <MotionConfig reducedMotion="user">
      <PreferenceStudio dark={dark} onDarkChange={setDark} />
    </MotionConfig>
  );
}
