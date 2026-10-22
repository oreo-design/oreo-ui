import type { ReactNode } from "react";
import { ComposerAsset } from "@/components/composer/assets";
import { ContextBar } from "@/components/context-bar";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import "./prompt-box.controls.css";

export type PromptBoxPermissionOption = {
  value: string;
  label: string;
  tone?: "neutral" | "warning";
};

export type PromptBoxPermissionProps = {
  value: string;
  options: readonly PromptBoxPermissionOption[];
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

/** Presentation only. The host owns permission policy and confirmation. */
export function PromptBoxPermission({ value, options, onValueChange, disabled }: PromptBoxPermissionProps) {
  const selected = options.find(option => option.value === value);
  if (!selected) return null;
  return <Menu>
    <MenuTrigger disabled={disabled || !onValueChange} className="oreo-prompt-permission oreo-squircle oreo-state-layer" data-tone={selected.tone ?? "neutral"} aria-label={`Permissions: ${selected.label}`}>
      <ComposerAsset name="shield" className="oreo-prompt-permission-icon" />
      <span>{selected.label}</span>
    </MenuTrigger>
    <MenuPopup side="top" align="start">
      {options.map(option => <MenuItem key={option.value} selected={option.value === value} trailing={option.value === value ? <ComposerAsset name="check" className="text-text-primary" /> : undefined} onClick={() => onValueChange?.(option.value)}>{option.label}</MenuItem>)}
    </MenuPopup>
  </Menu>;
}

export type PromptBoxApp = {
  id: string;
  label: string;
  icon: ReactNode;
  /** Render confirmed host state; clicking does not mark an app connected. */
  connected?: boolean;
  disabled?: boolean;
};

export type PromptBoxConnectAppsProps = {
  apps: readonly PromptBoxApp[];
  label?: string;
  onAppClick?: (app: PromptBoxApp) => void;
  /** Open a host-owned connection flow instead of the built-in app menu. */
  onClick?: () => void;
  disabled?: boolean;
};

/** An attached footer with identity marks and an accessible connection entry. */
export function PromptBoxConnectApps({ apps, label = "Connect apps", onAppClick, onClick, disabled }: PromptBoxConnectAppsProps) {
  const content = <>
    <span aria-hidden className="oreo-prompt-app-icons">{apps.slice(0, 3).map(app => <span key={app.id}>{app.icon}</span>)}</span>
    <span className="oreo-prompt-app-label">{label}</span>
  </>;
  const className = "oreo-prompt-app-trigger oreo-squircle oreo-state-layer";
  return <ContextBar position="footer" className="oreo-prompt-apps">
    {onClick ? <button type="button" className={className} disabled={disabled} onClick={onClick}>{content}</button> : <Menu>
      <MenuTrigger className={className} disabled={disabled || !apps.length || !onAppClick}>{content}</MenuTrigger>
      <MenuPopup side="top" align="start">
        {apps.map(app => <MenuItem key={app.id} icon={app.icon} disabled={app.disabled} onClick={() => onAppClick?.(app)} trailing={app.connected ? "Connected" : undefined}>{app.label}</MenuItem>)}
      </MenuPopup>
    </Menu>}
  </ContextBar>;
}
