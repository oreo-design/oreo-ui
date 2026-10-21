import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { OreoLogo } from "@/docs/OreoLogo";
import { BrandSwatch } from "@/components/brand-swatch";
import { TypeScale, typeScaleCSS } from "@/components/type-scale";
import {
  EmailSignature,
  SAMPLE_SIGNATURE,
  signatureHTML,
  signatureText,
  type SignatureData,
} from "@/components/email-signature";
import { AgentWorkspaceState } from "@/components/automation";
import { SECTIONS, RULES, COLOURS, VOICE } from "./data";
import "./brand-guide.css";
export function BrandGuide() {
  const [dark, setDark] = useThemeMode(false),
    [query, setQuery] = useState(""),
    [active, setActive] = useState("start"),
    [base, setBase] = useState(16),
    [ratio, setRatio] = useState(1.25),
    [sample, setSample] = useState("");
  const [logo, setLogo] = useState("ink"),
    [signature, setSignature] = useState<SignatureData>(SAMPLE_SIGNATURE),
    [client, setClient] = useState("Gmail"),
    [notice, setNotice] = useState(""),
    [fallback, setFallback] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const manualCopy = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (fallback) {
      manualCopy.current?.focus();
      manualCopy.current?.select();
    }
  }, [fallback]);
  const matches = SECTIONS.filter((s) =>
    `${s.label} ${s.keywords}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        search.current?.focus();
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (first) setActive(first.target.id.replace("brand-", ""));
      },
      { rootMargin: "-10% 0px -65% 0px", threshold: 0 },
    );
    document
      .querySelectorAll(".bg-section")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [query]);
  async function copy(value: string, label: string, html?: string) {
    setFallback("");
    try {
      if (html && typeof ClipboardItem === "undefined")
        throw new Error("Rich clipboard unavailable");
      if (html)
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([value], { type: "text/plain" }),
          }),
        ]);
      else await navigator.clipboard.writeText(value);
      setNotice(`${label} copied.`);
    } catch {
      setFallback(value);
      setNotice("Clipboard unavailable. Select and copy the text below.");
    }
  }
  function download(name: string, content: string, type: string) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`${name} downloaded.`);
  }
  function go(id: string) {
    setActive(id);
    requestAnimationFrame(() =>
      document
        .getElementById(`brand-${id}`)
        ?.scrollIntoView({ block: "start" }),
    );
  }
  function section(
    id: string,
    kicker: string,
    title: string,
    description: string,
    children: ReactNode,
  ) {
    return matches.some((s) => s.id === id) ? (
      <section
        id={`brand-${id}`}
        className="bg-section"
        aria-labelledby={`heading-${id}`}
      >
        <p className="bg-eyebrow">{kicker}</p>
        <h2 id={`heading-${id}`}>{title}</h2>
        <p className="bg-description">{description}</p>
        {children}
      </section>
    ) : null;
  }
  const rulesText = RULES.map((r, i) => `${i + 1}. ${r.title} ${r.text}`).join(
    "\n",
  );
  function guide() {
    download(
      "oreo-brand-guide.json",
      JSON.stringify(
        {
          brand: "Oreo Studio",
          version: "1.0",
          rules: RULES,
          colours: COLOURS,
          typography: {
            family: "Inter",
            base,
            ratio,
            css: typeScaleCSS(base, ratio),
          },
          signature: { ...signature, html: signatureHTML(signature) },
        },
        null,
        2,
      ),
      "application/json",
    );
  }
  return (
    <div className={`brand-guide ${dark ? "theme-dark" : ""}`}>
      <header className="bg-top">
        <a href="/brand-guide" className="bg-wordmark">
          <OreoLogo />
          oreo<span>studio</span>
        </a>
        <div>
          <span className="bg-updated">Edition 01 · October 2026</span>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            leadingIcon={<Icon name="link" size="sm" />}
            onClick={() => copy(`${location.origin}/brand-guide`, "Guide link")}
          >
            Copy guide link
          </Button>
        </div>
      </header>
      <div className="bg-layout">
        <aside className="bg-sidebar">
          <div>
            <Tag>THE BRAND, IN ONE PLACE</Tag>
            <h1>
              Good work.
              <br />
              One shared language.
            </h1>
            <p>
              Everything you need to make something feel like Oreo. Built for
              the whole team.
            </p>
          </div>
          <label className="bg-search">
            <Icon name="search" size="sm" />
            <input
              ref={search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a section…"
              aria-label="Find a section"
            />
            <kbd>⌘K</kbd>
          </label>
          <nav aria-label="Brand sections">
            {matches.map((s) => (
              <button
                type="button"
                key={s.id}
                aria-current={active === s.id ? "location" : undefined}
                onClick={() => go(s.id)}
              >
                {s.label}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </nav>
          <label className="bg-mobile-select">
            Jump to
            <select
              value={
                matches.some((s) => s.id === active)
                  ? active
                  : (matches[0]?.id ?? "")
              }
              onChange={(e) => go(e.target.value)}
            >
              {matches.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="secondary"
            tapScale={1}
            leadingIcon={<Icon name="arrow-down" size="sm" />}
            onClick={guide}
          >
            Download guide
          </Button>
          <small className="bg-side-note">
            A local brand kit demo.
            <br />
            Your edits reset on reload.
          </small>
        </aside>
        <main className="bg-main">
          <div className="bg-feedback" role="status">
            {notice}
          </div>
          {fallback && (
            <div className="bg-copy-fallback">
              <label>
                Copy manually
                <textarea
                  ref={manualCopy}
                  readOnly
                  value={fallback}
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <Button
                type="tertiary"
                tapScale={1}
                onClick={() => setFallback("")}
              >
                Dismiss
              </Button>
            </div>
          )}
          {!matches.length && (
            <div className="bg-empty">
              <AgentWorkspaceState
                title="No matching sections"
                description="Try logo, colour, type, or signature."
              />
              <Button
                type="secondary"
                tapScale={1}
                onClick={() => setQuery("")}
              >
                Clear search
              </Button>
            </div>
          )}
          {section(
            "start",
            "01 / START HERE",
            "A few rules. A lot of possibility.",
            "You don’t need to be a designer to use the brand well. Start with these five things.",
            <>
              <div className="bg-rules">
                {RULES.map((r, i) => (
                  <article key={r.title}>
                    <span>0{i + 1}</span>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                  </article>
                ))}
              </div>
              <div className="bg-rule-footer">
                <p>
                  Working with a teammate or an AI tool? Start with the same
                  brief.
                </p>
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  trailingIcon={<Icon name="copy" size="sm" />}
                  onClick={() => copy(rulesText, "Brand rules")}
                >
                  Copy brand rules
                </Button>
              </div>
            </>,
          )}
          {section(
            "logo",
            "02 / LOGO",
            "A familiar shape. Room to breathe.",
            "Use the original mark. No stretching, shadows, or improvised colours.",
            <>
              <div className="bg-controls">
                <div
                  className="bg-options"
                  role="group"
                  aria-label="Logo colour"
                >
                  {["ink", "iris", "white"].map((v) => (
                    <Button
                      key={v}
                      type={logo === v ? "primary" : "secondary"}
                      size="sm"
                      tapScale={1}
                      aria-pressed={logo === v}
                      onClick={() => setLogo(v)}
                    >
                      {v[0].toUpperCase() + v.slice(1)}
                    </Button>
                  ))}
                </div>
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  render={
                    <a
                      href={`/brand-guide/oreo-${logo}.svg`}
                      download={`oreo-${logo}.svg`}
                    />
                  }
                  leadingIcon={<Icon name="arrow-down" size="sm" />}
                >
                  Download SVG
                </Button>
              </div>
              <div className={`bg-logo-stage bg-logo-${logo}`}>
                <div className="bg-logo-space">
                  <OreoLogo />
                  <strong>oreo</strong>
                  <span>studio</span>
                </div>
                <small>Clear space is part of the logo.</small>
              </div>
              <div className="bg-pair">
                <p>
                  <b>Do</b> Keep the proportions. Use a clear, quiet background.
                </p>
                <p>
                  <b>Avoid</b> Rotating, outlining, or adding effects to the
                  mark.
                </p>
              </div>
            </>,
          )}
          {section(
            "colours",
            "03 / COLOURS",
            "A quiet foundation. A little character.",
            "Click a swatch to copy its exact HEX value. These brand colours stay the same in either theme.",
            <div className="bg-swatches">
              {COLOURS.map((c) => (
                <BrandSwatch
                  key={c.name}
                  {...c}
                  onCopy={(hex) => copy(hex, `${c.name} HEX`)}
                />
              ))}
            </div>,
          )}
          {section(
            "type",
            "04 / TYPOGRAPHY",
            "One family. A clear hierarchy.",
            "Inter keeps things familiar. Try a base size and ratio, then copy the scale for your next project.",
            <>
              <div className="bg-controls">
                <div className="bg-type-inputs">
                  <label>
                    Base size
                    <select
                      value={base}
                      onChange={(e) => setBase(Number(e.target.value))}
                    >
                      {[14, 16, 18, 20].map((v) => (
                        <option key={v} value={v}>
                          {v}px
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Ratio
                    <select
                      value={ratio}
                      onChange={(e) => setRatio(Number(e.target.value))}
                    >
                      <option value="1.125">1.125 · Major second</option>
                      <option value="1.2">1.2 · Minor third</option>
                      <option value="1.25">1.25 · Major third</option>
                      <option value="1.333">1.333 · Perfect fourth</option>
                    </select>
                  </label>
                </div>
                <Button
                  size="sm"
                  tapScale={1}
                  onClick={() =>
                    copy(typeScaleCSS(base, ratio), "Type scale CSS")
                  }
                >
                  Copy CSS
                </Button>
              </div>
              <label className="bg-sample">
                Try your own words
                <input
                  value={sample}
                  maxLength={160}
                  placeholder="Leave blank to see the brand examples"
                  onChange={(e) => setSample(e.target.value)}
                />
              </label>
              <TypeScale base={base} ratio={ratio} sample={sample} />
              <p className="bg-footnote">
                Sizes are in pixels and rem, assuming a 16px root. Inter is the
                existing Oreo UI font; exported CSS defines scale variables.
              </p>
            </>,
          )}
          {section(
            "voice",
            "05 / VOICE",
            "Sound like someone you’d work with.",
            "We’re thoughtful, direct, and a little warm. Useful always beats impressive.",
            <div className="bg-voice">
              {VOICE.map((v) => (
                <article key={v.title}>
                  <h3>{v.title}</h3>
                  <p>
                    <span>INSTEAD OF</span>
                    {v.before}
                  </p>
                  <p>
                    <span>TRY THIS</span>
                    {v.after}
                  </p>
                </article>
              ))}
            </div>,
          )}
          {section(
            "applications",
            "06 / APPLICATIONS",
            "The same idea, in different places.",
            "Simple layouts built from the same type, spacing, and colours. Use them as a starting point.",
            <div className="bg-applications">
              <article>
                <div className="bg-poster">
                  <OreoLogo />
                  <p>
                    Make room
                    <br />
                    for good ideas.
                  </p>
                  <small>OREO STUDIO / 2026</small>
                </div>
                <p>Social card · Give the message space.</p>
              </article>
              <article>
                <div className="bg-business">
                  <div>
                    <OreoLogo />
                    <b>Alex Morgan</b>
                    <span>Brand designer</span>
                    <small>alex@example.com</small>
                  </div>
                </div>
                <p>Contact card · Keep the essentials clear.</p>
              </article>
            </div>,
          )}
          {section(
            "signature",
            "07 / EMAIL SIGNATURE",
            "Your name. Our shared signature.",
            "Fill in your details and copy the formatted signature into your email app. No design tools needed.",
            <>
              <div className="bg-signature-grid">
                <div className="bg-signature-form">
                  {(
                    [
                      { key: "name", label: "Name" },
                      { key: "role", label: "Role" },
                      { key: "email", label: "Email" },
                      { key: "phone", label: "Phone (optional)" },
                      { key: "website", label: "Website (optional)" },
                      { key: "company", label: "Company" },
                    ] as { key: keyof SignatureData; label: string }[]
                  ).map((f) => (
                    <label key={f.key}>
                      {f.label}
                      <input
                        type={f.key === "email" ? "email" : "text"}
                        maxLength={120}
                        value={signature[f.key] ?? ""}
                        onChange={(e) =>
                          setSignature({
                            ...signature,
                            [f.key]: e.target.value,
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
                <div>
                  <div className="bg-signature-preview">
                    <EmailSignature data={signature} />
                  </div>
                  <div className="bg-signature-actions">
                    <Button
                      tapScale={1}
                      onClick={() =>
                        copy(
                          signatureText(signature),
                          "Formatted signature",
                          signatureHTML(signature),
                        )
                      }
                    >
                      Copy signature
                    </Button>
                    <Button
                      type="tertiary"
                      tapScale={1}
                      onClick={() =>
                        copy(signatureHTML(signature), "Signature HTML")
                      }
                    >
                      Copy HTML
                    </Button>
                  </div>
                  <p className="bg-footnote">
                    The preview stays white to match the exported email. Email
                    apps may apply their own formatting.
                  </p>
                </div>
              </div>
              <div className="bg-email-help">
                <h3>Adding it to your email app</h3>
                <div className="bg-options" role="group" aria-label="Email app">
                  {["Gmail", "Outlook", "Apple Mail"].map((v) => (
                    <Button
                      key={v}
                      type={client === v ? "primary" : "secondary"}
                      size="sm"
                      tapScale={1}
                      aria-pressed={client === v}
                      onClick={() => setClient(v)}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
                <ol>
                  <li>Copy your formatted signature above.</li>
                  <li>
                    {client === "Gmail"
                      ? "Open Gmail settings and find Signature under General."
                      : client === "Outlook"
                        ? "Open Outlook settings and search for Signatures."
                        : "Open Mail settings, choose Signatures, then add a new signature."}
                  </li>
                  <li>
                    Paste, preview, and save. Send yourself a test before using
                    it.
                  </li>
                </ol>
              </div>
            </>,
          )}
          {section(
            "downloads",
            "08 / DOWNLOADS",
            "Ready when you are.",
            "Take the originals with you. Every download is generated locally; your details stay in this page.",
            <div className="bg-downloads">
              {[
                {
                  name: "Logo originals",
                  desc: "Three SVG colour versions",
                  action: (
                    <div className="bg-options">
                      {["ink", "iris", "white"].map((v) => (
                        <Button
                          key={v}
                          type="secondary"
                          size="sm"
                          tapScale={1}
                          render={
                            <a href={`/brand-guide/oreo-${v}.svg`} download />
                          }
                        >
                          {v} SVG
                        </Button>
                      ))}
                    </div>
                  ),
                },
                {
                  name: "Type scale",
                  desc: `${base}px base · ${ratio} ratio`,
                  action: (
                    <Button
                      type="secondary"
                      size="sm"
                      tapScale={1}
                      onClick={() =>
                        download(
                          "oreo-type-scale.css",
                          typeScaleCSS(base, ratio),
                          "text/css",
                        )
                      }
                    >
                      Download CSS
                    </Button>
                  ),
                },
                {
                  name: "Email signature",
                  desc: "Your current details · standalone HTML",
                  action: (
                    <Button
                      type="secondary"
                      size="sm"
                      tapScale={1}
                      onClick={() =>
                        download(
                          "oreo-signature.html",
                          signatureHTML(signature),
                          "text/html",
                        )
                      }
                    >
                      Download HTML
                    </Button>
                  ),
                },
                {
                  name: "Brand guide",
                  desc: "Rules, colours, type scale and signature · JSON",
                  action: (
                    <Button
                      type="secondary"
                      size="sm"
                      tapScale={1}
                      onClick={guide}
                    >
                      Download JSON
                    </Button>
                  ),
                },
              ].map((d) => (
                <article key={d.name}>
                  <div>
                    <h3>{d.name}</h3>
                    <p>{d.desc}</p>
                  </div>
                  {d.action}
                </article>
              ))}
            </div>,
          )}
          <footer className="bg-footer">
            <span>
              Oreo Studio / Brand guidelines
              <br />A shared starting point, made for everyone.
            </span>
            <a
              href="https://x.com/sofianedesign/status/2110254882808807837"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Sofiane ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
