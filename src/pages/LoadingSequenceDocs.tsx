import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { LoadingSequenceGallery } from "@/docs/playground/loading-sequence.preview";

export function LoadingSequenceDocs({nav}: {nav: DocsNav}) {
  return <DocsPage nav={nav} breadcrumb={["Components", "Loading Sequence"]} toc={[
    {id:"introduction",label:"Introduction"},{id:"sequences",label:"Four sequences"},{id:"usage",label:"Usage"},{id:"accessibility",label:"Motion & accessibility"},{id:"api",label:"API reference"},
  ]}>{()=> <>
    <header id="introduction" className="scroll-mt-8 pb-8"><h1 className="text-3xl font-semibold tracking-tight">Loading Sequence</h1><p className="mt-3 max-w-prose text-sm leading-7 text-text-secondary">Make an entrance. Four finite page reveals, from words finding their place to a curtain lifting on the next scene.</p><p className="mt-3 text-xs text-text-tertiary">Motion studies from <a href="https://x.com/details_so/status/2109725163021382032?s=20" target="_blank" rel="noreferrer" className="underline underline-offset-4">Details’ four loading animations</a>. Original demo artwork, Oreo colors, and your own content.</p></header>
    <Section id="sequences" title="A first impression, four ways" description="Replay the four sequences together. The preview controls pause at the current frame; replay starts a fresh run."><LoadingSequenceGallery /></Section>
    <Section id="usage" title="Bring your own scene" description="Copy the loading-sequence folder, including its CSS, with Oreo’s cn helper and design tokens. Mount it when your content is ready."><CodeBlock code={`import { LoadingSequence } from "@/components/loading-sequence";

<LoadingSequence
  variant="curtain"
  playing={playing}
  replayKey={replayCount}
  onComplete={() => console.log("Intro complete")}
>
  <YourHero />
</LoadingSequence>

// Typography: newline separates the headline.
<LoadingSequence
  variant="typography"
  headline={"Made with care\\nBuilt for people"}
  duration={3.2}
>
  <YourPortfolio />
</LoadingSequence>`}/><p className="mt-4 text-sm leading-6 text-text-secondary">These are presentation sequences, not network progress indicators. They do not fetch data, invent percentages, or delay a real loading error. Render your existing error and retry UI before mounting the intro.</p></Section>
    <Section id="accessibility" title="Motion with an exit" description="Each sequence plays once and stops. The final scene stays mounted, and its controls become available when the intro finishes."><ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-text-secondary"><li>Reduced motion replaces movement with a 200 ms crossfade.</li><li>Hidden content is inert and removed from the accessibility tree until completion.</li><li>Pausing freezes CSS timelines. Changing replayKey restarts them.</li><li>Use these for an occasional introduction, not every route change.</li><li>Backdrop and logo accept your artwork. The demo’s CSS landscapes are illustrative, not copies of the source websites.</li></ul></Section>
    <Section id="api" title="API reference"><PropsTable rows={[
      {prop:"variant",type:"typography | aperture | wordmark | curtain",def:"typography",desc:"Selects the entry and reveal choreography."},
      {prop:"duration",type:"number",def:"3.2 / 4.6 / 8.7 / 4.5",desc:"Full sequence in seconds. Clamped to 0.5–30. Reduced motion uses 0.2 seconds."},
      {prop:"playing",type:"boolean",def:"true",desc:"Pause or resume all timelines in place."},
      {prop:"replayKey",type:"string | number",def:"0",desc:"Change to remount the sequence from its initial frame."},
      {prop:"headline / brand",type:"string",desc:"Typography headline (supports newlines), or the wordmark letters."},
      {prop:"logo / backdrop",type:"ReactNode",desc:"Custom curtain mark or intro artwork. Decorative; supply meaningful descriptions outside the intro."},
      {prop:"children",type:"ReactNode",desc:"The real destination scene, mounted throughout the sequence."},
      {prop:"onComplete",type:"() => void",desc:"Called once when the timeline finishes, including reduced motion."},
      {prop:"className / style",type:"string / CSSProperties",desc:"Override the container size and appearance. Default aspect ratio is 16:10."},
    ]}/></Section>
  </>}</DocsPage>;
}
