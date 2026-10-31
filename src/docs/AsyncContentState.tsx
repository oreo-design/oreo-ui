import { Button } from "@/components/button";
import "./async-content.css";

/** Occupies the owning content slot; navigation and theme stay outside. */
export function AsyncContentState({ title, error, onRetry }: { title: string; error?: boolean; onRetry: () => void }) {
  return <section className="async-content-state" aria-busy={!error} aria-label={`${title} content`}>
    {error ? <div role="alert" className="async-content-message">
      <h2>{title} could not be loaded</h2>
      <p>Check your connection and try again. Your other pages and appearance controls are still available.</p>
      <div className="async-content-actions"><Button size="sm" onClick={onRetry}>Try again</Button><Button size="sm" type="secondary" onClick={() => window.location.reload()}>Reload page</Button></div>
    </div> : <><span className="sr-only" role="status">Loading {title}</span><div className="async-content-skeleton" aria-hidden="true"><i /><i /><div /><i /></div></>}
  </section>;
}
