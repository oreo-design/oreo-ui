import { useThemeMode } from "@/lib/theme/useThemeMode";
import { AuroraAccordion } from "@/components/aurora-accordion";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import "./page.css";
export function AuroraFaq() {
  const [dark, setDark] = useThemeMode(true);
  return (
    <div className={dark ? "theme-dark" : ""}>
      <main className="aurora-faq">
        <header className="aurora-faq-header">
          <a href="/aurora-accordion">Oreo UI / Interaction studies</a>
          <IconButton
            type="tertiary"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </header>
        <section
          className="aurora-faq-stage"
          aria-labelledby="aurora-faq-title"
        >
          <div className="aurora-faq-intro">
            <span className="text-xs text-text-tertiary">A LITTLE CLARITY</span>
            <h1 id="aurora-faq-title">
              Good questions.
              <br />
              Thoughtful answers.
            </h1>
            <p>A few things to know before we make something together.</p>
          </div>
          <AuroraAccordion />
          <p className="aurora-faq-note">
            Curious about the details?{" "}
            <a href="/aurora-accordion">Explore the component ↗</a>
          </p>
        </section>
        <footer className="aurora-faq-footer">
          <span>Oreo Studio · Design with intention.</span>
          <a
            href="https://x.com/CollectUI/status/2112000783440814422"
            target="_blank"
            rel="noreferrer"
          >
            Inspired by @stevelauda_ via CollectUI ↗
          </a>
        </footer>
      </main>
    </div>
  );
}
