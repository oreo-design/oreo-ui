import { createContext, useContext, useMemo, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";

const TypographyContext = createContext<CSSProperties | null>(null);

/** A nested appearance owns its text roles even when descendants portal to body. */
export function ThemeScope({ style, className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  const parent = useContext(TypographyContext);
  const typography = useMemo(() => ({
    ...parent,
    ...Object.fromEntries(Object.entries(style ?? {}).filter(([key]) => key.startsWith("--font-"))),
  }) as CSSProperties, [parent, style]);
  return <TypographyContext.Provider value={typography}>
    <div {...props} className={className ? `oreo-theme-scope ${className}` : "oreo-theme-scope"} style={style}>{children}</div>
  </TypographyContext.Provider>;
}

/** No extra box; retain Base UI positioning, focus, dismissal and portal host. */
export function ThemePortalTypography({ children }: { children: ReactNode }) {
  const typography = useContext(TypographyContext);
  if (!typography) return children;
  return <div className="oreo-theme-scope" style={{ ...typography, display: "contents" }}>{children}</div>;
}
