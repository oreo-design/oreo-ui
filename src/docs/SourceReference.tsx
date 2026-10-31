import { sourceReferencePath, internalSourceGuidance } from "./source-reference";
export function SourceReference({ source }: { source: string }) {
  return <div className="space-y-2 text-sm leading-6 text-text-secondary">
    <p><span className="font-medium text-text-primary">Internal source</span>{" · "}<code className="break-all">{sourceReferencePath(source)}</code></p>
    <p>{internalSourceGuidance}</p>
  </div>;
}
