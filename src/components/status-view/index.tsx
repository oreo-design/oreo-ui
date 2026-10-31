import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import "./status-view.css";

export type StatusViewProps = {
  title: string;
  description: string;
  error?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

// Keep the legacy class and direct children: existing hosts own scoped layout overrides.
/** Empty/error content only. The host owns loading, copy, recovery and region placement. */
export function StatusView({ title, description, error = false, actionLabel, onAction }: StatusViewProps) {
  return <div className="agent-workspace-state" role={error ? "alert" : undefined}><Icon name={error ? "warning-circle" : "sparkle"} size="lg" className={error ? "text-status-error" : "text-text-tertiary"} /><h3 className="text-base font-medium">{title}</h3><p className="max-w-xs text-sm leading-6 text-text-secondary">{description}</p>{actionLabel && onAction && <Button type="secondary" tapScale={1} onClick={onAction}>{actionLabel}</Button>}</div>;
}
