import { useThemeMode } from "@/lib/theme/useThemeMode";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { CanvasStudio } from "@/patterns/canvas-studio";
export function CanvasStudioPage(_: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(false);
  return (
    <MotionConfig reducedMotion="user">
      <CanvasStudio
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
      />
    </MotionConfig>
  );
}
