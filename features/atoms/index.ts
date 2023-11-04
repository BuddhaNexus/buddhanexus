import type { Script } from "features/sidebarSuite/subComponents/settings/TextScriptOption";
import { atom } from "jotai";
import type { SourceLanguage } from "utils/constants";

export const isNavigationDrawerOpen = atom(false);
export const scriptSelectionAtom = atom<Script>("Unicode");
export const isSettingsOpenAtom = atom(true);
export const defaultSourceLanguagesSelection = atom<SourceLanguage[]>([]);
