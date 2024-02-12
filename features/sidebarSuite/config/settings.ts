// order sets appearance in sidebar
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

export const queriedDisplayOption = {
  folio: "folio",
  sortMethod: "sort_method",
} as const;

export const localDisplayOption = {
  script: "script",
  showSegmentNrs: "showSegmentNrs",
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
  multiLingual: dbPageFilter.multiLingual,
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
