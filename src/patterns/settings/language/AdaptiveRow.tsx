import type { ReactNode } from "react";
import { RowLabel, RowShell } from "../row-primitives";
import "./language.css";

/** An opt-in derivative. The original SettingsRow remains the default.
 * Slots carry product content; the frame owns alignment, wrapping and rhythm.
 * See docs/settings-language/contract.json for lineage and review boundaries.
 */
export function AdaptiveRow({ title, description, media, control, detail }: {
  title: ReactNode;
  description?: ReactNode;
  media?: ReactNode;
  control?: ReactNode;
  detail?: ReactNode;
}) {
  return (
    <RowShell className="settings-adaptive-row">
      <div className="settings-adaptive-row__body" data-media={media ? "true" : undefined}>
        <div className="settings-adaptive-row__identity">
          {media && <div className="settings-adaptive-row__media">{media}</div>}
          <RowLabel title={title} description={description} />
        </div>
        {control && <div className="settings-adaptive-row__control">{control}</div>}
        {detail && <div className="settings-adaptive-row__detail">{detail}</div>}
      </div>
    </RowShell>
  );
}

/** Page rhythm belongs to the composition rather than every call site. */
export function SettingsFlow({ children }: { children: ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}
