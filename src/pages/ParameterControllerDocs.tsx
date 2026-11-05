import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function ParameterControllerDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Parameter Controller"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "Properties" },
        { id: "rules", label: "Interaction & tokens" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold">Parameter Controller</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Card-based numeric, color, power, selection, XY and shadow
              controls. Recreated from the four Tuner references by{" "}
              <a
                className="underline"
                href="https://x.com/lincidesign/status/2118152731642954107"
              >
                linci
              </a>
              , then mapped to Oreo foundation tokens.
            </p>
            <a
              className="inline-block mt-4 underline"
              href="/parameter-controller"
            >
              Open all four complete examples →
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                'import { NumberParameter, XYParameter } from "@/components/parameter-controller";\n\n<NumberParameter label="宽度" value={width} onChange={setWidth}\n  min={0} max={640} step={1} unit="px" />\n<XYParameter value={point} onChange={setPoint} />'
              }
            />
          </Section>
          <Section id="api" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "NumberParameter",
                  type: "label, value, onChange, min, max, step, unit, disabled, compact",
                  desc: "Controlled numeric value; editable spinbutton plus vertical drag/keyboard knob. Defaults min 0 / max 1000 / step 1 / px. Optional onEditStart/onEditEnd group a drag or typing session in history.",
                },
                {
                  prop: "ColorParameter",
                  type: "label, value, onChange, opacity?, onOpacityChange?, disabled",
                  desc: "Six-digit HEX color. Native color input plus text entry. With opacity, the truncated RGB readout opens a percentage slider; swatch retains its native picker. Invalid text restores the last valid value on blur.",
                },
                {
                  prop: "ToggleParameter / SelectParameter",
                  type: "label, checked|value, onChange, disabled, onLabel/offLabel | options",
                  desc: "Base UI switch with a round power face. Native select with real value/label options. Empty options render a disabled no-options state. Copy is host-owned.",
                },
                {
                  prop: "XYParameter",
                  type: "value, onChange, min, max, step, unit, label, compact, disabled",
                  desc: "Defaults 0–100%, step 1. X grows right and Y grows down. Pointer capture supports mouse/pen/touch; two native numeric fields provide keyboard editing. Compact is the embedded shadow pad: supply visible external X/Y inputs, as ShadowParameter does.",
                },
                {
                  prop: "ShadowParameter",
                  type: "value: ShadowLayer[], onChange, disabled, onEditStart/onEditEnd",
                  desc: "Each stable ID owns x/y/blur/spread/color/opacity. Select, add (maximum eight) and remove layers. Empty is a legitimate no-shadow state with an Add action. shadowCSS serializes values for the host.",
                },
                {
                  prop: "ParameterPanel / ParameterSection",
                  type: "title, children, toolbar, footer, theme/reset callbacks / title, open, onToggle",
                  desc: "Panel owns header, surface and minimize behavior. Section disclosure is controlled. Panel does not impose business data or history; the complete example owns those.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="States, copy, layout and tokens">
            <div className="space-y-3 text-sm leading-7 text-text-secondary">
              <p>
                Each control updates immediately, including keyboard input.
                Knob: drag vertically, arrows ±step, Shift+arrow ±10 steps,
                Home/End bounds. Numeric fields accept typing; Enter commits and
                blur normalizes. XY drag has pointer capture and ignores a
                second pointer. Values stay clamped. Disabled controls retain
                their current values and are not interactive.
              </p>
              <p>
                The Tuner example includes Original, saved local presets, reset,
                minimize, section collapse and a 50-entry undo/redo history. A
                drag or typing session is one history entry. Presets and values
                are local in-memory fixtures; they do not persist across a
                reload or mutate an external application. Shadow and XY examples
                are independent controlled compositions.
              </p>
              <p>
                Labels and unit copy are independent from geometry. Default
                Chinese copy matches the reference. Allow wrapping for longer
                labels; do not remove accessible labels. Keep card pairs in a
                two-column grid and the panel in normal flow; compact numeric
                controls belong inside XY/shadow compositions. In a custom host,
                use a readable minimum width and preserve the panel's complete
                actions.
              </p>
              <p>
                Reference-first geometry is preserved, then foundation aliases
                resolve to existing Oreo backgrounds, text, border,
                accent/success, spacing, type, radius and shadow tokens. The new
                family reuses the canonical smooth-corner and feedback layers.
                Exact source colors are retained only as editable parameter
                data, never hardcoded UI paint. Token substitutions and
                reference comparisons are recorded in the task review.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
