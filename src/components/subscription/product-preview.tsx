import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { LayeredProductCard, type LayeredProductCardProps } from "./layered-product-card";

export const PRODUCT_PREVIEW_VARIANTS = ["social", "assistant", "code"] as const;
export type ProductPreviewVariant = typeof PRODUCT_PREVIEW_VARIANTS[number];
export type ProductPreviewProps = Pick<LayeredProductCardProps, "className" | "travel" | "motionEnabled"> & {
  variant: ProductPreviewVariant;
  title?: string;
  description?: string;
};

const copy = {
  social: { title: "Oreo Social", description: "Your voice, with a little more reach." },
  assistant: { title: "Oreo Assistant", description: "Think, research, and create together." },
  code: { title: "Oreo Code", description: "From a first idea to a working product." },
};

function SocialScene() {
  return <div className="h-full p-3">
    <div className="flex items-start gap-2"><Avatar name="Alex Park" agent="bloom" size="xs" /><div className="min-w-0 text-[10px] leading-4"><div className="flex items-center gap-1 font-semibold">Alex Park <Icon name="check" className="size-3 text-status-progress" /></div><span className="text-text-tertiary">@alex · 2h</span><p className="mt-1">A little room to dream.</p></div></div>
    <div className="oreo-product-landscape mt-3 ml-7 overflow-hidden rounded-control-large"><span className="oreo-product-sun" /><span className="oreo-product-building" /><span className="oreo-product-building oreo-product-building-small" /></div>
  </div>;
}
function AssistantScene() {
  return <div className="space-y-1 p-2">{[
    { name: "Atlas", role: "Your creative partner", agent: "nova" as const },
    { name: "Nova", role: "Inbox, under control", agent: "void" as const },
    { name: "Iris", role: "Find the right answer", agent: "jade" as const },
    { name: "Echo", role: "Make room for ideas", agent: "flare" as const },
    { name: "Juno", role: "Research, connected", agent: "silk" as const },
  ].map((agent, i) => <div key={agent.name} className={`flex items-center gap-2 rounded-control px-1.5 py-1.5 ${i === 0 ? "bg-state-press" : ""}`}><Avatar name={agent.name} agent={agent.agent} size="xs" /><div className="min-w-0 text-[10px] leading-3.5"><p className="font-semibold">{agent.name}</p><p className="truncate text-text-secondary">{agent.role}</p></div></div>)}</div>;
}
function CodeScene() {
  return <div className="h-full font-mono text-[10px] leading-5"><div className="flex items-center gap-1 border-b border-border-subtle px-3 py-2"><span className="size-1.5 rounded-full bg-palette-pink-text" /><span className="size-1.5 rounded-full bg-palette-orange-text" /><span className="size-1.5 rounded-full bg-status-success" /><span className="ml-2 text-[9px] text-text-tertiary">hero.tsx</span></div><div className="pt-2">{[
    ["", "function Hero() {"], ["", "  return ("], ["−", "    <Stack>"], ["+", '    <Grid cols={2}>'], ["", "      <Title />"], ["", "      <Demo />"], ["−", "    </Stack>"], ["+", "    </Grid>"], ["", "  );"],
  ].map(([change, line], i) => <div key={i} className={`flex whitespace-pre px-2 ${change === "+" ? "bg-palette-mint-bg text-palette-mint-text" : change === "−" ? "bg-palette-pink-bg text-palette-pink-text" : "text-text-secondary"}`}><span className="w-4 shrink-0 text-text-tertiary">{i + 1}</span><span className="w-3 shrink-0">{change}</span>{line}</div>)}</div></div>;
}

/** Independent, non-interactive product illustrations; no external assets or nested controls. */
export function ProductPreview({ variant, title, description, ...props }: ProductPreviewProps) {
  const meta = copy[variant];
  const background = variant === "social" ? <SocialScene /> : variant === "assistant" ? <AssistantScene /> : <CodeScene />;
  const foreground = variant === "social" ? <div className="flex items-center gap-2 px-3 py-2.5"><span className="flex size-5 items-center justify-center rounded-full bg-status-progress text-text-on-inverse"><Icon name="check" className="size-3" /></span><div className="text-[10px] leading-3.5"><p className="font-semibold">Plus member</p><p className="text-text-secondary">A little more possibility</p></div></div> : variant === "assistant" ? <div className="flex items-center gap-2.5 p-2.5"><span className="grid size-9 shrink-0 place-items-center rounded-control-large bg-palette-mint-bg text-palette-mint-text"><Icon name="sparkle" className="size-5" /></span><div className="text-[10px] leading-3.5"><p className="font-semibold">An idea, taking shape</p><p className="text-text-secondary">Made with Atlas</p></div></div> : <div className="p-3"><p className="text-[10px]">Make the hero responsive</p><div className="mt-3 flex items-center justify-between"><span className="rounded-full border border-border-default p-0.5 text-text-secondary"><Icon name="plus" className="size-3" /></span><span className="rounded-full bg-bg-inverse p-1 text-text-on-inverse"><Icon name="arrow-up" className="size-3" /></span></div></div>;
  return <LayeredProductCard {...props} title={title ?? meta.title} description={description ?? meta.description} mark={<Icon name={variant === "social" ? "chat" : variant === "assistant" ? "sparkle" : "cursor"} className="size-6" />} background={background} foreground={foreground} />;
}
