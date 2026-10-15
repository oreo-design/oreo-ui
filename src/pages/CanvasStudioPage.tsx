import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { CanvasStudio } from "@/patterns/canvas-studio";
export function CanvasStudioPage(_: { nav: DocsNav }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.classList.contains("theme-dark");
    root.classList.toggle("theme-dark", dark);
    return () => {
      root.classList.toggle("theme-dark", previous);
    };
  }, [dark]);
  return (
    <MotionConfig reducedMotion="user">
      <CanvasStudio
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
      />
    </MotionConfig>
  );
}
