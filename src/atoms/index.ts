import { TreeApi } from "react-arborist";
import { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { DbSourceFiltersSelectedIds } from "@features/sidebarSuite/config/types";
import type { Script } from "@features/sidebarSuite/subComponents/settings/TextScriptOption";
import { DbViewEnum, DEFAULT_DB_VIEW, SourceLanguage } from "@utils/constants";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

/**
 * GENERAL
 */

export const currentDbViewAtom = atom<DbViewEnum>(DEFAULT_DB_VIEW);

/**
 * SOURCE DATA TREE
 */

export const isDbSourceBrowserDrawerOpenAtom = atom(false);
export const activeDbSourceBrowserTreeAtom = atom<
  TreeApi<DbSourceTreeNode> | null | undefined
>(null);

/**
 * SETTINGS SIDEBAR
 */
export const scriptSelectionAtom = atomWithStorage<Script>(
  "text-script-selection",
  "Unicode",
);
export const isSettingsOpenAtom = atom(true);
export const defaultSourceLanguagesSelection = atom<SourceLanguage[]>([]);
export const dbSourceFiltersSelectedIdsAtom = atom<DbSourceFiltersSelectedIds>({
  exclude: [],
  include: [],
});

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
