import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { AgentWorkspaceState } from "@/components/automation";
import "./model-routing.css";
export const ROUTING_POLICIES = ["cost", "balanced", "quality"] as const;
export type RoutingPolicy = (typeof ROUTING_POLICIES)[number];
export type ModelRoute = {
  id: string;
  name: string;
  provider: string;
  tone: "blue" | "mint" | "purple" | "pink";
  share: number;
  requests: number;
  p50: number;
  p95: number;
  cost: number;
  errors: number;
};
export function RoutingPolicyControl({
  value,
  onChange,
  disabled = false,
}: {
  value: RoutingPolicy;
  onChange: (value: RoutingPolicy) => void;
  disabled?: boolean;
}) {
  return (
    <div className="routing-policy" role="group" aria-label="Routing policy">
      {ROUTING_POLICIES.map((policy) => (
        <button
          type="button"
          key={policy}
          disabled={disabled}
          aria-pressed={value === policy}
          onClick={() => onChange(policy)}
        >
          {policy}
        </button>
      ))}
    </div>
  );
}
const subscribe = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
/** Decorative packets represent a simulation, never individual network events. */
export function RoutingFlow({
  routes,
  active = true,
  selected,
  onSelect,
}: {
  routes: ModelRoute[];
  active?: boolean;
  selected?: string;
  onSelect?: (id: string) => void;
}) {
  const visible = useSyncExternalStore(
    subscribe,
    () => !document.hidden,
    () => true,
  );
  const [hover, setHover] = useState<string>();
  const highlight = hover ?? selected;
  if (!routes.length)
    return (
      <AgentWorkspaceState
        title="No routes configured"
        description="Add a model route to connect your gateway."
      />
    );
  const height = Math.max(144, routes.length * 36),
    mid = height / 2;
  return (
    <div className="routing-flow" data-active={active && visible}>
      <div className="routing-diagram" aria-hidden="true">
        <span className="routing-gateway">GATEWAY</span>
        <svg viewBox={`0 0 400 ${height}`} preserveAspectRatio="none">
          {routes.map((route, i) => {
            const y = ((i + 0.5) * height) / routes.length;
            return (
              <g
                key={route.id}
                data-tone={route.tone}
                data-muted={!!highlight && highlight !== route.id}
                className="routing-line"
              >
                <path
                  d={`M 14 ${mid} H 78 C 110 ${mid}, 112 ${y}, 152 ${y} H 382`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity=".45"
                />
                {route.requests > 0 &&
                  [0, 1, 2].map((n) => (
                    <circle
                      key={n}
                      cx="152"
                      cy={y}
                      r="2.5"
                      fill="currentColor"
                      className="routing-packet"
                      style={
                        {
                          animationDelay: `${-(n * 0.8 + i * 0.2)}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                <circle cx="382" cy={y} r="4" fill="currentColor" />
              </g>
            );
          })}
          <circle
            cx="14"
            cy={mid}
            r="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <ul className="routing-endpoints" style={{ minHeight: height }}>
        {routes.map((route) => (
          <li key={route.id} data-tone={route.tone}>
            <button
              type="button"
              disabled={!onSelect}
              aria-pressed={selected === route.id}
              onClick={() => onSelect?.(route.id)}
              onMouseEnter={() => setHover(route.id)}
              onMouseLeave={() => setHover(undefined)}
              onFocus={() => setHover(route.id)}
              onBlur={() => setHover(undefined)}
            >
              <span>{route.name}</span>
              <small>{route.requests}/s</small>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function RouteMetrics({
  routes,
  selected,
  onSelect,
}: {
  routes: ModelRoute[];
  selected?: string;
  onSelect?: (id: string) => void;
}) {
  if (!routes.length)
    return (
      <AgentWorkspaceState
        title="No route metrics"
        description="Model metrics appear when routes are available."
      />
    );
  return (
    <div
      className="route-table-scroll"
      role="region"
      aria-label="Model route metrics"
      tabIndex={0}
    >
      <table className="route-metrics">
        <caption className="sr-only">
          Sample route allocation, latency, cost and errors
        </caption>
        <thead>
          <tr>
            <th scope="col">Routes</th>
            <th scope="col">Share</th>
            <th scope="col">P50 / P95 s</th>
            <th scope="col">$ / 1K</th>
            <th scope="col">Errors</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr
              key={route.id}
              data-tone={route.tone}
              data-selected={selected === route.id}
            >
              <th scope="row">
                <button
                  type="button"
                  disabled={!onSelect}
                  aria-pressed={selected === route.id}
                  onClick={() => onSelect?.(route.id)}
                >
                  <i className="route-dot" />
                  <span>
                    {route.name}
                    <small>{route.provider}</small>
                  </span>
                </button>
              </th>
              <td>
                <span className="route-share">
                  <span aria-hidden="true">
                    <i
                      style={{
                        width: `${Math.min(100, Math.max(0, route.share))}%`,
                      }}
                    />
                  </span>
                  {route.share}%
                </span>
              </td>
              <td>
                {route.p50.toFixed(2)} / {route.p95.toFixed(2)}
              </td>
              <td>${route.cost.toFixed(4)}</td>
              <td>{route.errors.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
