import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";
export type ThemeMode = readonly [boolean, Dispatch<SetStateAction<boolean>>];
export const SiteThemeModeContext = createContext<ThemeMode | null>(null);
/** Site templates share the root preference; copied standalone templates keep their local controls. */
export function useThemeMode(initial: boolean | (() => boolean) = false): ThemeMode {
  const local = useState(initial);
  return useContext(SiteThemeModeContext) ?? local;
}
