import { Children, type ReactNode } from "react";

export type ChangeKind = "Added" | "Updated" | "Fixed" | "Breaking";
export type ReleaseEntryProps = {
  title: string;
  description: string;
  kind: ChangeKind;
  href: string;
  sourceHref: string;
  sourceLabel: string;
  children?: ReactNode;
};

/** Content and provenance stay separate; previews are real consumer components. */
export function ReleaseEntry({ title, description, kind, href, sourceHref, sourceLabel, children }: ReleaseEntryProps) {
  const preview = Children.toArray(children);
  return <article className="min-w-0 border-b border-border-subtle py-7 last:border-0">
    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
      <span className="rounded-md border border-border-subtle bg-bg-base px-2 py-1 font-medium">{kind}</span>
      <a href={sourceHref} className="text-text-secondary underline decoration-border-default underline-offset-4 hover:text-text-primary">{sourceLabel}</a>
    </div>
    <h3 className="text-base font-semibold tracking-tight"><a className="hover:underline underline-offset-4" href={href}>{title} <span aria-hidden="true">↗</span></a></h3>
    <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
    {preview.length > 0 && <div className="mt-5 overflow-hidden rounded-card-small border border-border-subtle bg-bg-base p-5" role="region" aria-label={`${title} preview`}>{preview}</div>}
  </article>;
}
