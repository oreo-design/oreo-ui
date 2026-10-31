import { SourceReference } from "@/docs/SourceReference";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Avatar, AvatarGroup, AGENTS, type AvatarColor } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";

const TOC: TocItem[] = [
  { id: "avatar", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "types", label: "Types" },
  { id: "alphabet", label: "Alphabet" },
  { id: "agents", label: "Agents" },
  { id: "sizes", label: "Sizes" },
  { id: "group", label: "Avatar group" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "src", type: "string", desc: "Photo URL — renders the portrait type." },
  { prop: "name", type: "string", desc: "Used for initials (alphabet) and as image alt text." },
  { prop: "color", type: `"black" | "white" | palette`, def: `"default"`, desc: "Alphabet fill color." },
  { prop: "agent", type: `"nova" | "void" | "jade" | …`, desc: "Gradient agent identity — renders the agent type." },
  { prop: "logo", type: "ReactNode", desc: "Brand mark — renders the logo type, centered on an elevated bg." },
  { prop: "size", type: `"xs" | "sm" | "md" | "lg"`, def: `"md"`, desc: "Diameter: 24 / 32 / 48 / 64px." },
];

const PORTRAITS = [1, 5, 12, 32, 47, 9].map((n) => `https://i.pravatar.cc/128?img=${n}`);
const ALPHABET: AvatarColor[] = ["black", "white", "purple", "blue", "mint", "pink", "brown", "orange"];

const CODE_TYPES = `import { Avatar } from "@/components/avatar";

<Avatar />                                      {/* empty */}
<Avatar src="/u/ada.jpg" name="Ada Lovelace" /> {/* portrait */}
<Avatar logo={<OreoLogo />} name="Oreo" />      {/* logo */}
<Avatar name="Oreo UI" color="purple" />        {/* alphabet */}
<Avatar agent="nova" />                          {/* agent */}`;

const CODE_GROUP = `import { Avatar, AvatarGroup } from "@/components/avatar";

<AvatarGroup max={4}>
  {users.map((u) => <Avatar key={u.id} src={u.avatar} name={u.name} />)}
</AvatarGroup>`;

export function AvatarDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Components", "Avatar"]} nav={nav}>
      {() => (
        <>
          <header id="avatar" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Avatar</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A flexible avatar component for representing users, agents, model providers, and brands. The type is
              inferred from props: a photo (<code>src</code>), a gradient <code>agent</code> identity, a brand{" "}
              <code>logo</code>, initials from a <code>name</code>, or an empty placeholder. Always a circle.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="avatar" />
          </Section>

          <Section id="types" title="Types" description="Empty, portrait (photo), logo (brand mark), alphabet (initials), and agent (gradient).">
            <PreviewTabs
              code={CODE_TYPES}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Avatar />
                  <Avatar src={PORTRAITS[0]} name="Ada" />
                  <Avatar logo={<OreoLogo className="h-1/2 w-auto" />} name="Oreo" />
                  <Avatar logo={<Icon name="github-logo" size="lg" />} name="GitHub" />
                  <Avatar name="Oreo UI" color="purple" />
                  <Avatar agent="nova" />
                </div>
              }
            />
          </Section>

          <Section id="alphabet" title="Alphabet" description="Initials on a colored fill — a stable placeholder when no image is available. Eight tones, including black and white.">
            <PreviewTabs
              code={`<Avatar name="Oreo UI" color="mint" />`}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {ALPHABET.map((c) => (
                    <Avatar key={c} name="Oreo" color={c} />
                  ))}
                </div>
              }
            />
          </Section>

          <Section id="agents" title="Agents" description="Gradient avatars for AI agents and bots — distinct personalities, no photo required.">
            <PreviewTabs
              code={`<Avatar agent="jade" />`}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {AGENTS.map((a) => (
                    <Avatar key={a} agent={a} />
                  ))}
                </div>
              }
            />
          </Section>

          <Section id="sizes" title="Sizes" description="Four diameters: xs 24, sm 32, md 48, lg 64px. The initials scale with the circle.">
            <PreviewTabs
              code={`<Avatar name="Oreo" color="blue" size="lg" />`}
              preview={
                <div className="flex flex-wrap items-end justify-center gap-3">
                  {(["xs", "sm", "md", "lg"] as const).map((s) => (
                    <Avatar key={s} name="Oreo" color="blue" size={s} />
                  ))}
                  <Avatar src={PORTRAITS[1]} name="User" size="lg" />
                  <Avatar logo={<Icon name="apple-logo" weight="fill" size="lg" />} name="Apple" size="lg" />
                </div>
              }
            />
          </Section>

          <Section id="group" title="Avatar group" description="Stacked avatars for displaying multiple people. Overlapping layout with an overflow count (+N) when the group exceeds the visible limit.">
            <PreviewTabs
              code={CODE_GROUP}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <AvatarGroup>
                    {AGENTS.slice(0, 4).map((a) => (
                      <Avatar key={a} agent={a} />
                    ))}
                  </AvatarGroup>
                  <AvatarGroup max={4}>
                    {PORTRAITS.map((src, i) => (
                      <Avatar key={i} src={src} name={`User ${i + 1}`} />
                    ))}
                  </AvatarGroup>
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="Avatar extends native <span> props.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
