export const searchPageFilter = {
  language: "language",
  search: "search_string",
  includeCollection: "include_collection",
  includeText: "include_text",
  excludeCollection: "exclude_collection",
  excludeText: "exclude_text",
} as const;

export const dbPageFilter = {
  score: "score",
  parLength: "par_length",
  includeCollection: "include_collection",
  includeText: "include_text",
  excludeCollection: "exclude_collection",
  excludeText: "exclude_text",
  targetCollection: "target_collection",
} as const;

export const queriedDisplayOption = {
  folio: "folio",
  multiLingual: "multi_lingual",
  sortMethod: "sort_method",
} as const;

export const localDisplayOption = {
  script: "script",
  showAndPositionSegmentNrs: "showAndPositionSegmentNrs",
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
  includeCollection: searchPageFilter.includeCollection,
  includeText: searchPageFilter.includeText,
  excludeCollection: searchPageFilter.excludeCollection,
  excludeText: searchPageFilter.excludeText,
  score: dbPageFilter.score,
  parLength: dbPageFilter.parLength,
  targetCollection: dbPageFilter.targetCollection,
  folio: queriedDisplayOption.folio,
  multiLingual: queriedDisplayOption.multiLingual,
  sortMethod: queriedDisplayOption.sortMethod,
} as const;

/** A results (.xmlx) download is triggered via an API endpoint, but is never set as a query param.
 */
const remote = {
  download: utilityOption.download,
} as const;

/** No API calls needed.
 */
const local = {
  script: localDisplayOption.script,
  showAndPositionSegmentNrs: localDisplayOption.showAndPositionSegmentNrs,
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
