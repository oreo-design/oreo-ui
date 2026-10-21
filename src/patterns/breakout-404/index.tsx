import { useThemeMode } from "@/lib/theme/useThemeMode";
import {
  BreakoutNavigator,
  RecoveryMessage,
} from "@/components/breakout-navigation";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import "./page.css";
export function Breakout404Page() {
  const [dark, setDark] = useThemeMode(false);
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="bn-page">
        <header className="bn-page-header">
          <a href="/button" aria-label="Oreo UI home">
            <OreoLogo className="h-5 w-8" />
            <span>Oreo UI</span>
          </a>
          <IconButton
            type="tertiary"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </header>
        <main className="bn-page-main">
          <BreakoutNavigator />
          <RecoveryMessage />
        </main>
        <footer className="bn-page-footer">
          <a href="/breakout-navigator">Components & API</a>
          <span>
            Inspired by{" "}
            <a
              href="https://x.com/abhisek_im/status/2112015149569888373"
              target="_blank"
              rel="noreferrer"
            >
              Abhisek Mishra ↗
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
