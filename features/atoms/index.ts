import type { Script } from "features/sidebarSuite/subComponents/settings/TextScriptOption";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { SourceLanguage } from "utils/constants";

export const isNavigationDrawerOpen = atom(false);
export const scriptSelectionAtom = atomWithStorage<Script>(
  "text-script-selection",
  "Unicode",
);
export const isSettingsOpenAtom = atom(true);
export const defaultSourceLanguagesSelection = atom<SourceLanguage[]>([]);
export const textViewFilterComparisonAtom = atom<string | undefined>(undefined);
