import { useThemeMode } from "@/lib/theme/useThemeMode";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { WritingStudio } from "@/patterns/writing-studio";
export function WritingStudioPage(_: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(false);
  return (
    <MotionConfig reducedMotion="user">
      <WritingStudio
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
      />
    </MotionConfig>
  );
}
