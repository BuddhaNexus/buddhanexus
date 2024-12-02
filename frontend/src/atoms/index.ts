import { NodeApi, TreeApi } from "react-arborist";
import { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import type { Script } from "@features/SidebarSuite/types";
import { DbSourceFiltersSelectedIds } from "@features/SidebarSuite/types";
import { DbViewEnum, DEFAULT_DB_VIEW } from "@utils/constants";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

/**
 * GENERAL
 */

export const currentDbViewAtom = atomWithStorage<DbViewEnum>(
  "db-view",
  DEFAULT_DB_VIEW,
);

/**
 * SEARCH
 */

export const isSearchTriggeredAtom = atom(false);

/**
 * SOURCE DATA TREE
 */

export const isDbSourceBrowserDrawerOpenAtom = atom(false);
export const activeDbSourceTreeAtom = atom<
  TreeApi<DbSourceTreeNode> | null | undefined
>(null);
export const activeDbSourceTreeBreadcrumbsAtom = atom<
  NodeApi<DbSourceTreeNode>[]
>([]);
export const focusedDbSourceTreeNodeAtom = atom<
  NodeApi<DbSourceTreeNode> | null | undefined
>(null);

/**
 * SETTINGS SIDEBAR
 */
export const scriptSelectionAtom = atomWithStorage<Script>(
  "text-script-selection",
  "Unicode",
);
export const isSettingsOpenAtom = atom(true);
export const dbSourceFiltersSelectedIdsAtom = atom<DbSourceFiltersSelectedIds>({
  exclude_sources: [],
  include_sources: [],
});

/**
 * TEXT VIEW
 */
export const textViewFilterComparisonAtom = atom<string | undefined>(undefined);
export const textViewRightPaneFileNameAtom = atom<string | undefined>(
  undefined,
);
export const textViewIsMiddlePanePointingLeftAtom = atom<boolean | undefined>(
  undefined,
);
export const shouldShowSegmentNumbersAtom = atomWithStorage<boolean>(
  "shouldShowSegmentNumbers",
  true,
);
export const shouldUseMonochromaticSegmentColorsAtom = atomWithStorage<boolean>(
  "shouldUseMonochromaticSegmentColors",
  false,
);

export const activeSegmentMatchesAtom = atom<string[]>([]);

export const hoveredOverParallelIdAtom = atom<string>("");
