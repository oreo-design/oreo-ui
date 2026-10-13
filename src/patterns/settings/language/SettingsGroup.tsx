import type { ReactNode } from "react";
import { SettingsSection } from "../SettingsSection";

/** Small labels name groups; explanations belong to the page or a setting.
 * Explicit forwarding also drops unsupported props supplied at runtime.
 */
export function SettingsGroup({ label, actions, children }: {
  label: string;
  actions?: ReactNode;
  children: ReactNode;
  description?: never;
}) {
  return <SettingsSection title={label} actions={actions}>{children}</SettingsSection>;
}
