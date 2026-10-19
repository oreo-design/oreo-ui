import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable } from "@/docs/primitives";
import {
  BreakoutNavigator,
  DestinationProgress,
  RecoveryMessage,
  BREAKOUT_DESTINATIONS,
} from "@/components/breakout-navigation";
import { PAGE_META } from "@/lib/site";
export function BreakoutNavigationDocs({ nav }: { nav: DocsNav }) {
  const [run, setRun] = useState(0),
    isGame = nav.active === "breakout-navigator",
    isProgress = nav.active === "destination-progress";
  const preview = isGame ? (
    <BreakoutNavigator resetKey={run} />
  ) : isProgress ? (
    <DestinationProgress
      destinations={BREAKOUT_DESTINATIONS}
      hits={{ components: 8, templates: 3, motion: 1 }}
    />
  ) : (
    <RecoveryMessage />
  );
  const code = isGame
    ? '<BreakoutNavigator destinations={destinations} goal={8} speed="calm" trail onProgress={setProgress} />'
    : isProgress
      ? "<DestinationProgress destinations={destinations} hits={hits} goal={8} compact={false} />"
      : '<RecoveryMessage title="Breakout of the 404 maze" description="Take a detour, or go straight to" href="/" linkLabel="home" />';
  return (
    <DocsPage
      nav={nav}
      breadcrumb={[
        "Components",
        PAGE_META[nav.active as keyof typeof PAGE_META].title,
      ]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "preview", label: "Composition" },
        { id: "api", label: "Properties" },
        { id: "rules", label: "States, copy & layout" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">
              {PAGE_META[nav.active as keyof typeof PAGE_META].title}
            </h1>
            <p className="mt-3 text-sm text-text-secondary leading-7">
              A playful recovery path inspired by{" "}
              <a
                className="underline"
                href="https://x.com/abhisek_im/status/2112015149569888373"
              >
                Abhisek Mishra’s interactive 404
              </a>
              . A dotted board, navigation targets, progress and a direct way
              home.
            </p>
            <a
              className="inline-block mt-4 text-sm underline"
              href="/breakout-404"
            >
              Open the complete 404 template →
            </a>
          </header>
          <Section id="preview" title="Composition">
            <PreviewTabs
              preview={<div className="w-full p-5">{preview}</div>}
              code={code}
            />
            {isGame && (
              <button
                className="text-xs underline mt-3"
                onClick={() => setRun(run + 1)}
              >
                Reset this example
              </button>
            )}
          </Section>
          <Section id="api" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "BreakoutNavigator: destinations",
                  type: "readonly BreakoutDestination[]",
                  desc: "Stable id, label, href and Oreo icon; first six unique IDs. Empty input uses the shared recovery state. Destination IDs/configuration changes reset the round.",
                },
                {
                  prop: "goal / speed / trail / resetKey",
                  type: "number / calm | brisk / boolean / number",
                  desc: "Independent target count (1–12, default 8), ball speed, decorative trail and explicit reset. Defaults: calm, trail enabled, reset key 0. Reduced motion hides the trail without changing game physics.",
                },
                {
                  prop: "onProgress",
                  type: "(progress: BreakoutProgress) => void",
                  desc: "Phase, hits keyed by destination ID and miss count; fires on meaningful changes, not every frame. Runtime is local; host owns persistence.",
                },
                {
                  prop: "DestinationProgress: destinations / hits / goal / compact",
                  type: "array / Record<string,number> / number / boolean",
                  desc: "Controlled navigation progress; missing counts become zero, completion is capped at goal. Compact uses two columns. Links remain available before completion.",
                },
                {
                  prop: "RecoveryMessage: title / description / href / linkLabel / eyebrow / children",
                  type: "string / ReactNode",
                  desc: "Independent recovery copy, direct destination and optional secondary content. Empty eyebrow hides the status line. Caller supplies a valid direct route; rendered as the page’s main h1.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="Interaction, copy and layout">
            <div className="space-y-3 text-sm text-text-secondary leading-7">
              <p>
                Focus the board: Space launches or pauses, arrows / A and D
                steer, Escape pauses. Pointer and touch positions map to the
                logical game field at every size. Losing focus outside the game
                or hiding the tab pauses. A miss keeps target progress and waits
                for an explicit relaunch. Clear all targets to finish; Restart
                resets the round. No timed navigation or automatic redirects.
              </p>
              <p>
                Navigation never requires playing or winning. Labels, links and
                recovery copy belong to the host; built-in game hints and status
                messages are English and can be translated in the component.
                Labels wrap, counts remain readable. Keep destination IDs
                unique. Page-level h1 copy should not be repeated within a
                nested modal or another h1.
              </p>
              <p>
                The canvas reuses the Page Loader GameStage and token colors. It
                scales within the available width; progress sits beside it on
                desktop and below on narrow screens. Recovery content remains
                centered below; no fixed overlay obscures the playing area.
                Controls use shared Oreo buttons. Decorative trails stop under
                reduced motion; essential ball movement only starts after a user
                action.
              </p>
              <p>
                There is no network loading in this local game. Empty
                destination data uses AgentWorkspaceState. No real HTTP 404
                routing is installed: the template is a reusable page that the
                host router can choose for missing routes. Existing Page Loader
                minigames retain their fixed-size defaults.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
