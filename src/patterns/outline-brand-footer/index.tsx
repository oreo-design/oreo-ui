import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useState } from "react";
import {
  OutlineWordmark,
  FooterLinkGroups,
} from "@/components/outline-wordmark";
import { IconButton, Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import "./page.css";
export function OutlineBrandFooter() {
  const [dark, setDark] = useThemeMode(true),
    [reset, setReset] = useState(0);
  return (
    <div className={dark ? "theme-dark" : ""}>
      <main className="obf-page">
        <header className="obf-header">
          <a href="/outline-wordmark">Oreo UI / Interaction studies</a>
          <IconButton
            type="tertiary"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </header>
        <h1 className="sr-only">Outline brand footer</h1>
        <footer className="obf-footer">
          <div className="obf-top">
            <div className="obf-brand">
              <a href="/button" aria-label="Oreo UI home">
                <OreoLogo className="h-6 w-9" />
                <span>Oreo UI</span>
              </a>
              <p>
                Small details. Lasting impressions.
                <br />
                Interfaces with a little more character.
              </p>
            </div>
            <FooterLinkGroups />
          </div>
          <div className="obf-note">
            <p>
              A collection of thoughtful components for the things you make.
              Adapt the colors, shape the interactions, and make every detail
              your own. Built to feel considered, from the first click to the
              final scroll.
            </p>
            <div className="obf-meta">
              <span>© 2026 Oreo UI. Made for the details.</span>
              <Button
                type="tertiary"
                size="sm"
                onClick={() => setReset((n) => n + 1)}
              >
                Clear highlights
              </Button>
            </div>
          </div>
          <OutlineWordmark resetKey={reset} />
          <div className="obf-caption">
            <span>Hover a letter · tap to hold · Esc to clear</span>
            <a
              href="https://x.com/uiinspoo/status/2112107576234295718"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by @creativestefan via uiinspoo ↗
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
