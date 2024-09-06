import { DbViewEnum } from "features/sidebarSuite/config/types";
import type { Script } from "features/sidebarSuite/subComponents/settings/TextScriptOption";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { SourceLanguage } from "utils/constants";

/**
 * GENERAL
 */

export const currentViewAtom = atom<DbViewEnum>(DbViewEnum.TEXT);

/**
 * SETTINGS SIDEBAR
 */
export const isNavigationDrawerOpen = atom(false);
export const scriptSelectionAtom = atom<Script>("Unicode");
export const isSettingsOpenAtom = atom(true);
export const defaultSourceLanguagesSelection = atom<SourceLanguage[]>([]);

/**
 * TEXT VIEW
 */
export const textViewFilterComparisonAtom = atom<string | undefined>(undefined);
export const shouldShowSegmentNumbersAtom = atomWithStorage<boolean>(
  "shouldShowSegmentNumbers",
  true,
);
export const shouldUseMonochromaticSegmentColorsAtom = atomWithStorage<boolean>(
  "shouldUseMonochromaticSegmentColors",
  false,
);

export const selectedSegmentMatchesAtom = atom<string[]>([]);
