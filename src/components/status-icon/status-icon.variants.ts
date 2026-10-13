import { tv } from "@/lib/tv";

export const statusIcon = tv({
  base: "oreo-status-icon inline-block shrink-0 align-middle",
  variants: {
    size: { sm: "size-4", md: "size-5", lg: "size-6", xl: "size-8" },
  },
  defaultVariants: { size: "md" },
});
