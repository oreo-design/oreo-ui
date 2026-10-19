import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { AgentWorkspaceState } from "@/components/automation";
import { OREO_WORDMARK } from "./glyphs";
import type { OutlineGlyph, WordmarkAccent } from "./types";
import "./outline-wordmark.css";
export { OREO_WORDMARK, STUDIO_WORDMARK } from "./glyphs";
export type { OutlineGlyph, WordmarkAccent } from "./types";

/** Pure decorative vector primitive. Its host owns activation and accessibility. */
export function PathGlyph({
  glyph = OREO_WORDMARK[0],
  active = false,
  nodes = true,
  accent = "amber",
  animated = true,
  release = 700,
}: {
  glyph?: OutlineGlyph;
  active?: boolean;
  nodes?: boolean;
  accent?: WordmarkAccent;
  animated?: boolean;
  release?: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${glyph.width} ${glyph.height}`}
      aria-hidden="true"
      className="ow-glyph"
      data-active={active || undefined}
      data-accent={accent}
      data-animated={animated}
      style={
        {
          "--ow-release": `${Number.isFinite(release) ? Math.max(0, Math.min(1500, release)) : 700}ms`,
        } as CSSProperties
      }
    >
      <path d={glyph.path} className="ow-contour" />
      {nodes && (
        <g className="ow-nodes">
          {glyph.nodes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.8" />
          ))}
        </g>
      )}
    </svg>
  );
}

/** Independent letter highlights; pointer hover is temporary, click/touch toggles one. */
export function OutlineWordmark({
  glyphs = OREO_WORDMARK,
  label = "Oreo",
  accent = "amber",
  nodes = true,
  animated = true,
  release = 700,
  revealed = false,
  resetKey = 0,
}: {
  glyphs?: readonly OutlineGlyph[];
  label?: string;
  accent?: WordmarkAccent;
  nodes?: boolean;
  animated?: boolean;
  release?: number;
  revealed?: boolean;
  resetKey?: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null),
    [pinned, setPinned] = useState<string | null>(null),
    [focused, setFocused] = useState<string | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = glyphs.filter(
    (g, i, a) =>
      Number.isFinite(g.width) &&
      g.width > 0 &&
      Number.isFinite(g.height) &&
      g.height > 0 &&
      g.path &&
      a.findIndex((x) => x.id === g.id) === i,
  );
  const signature = JSON.stringify(items.map((g) => g.id));
  useEffect(() => {
    setHovered(null);
    setPinned(null);
    setFocused(null);
  }, [resetKey, signature]);
  const clear = () => {
    setHovered(null);
    setPinned(null);
    setFocused(null);
  };
  function key(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Escape") {
      clear();
      event.currentTarget.blur();
      return;
    }
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    refs.current[next]?.focus();
  }
  if (!items.length)
    return (
      <AgentWorkspaceState
        title="No wordmark yet"
        description="Add vector glyphs to preview the letter interaction."
      />
    );
  return (
    <div
      className="ow-wordmark"
      role="group"
      aria-label={`${label} interactive wordmark`}
      onPointerLeave={() => setHovered(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) clear();
      }}
    >
      {items.map((glyph, i) => (
        <button
          key={glyph.id}
          ref={(node) => {
            refs.current[i] = node;
          }}
          className="ow-letter"
          type="button"
          style={{ flexGrow: glyph.width / glyph.height }}
          aria-label={`${glyph.label}, letter ${i + 1} of ${items.length}`}
          aria-pressed={revealed || pinned === glyph.id}
          onPointerEnter={(e) => {
            if (e.pointerType !== "touch") setHovered(glyph.id);
          }}
          onPointerLeave={() => setHovered(null)}
          onFocus={(e) => {
            if (e.currentTarget.matches(":focus-visible")) setFocused(glyph.id);
          }}
          onBlur={() => setFocused(null)}
          onClick={() => {
            setPinned(pinned === glyph.id ? null : glyph.id);
            setHovered(null);
          }}
          onKeyDown={(e) => key(e, i)}
        >
          <PathGlyph
            glyph={glyph}
            active={
              revealed ||
              hovered === glyph.id ||
              pinned === glyph.id ||
              focused === glyph.id
            }
            nodes={nodes}
            accent={accent}
            animated={animated}
            release={release}
          />
        </button>
      ))}
    </div>
  );
}

export type FooterLinkGroup = {
  id: string;
  title: string;
  links: readonly { label: string; href: string }[];
};
export const FOOTER_LINK_GROUPS: readonly FooterLinkGroup[] = [
  {
    id: "explore",
    title: "Explore",
    links: [
      { label: "Components", href: "/button" },
      { label: "Templates", href: "/workflow-directory" },
      { label: "Motion", href: "/loading-sequence" },
      { label: "Brand guide", href: "/brand-guide" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { label: "Documentation", href: "/outline-wordmark?view=docs" },
      { label: "Playground", href: "/outline-wordmark" },
    ],
  },
];
export function FooterLinkGroups({
  groups = FOOTER_LINK_GROUPS,
  label = "Footer navigation",
  compact = false,
}: {
  groups?: readonly FooterLinkGroup[];
  label?: string;
  compact?: boolean;
}) {
  if (!groups.length) return null;
  return (
    <nav
      aria-label={label}
      className={`ow-link-groups${compact ? " ow-link-groups-compact" : ""}`}
    >
      {groups.map((group) => (
        <section key={group.id}>
          <h2>{group.title}</h2>
          <ul>
            {group.links.map((link, i) => (
              <li key={`${link.href}-${i}`}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
