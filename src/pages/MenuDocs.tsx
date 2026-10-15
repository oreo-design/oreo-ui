import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuItem,
  MenuSwitchItem,
  MenuCheckboxItem,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
} from "@/components/menu";
import openaiLogo from "@/components/prompt-box/assets/openai.svg";
import claudeLogo from "@/components/prompt-box/assets/claude-color.svg";
import googleLogo from "@/components/prompt-box/assets/google-color.svg";

const TOC: TocItem[] = [
  { id: "menu", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "model-select", label: "Model Select" },
  { id: "rows", label: "Rows" },
  { id: "submenus", label: "Submenus" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "Menu", type: "open · defaultOpen · onOpenChange · modal", desc: "Root. Pairs a MenuTrigger with a MenuPopup." },
  { prop: "MenuTrigger", type: "render", desc: "The opening element — pass your own button via the render prop." },
  { prop: "MenuPopup", type: 'side · align · sideOffset · container · collisionAvoidance', def: '"bottom" · "start" · 4', desc: "Portal + positioner + the styled surface. Optional container preserves nested theme tokens; collisionAvoidance enables perpendicular fallback." },
  { prop: "MenuItem", type: "icon · selected · shortcut · trailing · disabled", desc: "One row. selected shows the trailing check; shortcut renders key caps." },
  { prop: "MenuCheckboxItem", type: "checked · defaultChecked · onCheckedChange · icon · disabled", desc: "Leading checkbox for independent selections. Stays open after toggling with Base UI keyboard navigation." },
  { prop: "MenuSwitchItem", type: "checked · defaultChecked · onCheckedChange", desc: "Row with a trailing toggle; clicking flips it without closing." },
  { prop: "MenuSubmenu", type: "MenuSubmenuTrigger + MenuPopup", desc: "Nested menu — the trigger row always shows the chevron." },
  { prop: "MenuSeparator", type: "—", desc: "Hairline between row groups." },
];

/** Brand marks in menu rows; OpenAI's black mark inverts on the dark skin. */
const brandImg = "[.theme-dark_&]:invert";

function ModelMenuContent() {
  return (
    <>
      <MenuItem selected>Auto</MenuItem>
      <MenuItem>Use multiple models</MenuItem>
      <MenuSeparator />
      <MenuSubmenu>
        <MenuSubmenuTrigger icon={<img src={openaiLogo} alt="" className={brandImg} />}>OpenAI</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem>GPT-5.2 Pro</MenuItem>
          <MenuItem>GPT-5.2</MenuItem>
          <MenuItem>GPT-5 mini</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
      <MenuSubmenu>
        <MenuSubmenuTrigger icon={<img src={claudeLogo} alt="" />}>Anthropic</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem>Claude Opus 4.5</MenuItem>
          <MenuItem>Claude Sonnet 4.5</MenuItem>
          <MenuItem>Claude Haiku 4.5</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
      <MenuSubmenu>
        <MenuSubmenuTrigger icon={<img src={googleLogo} alt="" />}>Google</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem selected>Gemini 3.1 Pro</MenuItem>
          <MenuItem>Gemini 3 Flash</MenuItem>
          <MenuItem>Gemini 2.5 Pro</MenuItem>
          <MenuItem>Gemini 2.5 Flash</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
    </>
  );
}

const MODEL_CODE = `<Menu>
  <MenuTrigger render={<Button type="secondary">Model</Button>} />
  <MenuPopup>
    <MenuItem selected>Auto</MenuItem>
    <MenuItem>Use multiple models</MenuItem>
    <MenuSeparator />
    <MenuSubmenu>
      <MenuSubmenuTrigger icon={<img src={claudeLogo} alt="" />}>Anthropic</MenuSubmenuTrigger>
      <MenuPopup side="right" align="start" sideOffset={8}>
        <MenuItem>Claude Opus 4.5</MenuItem>
      </MenuPopup>
    </MenuSubmenu>
  </MenuPopup>
</Menu>`;

const ROWS_CODE = `<MenuPopup>
  <MenuItem icon={<Icon name="globe" />}>Research</MenuItem>
  <MenuSwitchItem icon={<Icon name="search" />} defaultChecked>
    Web search
  </MenuSwitchItem>
  <MenuCheckboxItem icon={<Icon name="star" />} defaultChecked>Project review</MenuCheckboxItem>
  <MenuSeparator />
  <MenuItem shortcut={["cmd", "shift", "Q"]}>Log out</MenuItem>
  <MenuItem disabled>API</MenuItem>
</MenuPopup>`;

const SUBMENU_CODE = `<MenuSubmenu>
  <MenuSubmenuTrigger icon={<Icon name="folder" />}>Add to project</MenuSubmenuTrigger>
  <MenuPopup side="right" align="start" sideOffset={8}>
    <MenuItem icon={<Icon name="folder" />} selected>multi-agent-dev</MenuItem>
    <MenuItem icon={<Icon name="folder" />}>How to use</MenuItem>
    <MenuSeparator />
    <MenuItem icon={<Icon name="plus" />}>Create new project</MenuItem>
  </MenuPopup>
</MenuSubmenu>`;

export function MenuDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Components", "Menu"]} nav={nav}>
      {({ spring }) => (
        <>
          <header id="menu" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Menu</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              The floating list surface behind pickers and overflow actions. Rows carry a 20px
              leading glyph and a trailing check, shortcut, toggle, or submenu chevron; the popup
              grows from its anchor on the Shadow/Overlay elevation.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add menu\n# or copy src/components/menu/* by hand`} />
          </Section>

          <Section
            id="model-select"
            title="Model Select"
            description="The dropdown the Prompt Box's model picker opens: a pick-one list with provider submenus."
          >
            <PreviewTabs
              code={MODEL_CODE}
              preview={
                <Menu>
                  <MenuTrigger
                    render={
                      <Button type="secondary" {...spring}>
                        Model Select
                      </Button>
                    }
                  />
                  <MenuPopup>
                    <ModelMenuContent />
                  </MenuPopup>
                </Menu>
              }
            />
          </Section>

          <Section
            id="rows"
            title="Rows"
            description="Icons, toggles, shortcuts, separators, and disabled rows — the full row vocabulary in one menu."
          >
            <PreviewTabs
              code={ROWS_CODE}
              preview={
                <Menu>
                  <MenuTrigger
                    render={
                      <Button type="secondary" {...spring}>
                        Agent config
                      </Button>
                    }
                  />
                  <MenuPopup>
                    <MenuItem icon={<Icon name="globe" />}>Research</MenuItem>
                    <MenuSwitchItem icon={<Icon name="search" />} defaultChecked>
                      Web search
                    </MenuSwitchItem>
                <MenuCheckboxItem icon={<Icon name="star" />} defaultChecked>Project review</MenuCheckboxItem>
                    <MenuSeparator />
                    <MenuItem shortcut={["cmd", "T"]}>New Team</MenuItem>
                    <MenuItem shortcut={["cmd", "shift", "Q"]}>Log out</MenuItem>
                    <MenuSeparator />
                    <MenuItem>GitHub</MenuItem>
                    <MenuItem disabled>API</MenuItem>
                  </MenuPopup>
                </Menu>
              }
            />
          </Section>

          <Section
            id="submenus"
            title="Submenus"
            description="Nest a Menu inside a row; the chevron is always shown and the nested popup opens to the side."
          >
            <PreviewTabs
              code={SUBMENU_CODE}
              preview={
                <Menu>
                  <MenuTrigger
                    render={
                      <Button type="secondary" {...spring}>
                        Attach
                      </Button>
                    }
                  />
                  <MenuPopup>
                    <MenuItem icon={<Icon name="paperclip" />}>Add files or photos</MenuItem>
                    <MenuItem icon={<Icon name="camera" />}>Take a screenshot</MenuItem>
                    <MenuSubmenu>
                      <MenuSubmenuTrigger icon={<Icon name="folder" />}>Add to project</MenuSubmenuTrigger>
                      <MenuPopup side="right" align="start" sideOffset={8}>
                        <MenuItem icon={<Icon name="folder" />} selected>
                          multi-agent-dev
                        </MenuItem>
                        <MenuItem icon={<Icon name="folder" />}>How to use</MenuItem>
                        <MenuSeparator />
                        <MenuItem icon={<Icon name="plus" />}>Create new project</MenuItem>
                      </MenuPopup>
                    </MenuSubmenu>
                    <MenuSubmenu>
                      <MenuSubmenuTrigger icon={<Icon name="paintbrush" />}>Use style</MenuSubmenuTrigger>
                      <MenuPopup side="right" align="start" sideOffset={8}>
                        <MenuItem selected>Normal</MenuItem>
                        <MenuItem>Learning</MenuItem>
                        <MenuItem>Concise</MenuItem>
                        <MenuSeparator />
                        <MenuItem icon={<Icon name="plus" />}>Create styles</MenuItem>
                      </MenuPopup>
                    </MenuSubmenu>
                    <MenuSubmenu>
                      <MenuSubmenuTrigger icon={<Icon name="plug" />}>Connectors</MenuSubmenuTrigger>
                      <MenuPopup side="right" align="start" sideOffset={8}>
                        <MenuItem icon={<Icon name="github-logo" />}>GitHub</MenuItem>
                        <MenuItem icon={<Icon name="globe" />}>Web browser</MenuItem>
                      </MenuPopup>
                    </MenuSubmenu>
                  </MenuPopup>
                </Menu>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="A thin, styled layer over Base UI Menu — every part accepts its native props.">
            <PropsTable rows={PROPS} />
          </Section>

          <footer className="border-t border-[var(--color-border-subtle)] py-8 text-[12px] text-[var(--color-text-secondary)]">
            Oreo UI — Base UI · tailwind-variants · Motion. Built as a design-system reference.
          </footer>
        </>
      )}
    </DocsPage>
  );
}
