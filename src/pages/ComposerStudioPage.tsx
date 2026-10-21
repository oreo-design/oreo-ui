import { useThemeMode } from "@/lib/theme/useThemeMode";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { ComposerStudio } from "@/patterns/composer-studio";
export function ComposerStudioPage(_: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(false);
  return (
    <MotionConfig reducedMotion="user">
      <ComposerStudio
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
      />
    </MotionConfig>
  );
}
