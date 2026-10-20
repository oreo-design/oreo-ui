import { useId, useState } from "react";
import { PropertyControl } from "./PropertyControl";
import { toggle } from "./schema";
import { shareUrl, type Configuration } from "./configuration";
import { withAppearance } from "./exportAppearance";
import { Modal, Tool } from "./Tools";

export function SharePanel({
  open,
  setOpen,
  title,
  configuration,
  code,
  install,
  copy,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  title: string;
  configuration: Configuration;
  code: string;
  install: string;
  copy: (text: string, kind: string) => Promise<void>;
}) {
  const id = useId();
  const [tab, setTab] = useState("Copy prompt"),
    [rules, setRules] = useState(true),
    [includeAppearance, setIncludeAppearance] = useState(true);
  const exportCode = withAppearance(
    code,
    includeAppearance ? configuration.appearance : undefined,
  );
  const link = shareUrl(window.location.href, {
    ...configuration,
    appearance: includeAppearance ? configuration.appearance : undefined,
  });
  const prompt = `Build with Oreo UI\n\nInstall ${title}, then use this JSX for the exact configuration. Connect event handlers in your app.\n\n${install}\n\n${exportCode}${rules ? "\n\nDesign rules: Reuse Oreo semantic tokens and shared components. Preserve sizes, spacing, keyboard focus, disabled states and reduced-motion behavior." : ""}${includeAppearance ? `\n\nAppearance: ${JSON.stringify(configuration.appearance)}` : ""}\n\nConfiguration: ${link}`;
  const text =
    tab === "Code" ? exportCode : tab === "Share link" ? link : prompt;
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Use this configuration"
      description={[
        title,
        configuration.values.type,
        ({ sm: "Small", md: "Medium", lg: "Large" } as Record<string, string>)[
          String(configuration.values.size)
        ],
      ]
        .filter(Boolean)
        .join(" · ")}
    >
      <div role="tablist" aria-label="Share format" className="pg-tabs">
        {["Copy prompt", "Share link", "Code"].map((name) => (
          <button
            key={name}
            id={`${id}-${name}`}
            role="tab"
            aria-controls={`${id}-panel`}
            tabIndex={tab === name ? 0 : -1}
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            onKeyDown={(event) => {
              const names = ["Copy prompt", "Share link", "Code"];
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 2
                    : (names.indexOf(tab) +
                        (event.key === "ArrowRight" ? 1 : 2)) %
                      3;
              setTab(names[next]);
              document.getElementById(`${id}-${names[next]}`)?.focus();
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`}>
        {tab === "Copy prompt" ? (
          <div className="pg-prompt-preview">
            <strong>Build with Oreo UI</strong>
            <p>
              Install {title}, then use this JSX for the exact configuration.
              Keep its size, spacing, focus, disabled and reduced-motion
              behavior.
            </p>
            <code>{install}</code>
            <pre>{exportCode}</pre>
            <p>
              Includes imports{rules ? ", design rules" : ""} and a link back to
              this configuration. Wire your own event handlers.
            </p>
          </div>
        ) : (
          <textarea
            className="pg-share-text"
            aria-label={tab}
            readOnly
            value={text}
            onFocus={(e) => {
              if (tab === "Share link") e.currentTarget.select();
            }}
          />
        )}
      </div>
      <PropertyControl
        name="Include design rules"
        control={toggle(true)}
        value={rules}
        onChange={(v) => setRules(Boolean(v))}
      />
      <PropertyControl
        name="Include current appearance"
        control={toggle(true)}
        value={includeAppearance}
        onChange={(v) => setIncludeAppearance(Boolean(v))}
      />
      <div className="pg-row">
        <Tool
          icon="copy"
          label={`Copy ${tab === "Code" ? "code" : tab === "Share link" ? "link" : "prompt"}`}
          onClick={() =>
            void copy(text, tab === "Copy prompt" ? "Prompt" : tab)
          }
        />
        <Tool
          icon="share"
          label="Copy configuration link"
          onClick={() => void copy(link, "Link")}
        />
      </div>
      <p className="pg-fine">
        Link saves this configuration only. Preview text may be visible to
        anyone you share it with.
      </p>
    </Modal>
  );
}
