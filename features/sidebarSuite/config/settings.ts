export const searchPageFilter = {
  language: "language",
  search: "search_string",
  limits: "limits",
} as const;

export const dbPageFilter = {
  score: "score",
  parLength: "par_length",
  limits: "limits",
  targetCollection: "target_collection",
} as const;

export const queriedDisplayOption = {
  folio: "folio",
  sortMethod: "sort_method",
  availableLanguages: "multi_lingual",
} as const;

export const localDisplayOption = {
  script: "script",
  // disabled pending review. Reinstate in features/sidebarSuite/subComponents/tabPanelGroups/DisplayOptionsSection.tsx case when showAndPositionSegmentNrs is supported
  // showAndPositionSegmentNrs: "showAndPositionSegmentNrs",
} as const;

export const utilityOption = {
  download: "download",
  copyQueryTitle: "copyQueryTitle",
  copyQueryLink: "copyQueryLink",
  emailQueryLink: "emailQueryLink",
} as const;

/** This creates a list of unique settings available across the SidebarSuite.
 */
const queryParams = {
  language: searchPageFilter.language,
  searchString: searchPageFilter.search,
  limits: searchPageFilter.limits,
  score: dbPageFilter.score,
  parLength: dbPageFilter.parLength,
  targetCollection: dbPageFilter.targetCollection,
  folio: queriedDisplayOption.folio,
  sortMethod: queriedDisplayOption.sortMethod,
} as const;

/** Relies on an API endpoint, but a query param is not set.
 */
const remote = {
  download: utilityOption.download,
  availableLanguages: queriedDisplayOption.availableLanguages,
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

export const settingRenderGroups = {
  searchPageFilter,
  dbPageFilter,
  queriedDisplayOption,
  localDisplayOption,
  utilityOption,
} as const;

export const uniqueSettings = {
  queryParams,
  remote,
  local,
} as const;
