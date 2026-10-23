import * as React from "react";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuSwitchItem,
} from "@/components/menu";
import { menu } from "@/components/menu/menu.variants";
import { Shortcut } from "@/components/shortcut";
import { cn } from "@/lib/cn";
import { ComposerAsset, type ComposerAssetName } from "./assets";
import "./composer.css";
import { DitherFill } from "./dither-fill";

const slots = menu();
const PreviewContext = React.createContext(true);
/** Static, interactive specimen of the same menu contents used in anchored popups. */
export function ComposerMenuSurface({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <PreviewContext.Provider value={true}>
      <div className={cn(slots.popup(), "composer-menu oreo-squircle", className)} {...rest}>
        {children}
      </div>
    </PreviewContext.Provider>
  );
}
export function ComposerMenu({
  trigger,
  children,
  width = 260,
}: {
  trigger: React.ReactElement<Record<string, unknown>>;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <Menu>
      <MenuTrigger render={trigger} />
      <MenuPopup className="composer-menu composer-popup oreo-squircle" side="top">
        <div style={{ width: `min(calc(${width}px - var(--space-x6)), calc(100vw - var(--spacing) * 11))` }}>
          <PreviewContext.Provider value={false}>
            {children}
          </PreviewContext.Provider>
        </div>
      </MenuPopup>
    </Menu>
  );
}
type RowProps = {
  children: React.ReactNode;
  icon?: ComposerAssetName | React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  description?: string;
  onClick?: () => void;
  className?: string;
  closeOnClick?: boolean;
  disabled?: boolean;
  active?: boolean;
};
function glyph(icon: RowProps["icon"]) {
  return typeof icon === "string" ? (
    <ComposerAsset name={icon as ComposerAssetName} />
  ) : (
    icon
  );
}
function Row({
  children,
  icon,
  trailing,
  selected,
  description,
  onClick,
  className,
  closeOnClick = true,
  disabled,
  active,
}: RowProps) {
  const preview = React.useContext(PreviewContext);
  const end =
    trailing ??
    (selected ? (
      <ComposerAsset name="check" className="text-text-primary" />
    ) : null);
  const label = description ? (
    <span className="composer-description">
      <span>{children}</span>
      <small>{description}</small>
    </span>
  ) : (
    children
  );
  const classes = cn(
    "composer-row oreo-squircle oreo-state-layer",
    selected && "is-selected",
    active && "is-active",
    className,
  );
  if (!preview)
    return (
      <MenuItem
        icon={glyph(icon)}
        trailing={end && <span className="flex items-center gap-1 text-text-tertiary">{end}</span>}
        className={classes}
        closeOnClick={closeOnClick}
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </MenuItem>
    );
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected === undefined ? undefined : selected}
      className={cn(slots.item(), classes)}
    >
      {icon && <span className={slots.itemIcon()}>{glyph(icon)}</span>}
      <span className={slots.itemLabel()}>{label}</span>
      {end && <span className={cn(slots.itemTrailing(), "text-text-tertiary")}>{end}</span>}
    </button>
  );
}
function Submenu({
  label,
  icon,
  children,
  trailing,
  width = 260,
  active = false,
}: {
  label: string;
  active?: boolean;
  icon?: ComposerAssetName;
  children: React.ReactNode;
  trailing?: string;
  width?: number;
}) {
  const preview = React.useContext(PreviewContext);
  const [open, setOpen] = React.useState(false);
  if (preview)
    return (
      <>
        <Row
          selected={active}
          icon={icon}
          trailing={
            <>
              {trailing}
              <ComposerAsset name="right" />
            </>
          }
          onClick={() => setOpen(!open)}
          closeOnClick={false}
        >
          {label}
        </Row>
        {open && (
          <ComposerMenuSurface className="composer-inline-submenu">
            {children}
          </ComposerMenuSurface>
        )}
      </>
    );
  return (
    <MenuSubmenu>
      <MenuSubmenuTrigger
        icon={icon && <ComposerAsset name={icon} />}
        trailingIcon={<ComposerAsset name="right" className="text-text-tertiary" />}
        className="composer-row oreo-squircle oreo-state-layer"
      >
        <span className="flex items-center justify-between gap-4">
          {label}
          <span className="text-text-tertiary">{trailing}</span>
        </span>
      </MenuSubmenuTrigger>
      <MenuPopup
        side="right"
        align="start"
        sideOffset={8}
        className="composer-menu composer-popup oreo-squircle"
      >
        <div style={{ width: `calc(${width}px - var(--space-x6))`, maxWidth: "calc(100vw - var(--spacing) * 11)" }}>
          {children}
        </div>
      </MenuPopup>
    </MenuSubmenu>
  );
}
export type ComposerConnector = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  enabled: boolean;
};
export const defaultConnectors: ComposerConnector[] = [
  {
    id: "figma",
    label: "Figma",
    icon: <ComposerAsset name="figma" />,
    enabled: true,
  },
  {
    id: "notion",
    label: "Notion",
    icon: <ComposerAsset name="notion" />,
    enabled: true,
  },
  {
    id: "chrome",
    label: "Control Chrome",
    icon: (
      <span className="grid size-5 place-items-center">
        <img
          src="/composer/chrome.svg"
          style={{ width: 16, height: 16 }}
          alt=""
        />
      </span>
    ),
    enabled: true,
  },
];
export function ComposerConnectorMenu({
  connectors = defaultConnectors,
  onChange,
  onBrowse,
  onManage,
}: {
  connectors?: ComposerConnector[];
  onChange?: (id: string, enabled: boolean) => void;
  onBrowse?: () => void;
  onManage?: () => void;
}) {
  const preview = React.useContext(PreviewContext);
  const [local, setLocal] = React.useState(connectors);
  const values = onChange ? connectors : local;
  const toggle = (id: string, next: boolean) => {
    setLocal((v) => v.map((c) => (c.id === id ? { ...c, enabled: next } : c)));
    onChange?.(id, next);
  };
  return (
    <>
      <Row icon="message" onClick={onBrowse}>
        Browse connectors
      </Row>
      <Row icon="message" onClick={onManage}>
        Manage connectors
      </Row>
      <MenuSeparator />
      {values.map((c) =>
        preview ? (
          <Row
            key={c.id}
            icon={c.icon}
            selected={c.enabled}
            className="composer-connector-row"
            onClick={() => toggle(c.id, !c.enabled)}
            trailing={
              <span
                className="composer-toggle"
                data-checked={c.enabled}
                aria-hidden
              />
            }
          >
            {c.label}
          </Row>
        ) : (
          <MenuSwitchItem
            key={c.id}
            icon={c.icon}
            checked={c.enabled}
            onCheckedChange={(next) => toggle(c.id, next)}
            className="composer-row oreo-squircle oreo-state-layer"
          >
            {c.label}
          </MenuSwitchItem>
        ),
      )}
    </>
  );
}
export function ComposerAddMenu({
  onAction,
  connectors,
  onConnectorChange,
}: {
  onAction?: (action: string) => void;
  connectors?: ComposerConnector[];
  onConnectorChange?: (id: string, next: boolean) => void;
}) {
  return (
    <>
      <Row
        icon="message"
        trailing={<Shortcut keys={["cmd", "shift", "A"]} size="sm" combine />}
        onClick={() => onAction?.("files")}
      >
        Add files or photos
      </Row>
      <Row icon="message" onClick={() => onAction?.("screenshot")}>
        Take a screenshot
      </Row>
      <MenuSeparator />
      <Submenu label="Skills" icon="message">
        <Row onClick={() => onAction?.("skill")}>Record a skill</Row>
      </Submenu>
      <Submenu label="Connectors" icon="message">
        <ComposerConnectorMenu
          connectors={connectors}
          onChange={onConnectorChange}
          onBrowse={() => onAction?.("browse-connectors")}
          onManage={() => onAction?.("manage-connectors")}
        />
      </Submenu>
      <Row icon="message" onClick={() => onAction?.("plugins")}>
        Add plugins...
      </Row>
    </>
  );
}
export type ApprovalMode = "manual" | "automatic" | "full";
export function ComposerApprovalMenu({
  value = "full",
  onValueChange,
  detailed = false,
  onLearnMore,
}: {
  value?: ApprovalMode;
  onValueChange?: (v: ApprovalMode) => void;
  detailed?: boolean;
  onLearnMore?: () => void;
}) {
  const [local, setLocal] = React.useState(value);
  const selected = onValueChange ? value : local;
  const choose = (v: ApprovalMode) => {
    setLocal(v);
    onValueChange?.(v);
  };
  const options = detailed
    ? [
        {
          id: "manual" as const,
          label: "Ask for approval",
          description: "Always ask to edit external files and use the internet",
          icon: "hand" as const,
        },
        {
          id: "automatic" as const,
          label: "Ask for me",
          description: "Only ask for actions detected as potentially unsafe",
          icon: "shield" as const,
        },
        {
          id: "full" as const,
          label: "Full access",
          description:
            "Unrestricted access to the internet and any file on your computer",
          icon: "warning" as const,
        },
      ]
    : [
        {
          id: "manual" as const,
          label: "Manually approve",
          icon: "message" as const,
        },
        {
          id: "automatic" as const,
          label: "Automatically approve",
          icon: "message" as const,
        },
        {
          id: "full" as const,
          label: "Skip all approvals",
          icon: "message" as const,
        },
      ];
  return (
    <>
      {detailed && (
        <div className="composer-permission-heading">
          <span>How should ChatGPT actions be approved?</span>
          <button onClick={onLearnMore} type="button">
            Learn more
          </button>
        </div>
      )}
      {options.map((o) => (
        <Row
          key={o.id}
          icon={o.icon}
          description={"description" in o ? o.description : undefined}
          selected={selected === o.id}
          onClick={() => choose(o.id)}
          className={
            detailed
              ? `composer-permission-row ${o.id === "full" ? "composer-warning" : ""}`
              : undefined
          }
        >
          {o.label}
        </Row>
      ))}
    </>
  );
}
export type ComposerModel = {
  id: string;
  label: string;
  group?: string;
  description?: string;
};
export const composerModels: ComposerModel[] = [
  "5.6 Sol",
  "5.6 Terra",
  "5.6 Luna",
  "5.5",
  "5.4",
  "5.4 Mini",
].map((label) => ({ id: label, label }));
export function ComposerModelList({
  models = composerModels,
  value = "5.6 Sol",
  onValueChange,
  searchable = false,
  categorized = false,
}: {
  models?: ComposerModel[];
  value?: string;
  onValueChange?: (id: string) => void;
  searchable?: boolean;
  categorized?: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [local, setLocal] = React.useState(value);
  const [group, setGroup] = React.useState("Speech-to-speech");
  const selected = onValueChange ? value : local;
  const filtered = models.filter((m) =>
    m.label.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      {searchable && (
        <input
          aria-label="Search model"
          className="composer-model-search oreo-squircle"
          placeholder="Search model"
          value={query}
          onKeyDown={(e) => {
            if (e.key !== "Escape") e.stopPropagation();
          }}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}{" "}
      {categorized &&
        ["Advanced intelligence", "Fast & efficient", "Speech-to-speech"].map(
          (g) => (
            <button
              type="button"
              className={cn(
                "composer-category",
                g === "Speech-to-speech" && "is-last",
              )}
              key={g}
              aria-expanded={group === g}
              onClick={() => setGroup(group === g ? "" : g)}
            >
              {g}
              <span className={group === g ? "-rotate-90" : ""}>
                <ComposerAsset name="right" />
              </span>
            </button>
          ),
        )}
      {(!categorized || group) &&
        filtered
          .filter((m) => !categorized || !m.group || m.group === group)
          .map((m) => (
            <Row
              key={m.id}
              selected={selected === m.id}
              description={m.description}
              onClick={() => {
                setLocal(m.id);
                onValueChange?.(m.id);
              }}
            >
              {m.label}
            </Row>
          ))}
      {filtered.length === 0 && (
        <div className="composer-search-empty" role="status">
          No models found
          <button type="button" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      )}
    </>
  );
}
const effortLabels = ["Low", "Medium", "Balanced", "High", "Max", "Ultracode"];
export function ComposerEffort({
  value = 3,
  onValueChange,
}: {
  value?: number;
  onValueChange?: (value: number) => void;
}) {
  const [local, setLocal] = React.useState(value);
  const n = Math.max(0, Math.min(5, onValueChange ? value : local));
  return (
    <div className="composer-effort">
      <div className="composer-effort-heading">
        <span>Effort</span>
        <strong className={n === 5 ? "text-palette-purple-text" : ""}>
          {effortLabels[n]}
        </strong>
        <span title="Balance response speed and reasoning effort">
          <ComposerAsset name="help" />
        </span>
      </div>
      <div className="composer-effort-labels">
        <span>Faster</span>
        <span>Smarter</span>
      </div>
      <div className="composer-effort-track oreo-squircle" data-ultra={n === 5}>
        <div className="composer-effort-dots">
          <ComposerAsset name="dots" />
        </div>
        <div
          className="composer-effort-fill oreo-squircle"
          style={{
            width: `calc(var(--space-x12) + (100% - var(--space-x12)) * ${n === 3 ? 148 / 248 : n / 5})`,
          }}
        >
          {n === 5 && <DitherFill />}
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={n}
          onKeyDown={(e) => {
            if (e.key !== "Escape") e.stopPropagation();
          }}
          aria-label="Reasoning effort"
          aria-valuetext={effortLabels[n]}
          onChange={(e) => {
            const next = Number(e.target.value);
            setLocal(next);
            onValueChange?.(next);
          }}
        />
      </div>
    </div>
  );
}
export function ComposerModelSettings({
  activeSetting,
  value = "5.6 Terra",
  onValueChange,
  searchable = false,
  categorized = false,
}: {
  activeSetting?: "model";
  value?: string;
  onValueChange?: (id: string) => void;
  searchable?: boolean;
  categorized?: boolean;
}) {
  const [local, setLocal] = React.useState(value);
  const [effort, setEffort] = React.useState(3);
  const [speed, setSpeed] = React.useState("Standard");
  const model = onValueChange ? value : local;
  const select = (id: string) => {
    setLocal(id);
    onValueChange?.(id);
  };
  return (
    <>
      <Submenu
        active={activeSetting === "model"}
        label="Model"
        trailing={model}
        width={237}
      >
        <ComposerModelList
          value={model}
          onValueChange={select}
          searchable={searchable}
          categorized={categorized}
        />
      </Submenu>
      <Submenu label="Effort" trailing={effortLabels[effort]} width={304}>
        <ComposerEffort value={effort} onValueChange={setEffort} />
      </Submenu>
      <Submenu label="Speed" trailing={speed} width={237}>
        {["Standard", "Fast"].map((s) => (
          <Row key={s} selected={s === speed} onClick={() => setSpeed(s)}>
            {s}
          </Row>
        ))}
      </Submenu>
      <MenuSeparator />
      <Row
        className="text-text-tertiary"
        trailing={<ComposerAsset name="reset" />}
        onClick={() => {
          select("5.6 Terra");
          setEffort(3);
          setSpeed("Standard");
        }}
      >
        Reset to default
      </Row>
    </>
  );
}
export function ComposerDescribedModels() {
  const [value, setValue] = React.useState("Opus 5");
  return (
    <>
      <ComposerModelList
        value={value}
        onValueChange={setValue}
        models={[
          {
            id: "Fable",
            label: "Fable",
            description: "For your toughest challenges",
          },
          { id: "Opus 5", label: "Opus 5", description: "For complex tasks" },
          {
            id: "Sonnet 5",
            label: "Sonnet 5",
            description: "Most efficient for everyday tasks",
          },
          {
            id: "Haiku 4.5",
            label: "Haiku 4.5",
            description: "Fastest for quick amswers",
          },
        ]}
      />
      <MenuSeparator />
      <Submenu label="Effort" trailing="High" width={304}>
        <ComposerEffort />
      </Submenu>
      <MenuSeparator />
      <Submenu label="More models" width={237}>
        <ComposerModelList />
      </Submenu>
    </>
  );
}
export type ComposerCommand = {
  id: string;
  label: string;
  description?: string;
  icon: ComposerAssetName;
  group?: string;
  hideDescription?: boolean;
};
export const mentionCommands: ComposerCommand[] = [
  {
    id: "files",
    label: "Files and folders",
    description: "Attach files or folders from your device",
    hideDescription: true,
    icon: "attach",
    group: "Add",
  },
  {
    id: "finder",
    label: "Attach 访达",
    description: "Reference a Finder location",
    hideDescription: true,
    icon: "finder",
  },
  {
    id: "goal",
    label: "Goal",
    description: "Set a goal to keep pursuing",
    icon: "target",
  },
  {
    id: "plan",
    label: "Plan mode",
    description: "Turn plan mode on",
    icon: "bulb",
  },
  {
    id: "record",
    label: "Record a skill",
    description: "Capture a reusable skill",
    hideDescription: true,
    icon: "disc",
  },
  {
    id: "documents",
    label: "Documents",
    description: "Create and edit documents",
    icon: "document",
    group: "Plugins",
  },
  {
    id: "pdf",
    label: "PDF",
    description: "Read, create, and verify PDFs",
    icon: "file",
  },
];
export const slashCommands: ComposerCommand[] = [
  {
    id: "archive",
    label: "Archive",
    description: "Archive the current chat",
    icon: "archive",
  },
  {
    id: "review",
    label: "Code review",
    description: "Review uncommitted changes or compare against a branch",
    icon: "bug",
  },
  {
    id: "compact",
    label: "Compact",
    description: "Compact this chat's context (59% full)",
    icon: "compact",
  },
  {
    id: "fast",
    label: "Fast",
    description: "1.5x speed, increased usage",
    icon: "fast",
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Send feedback about this chat",
    icon: "feedback",
  },
  {
    id: "fork",
    label: "Fork chat",
    description: "Fork this chat",
    icon: "fork",
  },
  {
    id: "goal",
    label: "Goal",
    description: "Set a goal to keep pursuing",
    icon: "target",
  },
  {
    id: "init",
    label: "Init",
    description: "Create an AGENTS.md file with instructions for Codex",
    icon: "init",
  },
  {
    id: "mcp",
    label: "MCP",
    description: "Show MCP server status",
    icon: "mcp",
  },
  { id: "model", label: "Model", description: "GPT-5.6 Terra", icon: "box" },
];
export function ComposerCommandList({
  kind = "mention",
  query = "",
  onSelect,
  activeIndex,
}: {
  kind?: "mention" | "slash";
  query?: string;
  activeIndex?: number;
  onSelect?: (c: ComposerCommand) => void;
}) {
  const commands = (
    kind === "mention" ? mentionCommands : slashCommands
  ).filter((c) =>
    `${c.label} ${c.description ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="composer-command-list" data-kind={kind}>
      {commands.map((c, i) => (
        <React.Fragment key={c.id}>
          {c.group && (
            <>
              {i > 0 && <MenuSeparator />}
              <div className="composer-command-heading">{c.group}</div>
            </>
          )}
          <Row
            icon={c.icon}
            active={activeIndex === i}
            onClick={() => onSelect?.(c)}
          >
            <span className="composer-command-label">
              <span>{c.label}</span>
              {!c.hideDescription && <small>{c.description}</small>}
            </span>
          </Row>
        </React.Fragment>
      ))}
      {!commands.length && (
        <div className="composer-search-empty" role="status">
          No matching commands
        </div>
      )}
    </div>
  );
}
export type UsageMeter = {
  label: string;
  value: number;
  displayValue: string;
  reset?: string;
};
export const referenceUsage: UsageMeter[] = [
  { label: "Context window", value: 0, displayValue: "0" },
  {
    label: "5-hour limit",
    value: (84 / 408) * 100,
    displayValue: "26%",
    reset: "Resets in 2 hr 59 min",
  },
  {
    label: "Weekly · all models",
    value: (157 / 408) * 100,
    displayValue: "4%",
    reset: "Resets Sat 2:00 AM",
  },
];
/** displayValue and fill are independently supplied because the Figma specimen uses illustrative bars. */
export function ComposerUsageMeters({
  meters = referenceUsage,
}: {
  meters?: UsageMeter[];
}) {
  return (
    <div className="composer-usage-meters">
      {meters.map((m, i) => (
        <div className="composer-usage-meter" key={m.label}>
          <div
            className={cn(
              "composer-usage-label",
              i === 0 && "text-text-secondary",
            )}
          >
            <span>{m.label}</span>
            <span>
              {m.reset && <span>{m.reset}</span>}
              <span>{m.displayValue}</span>
            </span>
          </div>
          <div
            role="meter"
            aria-label={m.label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.max(0, Math.min(100, m.value))}
            aria-valuetext={m.displayValue}
            className="composer-meter-track"
          >
            <span
              style={{ width: `${Math.max(0, Math.min(100, m.value))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
export function ComposerUsageMenu({
  variant = "summary",
  defaultExpanded = false,
  onAction,
}: {
  variant?: "summary" | "inline" | "submenu";
  defaultExpanded?: boolean;
  onAction?: (action: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  return (
    <div className="composer-usage-menu">
      <Row icon="message" onClick={() => onAction?.("workspace")}>
        Oreo design
      </Row>
      <MenuSeparator />
      {variant === "submenu" ? (
        <Submenu label="Usage" icon="timer" width={440}>
          <ComposerUsageMeters />
        </Submenu>
      ) : (
        <Row
          icon="timer"
          closeOnClick={false}
          onClick={() => setExpanded(!expanded)}
          trailing={
            variant === "summary" ? (
              "75% Left"
            ) : (
              <span className={cn("flex", expanded && "rotate-90")}>
                <ComposerAsset name="right" />
              </span>
            )
          }
        >
          Usage
        </Row>
      )}
      {variant === "inline" && expanded && (
        <div className="composer-usage-inline">
          <Row
            trailing={
              <span className="flex gap-2 text-text-tertiary">
                <span>99%</span>
                <span>3:36 PM</span>
              </span>
            }
          >
            5h
          </Row>
          <Row
            trailing={
              <span className="flex gap-2 text-text-tertiary">
                <span>100%</span>
                <span>May 31</span>
              </span>
            }
          >
            Weekly
          </Row>
          <Row
            trailing={<ComposerAsset name="external" />}
            onClick={() => onAction?.("upgrade")}
          >
            Upgrade to Pro
          </Row>
          <Row onClick={() => onAction?.("learn")}>Learn more</Row>
        </div>
      )}
      <Submenu label="Invite a friend" icon="message">
        <Row onClick={() => onAction?.("invite")}>Copy invitation link</Row>
      </Submenu>
      <Row
        icon="message"
        trailing={<Shortcut keys={["cmd", "shift", "A"]} size="sm" combine />}
        onClick={() => onAction?.("settings")}
      >
        Settings
      </Row>
      <Row icon="message" onClick={() => onAction?.("logout")}>
        Log out
      </Row>
    </div>
  );
}
