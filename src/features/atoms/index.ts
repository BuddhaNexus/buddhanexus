import type { Script } from "@features/sidebarSuite/subComponents/settings/TextScriptOption";
import type { SourceLanguage } from "@utils/constants";
import { atom } from "jotai";

export const isNavigationDrawerOpen = atom(false);
export const scriptSelectionAtom = atom<Script>("Unicode");
export const isSettingsOpenAtom = atom(true);
export const defaultSourceLanguagesSelection = atom<SourceLanguage[]>([]);
export const textViewFilterComparisonAtom = atom<string | undefined>(undefined);
