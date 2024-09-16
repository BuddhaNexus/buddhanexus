import { DbViewEnum, defaultDBView } from "components/hooks/useDbView";
import type { Script } from "features/sidebarSuite/subComponents/settings/TextScriptOption";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { SourceLanguage } from "utils/constants";

/**
 * GENERAL
 */

export const currentViewAtom = atom<DbViewEnum>(defaultDBView);

/**
 * SETTINGS SIDEBAR
 */
export const isNavigationDrawerOpen = atom(false);
export const scriptSelectionAtom = atomWithStorage<Script>(
  "text-script-selection",
  "Unicode",
);
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
