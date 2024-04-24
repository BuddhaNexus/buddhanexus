export const filters = {
  language: "language",
  searchString: "search_string",
  limits: "limits",
  score: "score",
  parLength: "par_length",
  multiLingual: "multi_lingual",
  targetCollection: "target_collection",
} as const;
export type PageFilter = (typeof filters)[keyof typeof filters];

export const queriedDisplayOption = {
  folio: "folio",
  sortMethod: "sort_method",
} as const;
export type QueriedDisplayOption =
  (typeof queriedDisplayOption)[keyof typeof queriedDisplayOption];

export const localDisplayOption = {
  script: "script",
  showSegmentNrs: "showSegmentNrs",
} as const;
export type LocalDisplayOption =
  (typeof localDisplayOption)[keyof typeof localDisplayOption];

export const displayOptions = {
  ...localDisplayOption,
  ...queriedDisplayOption,
} as const;
export type DisplayOption = LocalDisplayOption | QueriedDisplayOption;

export const utilityOption = {
  download: "download",
  copyQueryTitle: "copyQueryTitle",
  copyQueryLink: "copyQueryLink",
  emailQueryLink: "emailQueryLink",
} as const;
export type UtilityOption = (typeof utilityOption)[keyof typeof utilityOption];

/** This creates a list of unique queried settings available across the SidebarSuite.
 */
const queryParams = {
  language: filters.language,
  searchString: filters.searchString,
  limits: filters.limits,
  score: filters.score,
  parLength: filters.parLength,
  targetCollection: filters.targetCollection,
  multiLingual: filters.multiLingual,
  folio: queriedDisplayOption.folio,
  sortMethod: queriedDisplayOption.sortMethod,
} as const;

/** Relies on an API endpoint, but a query param is not set.
 */
const remote = {
  download: utilityOption.download,
} as const;

/** No API calls needed.
 */
const local = {
  script: localDisplayOption.script,
  showSegmentNrs: localDisplayOption.showSegmentNrs,
  copyQueryTitle: utilityOption.copyQueryTitle,
  copyQueryLink: utilityOption.copyQueryLink,
  emailQueryLink: utilityOption.emailQueryLink,
} as const;

type PageSettings = {
  search: {
    filters: Pick<typeof filters, "language" | "searchString" | "limits">;
    displayOptions: null;
    utilityOptions: Pick<
      typeof utilityOption,
      "copyQueryLink" | "emailQueryLink"
    >;
  };
  dbResult: {
    filters: Pick<
      typeof filters,
      "score" | "parLength" | "limits" | "targetCollection"
      // TODO: multiLingual awaiting spec for completion
      // needs to uncommented in `features/sidebarSuite/subComponents/tabPanelGroups/PrimarySettings.tsx` after
      // "score" | "parLength" | "multiLingual" | "limits" | "targetCollection"
    >;
    displayOptions: Record<keyof typeof displayOptions, DisplayOption>;
    utilityOptions: Record<keyof typeof utilityOption, UtilityOption>;
  };
};

// order sets appearance in sidebar
export const pageSettings: PageSettings = {
  search: {
    filters: {
      language: "language",
      searchString: "search_string",
      limits: "limits",
    },
    displayOptions: null,
    utilityOptions: {
      copyQueryLink: "copyQueryLink",
      emailQueryLink: "emailQueryLink",
    },
  },
  dbResult: {
    filters: {
      score: "score",
      parLength: "par_length",
      // multiLingual: "multi_lingual",
      limits: "limits",
      targetCollection: "target_collection",
    },
    displayOptions: {
      script: "script",
      folio: "folio",
      sortMethod: "sort_method",
      showSegmentNrs: "showSegmentNrs",
    },
    utilityOptions: {
      download: "download",
      copyQueryTitle: "copyQueryTitle",
      copyQueryLink: "copyQueryLink",
      emailQueryLink: "emailQueryLink",
    },
  },
} as const;

export const uniqueSettings = {
  queryParams,
  remote,
  local,
} as const;
