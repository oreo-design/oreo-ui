import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import { SiteThemeProvider } from "./lib/theme/SiteThemeProvider";
// Self-hosted Inter (variable weight axis, upright + italic). Subsets are
// unicode-range gated, so a visitor only downloads the ones their text needs.
import "@fontsource-variable/inter";
import "@fontsource-variable/inter/wght-italic.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SiteThemeProvider><App /></SiteThemeProvider>
    <Analytics />
  </StrictMode>,
);
