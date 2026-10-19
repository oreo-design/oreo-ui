import { useState, type ComponentProps, type ReactNode } from "react";
import { Accordion } from "@base-ui-components/react/accordion";
import { Icon, type IconName } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import "./aurora-accordion.css";

export type AuroraTone = "spectrum" | "mint" | "neutral";
export interface AuroraSurfaceProps extends ComponentProps<"div"> {
  active?: boolean;
  tone?: AuroraTone;
  animated?: boolean;
}
/** Decorative surface; semantics and spacing belong to its content. */
export function AuroraSurface({
  active = false,
  tone = "spectrum",
  animated = true,
  className = "",
  ...props
}: AuroraSurfaceProps) {
  return (
    <div
      {...props}
      className={`aurora-surface ${className}`}
      data-active={active || undefined}
      data-tone={tone}
      data-animated={animated}
    />
  );
}
export interface AuroraQuestion {
  id: string;
  question: string;
  answer: ReactNode;
  icon?: IconName;
  disabled?: boolean;
}
export const AURORA_QUESTIONS: readonly AuroraQuestion[] = [
  {
    id: "studio",
    question: "What does Oreo Studio do?",
    icon: "sparkle",
    answer:
      "We turn ambitious ideas into thoughtful digital experiences. From the first sketch to the final interaction, we make every detail feel considered.",
  },
  {
    id: "services",
    question: "What services do you offer?",
    icon: "paintbrush",
    answer:
      "Brand identity, websites, product design, design systems, and front-end development. We can shape a complete launch or work alongside your team.",
  },
  {
    id: "process",
    question: "How does a project run?",
    icon: "circle-dashed",
    answer:
      "We start with a conversation, agree on a clear scope, and work in focused weekly cycles. You see the work early and help shape it as we go.",
  },
  {
    id: "people",
    question: "Who do you work with?",
    icon: "users",
    answer:
      "Founders finding their first direction, small teams ready to grow, and established companies looking for a fresh perspective.",
  },
  {
    id: "start",
    question: "How do we get started?",
    icon: "paper-plane",
    answer:
      "Start with your goal, timeline, and the challenge you want to solve. A clear brief helps us find the right direction together.",
  },
];
export interface AuroraAccordionProps {
  items?: readonly AuroraQuestion[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  label?: string;
  tone?: AuroraTone;
  animated?: boolean;
  disabled?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}
export function AuroraAccordion({
  items = AURORA_QUESTIONS,
  value,
  defaultValue = null,
  onValueChange,
  label = "Frequently asked questions",
  tone = "spectrum",
  animated = true,
  disabled = false,
  emptyTitle = "No questions yet",
  emptyDescription = "Add a question and its answer to get started.",
  className = "",
}: AuroraAccordionProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [keyboard, setKeyboard] = useState(false);
  const selected = value === undefined ? internal : value;
  const active = items.some((item) => item.id === selected) ? selected : null;
  if (!items.length)
    return (
      <AgentWorkspaceState title={emptyTitle} description={emptyDescription} />
    );
  return (
    <Accordion.Root
      className={`aurora-accordion ${className}`}
      role="region"
      aria-label={label}
      multiple={false}
      disabled={disabled}
      value={active ? [active] : []}
      data-keyboard={keyboard || undefined}
      data-animated={animated}
      onKeyDownCapture={() => setKeyboard(true)}
      onPointerDownCapture={() => setKeyboard(false)}
      onValueChange={(next) => {
        const id = next.length ? String(next[0]) : null;
        if (value === undefined) setInternal(id);
        onValueChange?.(id);
      }}
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          disabled={item.disabled}
          className="aurora-item"
          render={
            <AuroraSurface
              tone={tone}
              active={active === item.id}
              animated={animated}
            />
          }
        >
          <Accordion.Header className="aurora-heading">
            <Accordion.Trigger className="aurora-trigger">
              {item.icon && (
                <Icon
                  name={item.icon}
                  size="lg"
                  className="aurora-topic-icon"
                />
              )}
              <span className="aurora-question">{item.question}</span>
              <Icon name="plus" size="md" className="aurora-plus" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="aurora-panel">
            <div className="aurora-answer">{item.answer}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
