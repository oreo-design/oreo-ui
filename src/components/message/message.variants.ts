import { tv } from "@/lib/tv";

/**
 * Oreo UI Message.
 *
 * One turn in the transcript. User turns read as a soft bubble on the end
 * edge (or `flat` right-aligned text); assistant turns are always flat, full
 * width — the standard chat asymmetry. Actions reveal on hover/focus of the
 * whole turn via the `group/message` scope.
 */
export const message = tv({
  slots: {
    root: "group/message flex w-full gap-3 text-[14px] leading-[1.7] text-[var(--color-text-primary)]",
    body: "flex min-w-0 flex-col",
    content: "",
    actions: [
      "flex items-center gap-0.5 pt-1",
      "opacity-0 transition-opacity duration-150",
      "group-hover/message:opacity-100 group-focus-within/message:opacity-100",
    ],
  },
  variants: {
    role: {
      user: { body: "ms-auto items-end", actions: "justify-end" },
      assistant: { body: "w-full items-start", content: "font-response" },
    },
    variant: { bubble: {}, flat: {} },
  },
  compoundVariants: [
    {
      role: "user",
      variant: "bubble",
      class: {
        content: [
          "max-w-[85%] rounded-2xl rounded-ee-md px-3.5 py-2",
          "bg-[var(--color-bg-base)] ring-1 ring-inset ring-[var(--color-border-subtle)]",
        ],
      },
    },
    { role: "user", variant: "flat", class: { content: "max-w-[85%] text-end" } },
  ],
  defaultVariants: { variant: "bubble" },
});

export type MessageVariants = Parameters<typeof message>[0];
