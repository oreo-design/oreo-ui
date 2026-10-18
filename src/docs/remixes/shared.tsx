import type { ComponentProps, ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Button } from "@/components/button";

export function Action(props: ComponentProps<typeof Button>) {
  const reduce = useReducedMotion();
  return <Button type="secondary" size="sm" tapScale={reduce ? 1 : 0.97} {...props} />;
}
export function Status({ children }: { children: ReactNode }) {
  return <p className="remix-status" role="status">{children}</p>;
}
export type ExampleProps = { mode: "original" | "capability" | "style"; stress: boolean };
