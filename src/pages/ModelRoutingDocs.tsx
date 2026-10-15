import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function ModelRoutingDocs({ nav }: { nav: DocsNav }) {
  const policy = nav.active === "routing-policy",
    flow = nav.active === "routing-flow",
    name = policy ? "Routing Policy" : flow ? "Routing Flow" : "Route Metrics";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {policy
                ? "A controlled cost, balanced and quality selector. Native buttons expose pressed state; the host owns allocation and application."
                : flow
                  ? "A gateway fan-out with model labels, request counts and optional packet motion. Selection and hover emphasize a route without obscuring its metrics."
                  : "A compact route table for allocation share, latency, cost and errors. Model buttons can open host-owned details; the region scrolls on narrow screens."}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/model-router"
            >
              Open Model Router ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                policy
                  ? 'import { RoutingPolicyControl } from "@/components/model-routing";\n\n<RoutingPolicyControl value={policy} onChange={setPolicy} />'
                  : `import { ${flow ? "RoutingFlow" : "RouteMetrics"} } from "@/components/model-routing";\n\n<${flow ? "RoutingFlow" : "RouteMetrics"} routes={routes} selected={selected} onSelect={setSelected}${flow ? " active={playing}" : ""} />`
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                policy
                  ? [
                      {
                        prop: "value",
                        type: '"cost" | "balanced" | "quality"',
                        desc: "Required controlled strategy.",
                      },
                      {
                        prop: "onChange",
                        type: "(policy: RoutingPolicy) => void",
                        desc: "Required host callback. Does not apply a policy or send network requests.",
                      },
                      {
                        prop: "disabled",
                        type: "boolean",
                        desc: "Disables all strategy controls. Default false.",
                      },
                    ]
                  : [
                      {
                        prop: "routes",
                        type: "ModelRoute[]",
                        desc: "Unique id, name, provider, tone, share (0–100), requests (per second), p50/p95 (seconds), cost (USD per 1K tokens), errors (percent). Empty arrays render a shared empty state.",
                      },
                      {
                        prop: "selected",
                        type: "string | undefined",
                        desc: "Controlled route id; defaults undefined.",
                      },
                      {
                        prop: "onSelect",
                        type: "(id: string) => void",
                        desc: "Optional selection callback. Without it, model controls are disabled and metrics remain readable.",
                      },
                      ...(flow
                        ? [
                            {
                              prop: "active",
                              type: "boolean",
                              desc: "Default true. Pauses packet animation when false or the document is hidden. Zero-request routes have no packets; reduced motion uses a static signal.",
                            },
                          ]
                        : []),
                    ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template uses local fixtures. Model names, costs, rates and
              latency values are illustrative, not current provider
              documentation. Blended cost and expected errors are weighted by
              request share; the animated packets are an explanatory signal, not
              measured events. Each environment retains its own draft and
              applied policy until reload. Applying and undoing are local
              actions.
            </p>
            <a
              href="https://x.com/disarto_max/status/2110043485743055211"
              className="mt-4 inline-block text-sm underline"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Maxim Kuznetsov ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
