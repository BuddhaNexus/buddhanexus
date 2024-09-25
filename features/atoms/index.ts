import { SourceTextTreeNode } from "@components/db/SourceTextTree/types";
import type { Script } from "features/sidebarSuite/subComponents/settings/TextScriptOption";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { DbViewEnum, DEFAULT_DB_VIEW, SourceLanguage } from "utils/constants";

/**
 * GENERAL
 */

export const currentViewAtom = atom<DbViewEnum>(DEFAULT_DB_VIEW);

/**
 * SOURCE DATA TREE
 */

export const isSourceTextBrowserDrawerOpen = atom(false);

/**
 * SETTINGS SIDEBAR
 */
export const scriptSelectionAtom = atomWithStorage<Script>(
  "text-script-selection",
  "Unicode",
);
export const isSettingsOpenAtom = atom(true);
export const defaultSourceLanguagesSelection = atom<SourceLanguage[]>([]);
export const selectedExcludeSourceFilterAtom = atom<SourceTextTreeNode[]>([]);
export const selectedIncludeSourceFilterAtom = atom<SourceTextTreeNode[]>([]);

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
