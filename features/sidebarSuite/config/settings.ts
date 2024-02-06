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

// --------
export const searchPageFilter = {
  language: "language",
  search: "search_string",
  limits: "limits",
} as const;

// order sets appearance in sidebar
export const dbPageFilter = {
  score: "score",
  parLength: "par_length",
  multiLingual: "multi_lingual",
  limits: "limits",
  targetCollection: "target_collection",
} as const;
// --------

export const queriedDisplayOption = {
  folio: "folio",
  sortMethod: "sort_method",
} as const;
export type QueriedDisplayOption =
  (typeof queriedDisplayOption)[keyof typeof queriedDisplayOption];

export const localDisplayOption = {
  script: "script",
  // TODO: disabled pending review. Reinstate in features/sidebarSuite/subComponents/tabPanelGroups/DisplayOptionsSection.tsx case when showAndPositionSegmentNrs is supported
  // showAndPositionSegmentNrs: "showAndPositionSegmentNrs",
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
  // showAndPositionSegmentNrs: localDisplayOption.showAndPositionSegmentNrs,
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
      "score" | "parLength" | "multiLingual" | "limits" | "targetCollection"
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
      multiLingual: "multi_lingual",
      limits: "limits",
      targetCollection: "target_collection",
    },
    displayOptions: {
      script: "script",
      folio: "folio",
      sortMethod: "sort_method",
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
