import type { Script } from "features/sidebarSuite/subComponents/settings/TextScriptOption";
import { atom } from "jotai";

export const isNavigationDrawerOpen = atom(false);
export const scriptSelectionAtom = atom<Script>("Unicode");
