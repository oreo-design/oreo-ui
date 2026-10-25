import { createContext } from "react";

/** Optional host for live previews; normal product menus still portal to body. */
export const PortalContainerContext = createContext<HTMLElement | null>(null);
