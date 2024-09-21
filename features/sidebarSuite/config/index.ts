import { DbViewEnum, SourceLanguage } from "utils/constants";

import {
  DisplayOption,
  LocalDisplayOption,
  PageFilter,
  QueriedDisplayOption,
  uniqueSettings,
  UtilityOption,
} from "./settings";
import type { QueryParams, SettingOmissions } from "./types";

const { queryParams, local, remote } = uniqueSettings;

// Not all filters, options and utilities are applicable for all DB languages and views. The setting menu assumes each setting component is to be rendered, unless defined in the following config objects listing contexts in which specific settings should be ommitted. For example, the `limits` filter should be shown in all cases except for graph view, in any language.
export const DB_PAGE_FILTER_OMISSIONS_CONFIG: SettingOmissions<PageFilter> = {
  [queryParams.limits]: {
    [DbViewEnum.GRAPH]: ["all"],
  },
  [queryParams.targetCollection]: {
    [DbViewEnum.NUMBERS]: ["all"],
    [DbViewEnum.TABLE]: ["all"],
    [DbViewEnum.TEXT]: ["all"],
  },
  [queryParams.multiLingual]: {
    // TODO: for context see: https://github.com/BuddhaNexus/buddhanexus-frontend-next/pull/90#discussion_r1375272080
    [DbViewEnum.GRAPH]: ["all"],
    [DbViewEnum.NUMBERS]: ["all"],
    [DbViewEnum.TABLE]: ["all"],
  },
};

const QUERIED_DISPLAY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<QueriedDisplayOption> =
  {
    [queryParams.folio]: {
      // "folio" is used as "jump to" in text view and "only show" in other applicable views
      [DbViewEnum.GRAPH]: ["all"],
    },
    [queryParams.sortMethod]: {
      [DbViewEnum.GRAPH]: ["all"],
      [DbViewEnum.NUMBERS]: ["all"],
      [DbViewEnum.TEXT]: ["all"],
    },
  };

const LOCAL_DISPLAY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<LocalDisplayOption> =
  {
    [local.script]: {
      [DbViewEnum.GRAPH]: ["all"],
      [DbViewEnum.NUMBERS]: ["all"],
      [DbViewEnum.TABLE]: [
        SourceLanguage.PALI,
        SourceLanguage.CHINESE,
        SourceLanguage.SANSKRIT,
      ],
      [DbViewEnum.TEXT]: [
        SourceLanguage.PALI,
        SourceLanguage.CHINESE,
        SourceLanguage.SANSKRIT,
      ],
    },
    [local.showSegmentNrs]: {
      [DbViewEnum.GRAPH]: ["all"],
      [DbViewEnum.NUMBERS]: ["all"],
      [DbViewEnum.TABLE]: ["all"],
    },
  };

export const DISPLAY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<DisplayOption> =
  {
    ...QUERIED_DISPLAY_OPTIONS_OMISSIONS_CONFIG,
    ...LOCAL_DISPLAY_OPTIONS_OMISSIONS_CONFIG,
  };

export const UTILITY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<UtilityOption> =
  {
    [remote.download]: {
      [DbViewEnum.GRAPH]: ["all"],
      [DbViewEnum.TEXT]: ["all"],
      search: ["all"],
    },
    [local.copyQueryTitle]: {
      search: ["all"],
    },
  };

export const VIEW_SELECTOR_OMISSIONS_CONFIG: Partial<
  Record<SourceLanguage, DbViewEnum[]>
> = {
  [SourceLanguage.SANSKRIT]: [DbViewEnum.NUMBERS],
  [SourceLanguage.TIBETAN]: [DbViewEnum.NUMBERS],
};

export const SETTINGS_OMISSIONS_CONFIG = {
  filters: { ...DB_PAGE_FILTER_OMISSIONS_CONFIG },
  displayOptions: {
    ...DISPLAY_OPTIONS_OMISSIONS_CONFIG,
  },
  utilityOptions: { ...UTILITY_OPTIONS_OMISSIONS_CONFIG },
  viewSelector: { ...VIEW_SELECTOR_OMISSIONS_CONFIG },
};

export const DEFAULT_QUERY_PARAMS_VALUES: QueryParams = {
  score: 30,
  // par_length is given a dummy value of 25 (lowest value applicable to all languages). The true value is initated in useDbQueryParams hook when src lang value is available.
  par_length: 25,
  folio: undefined,
  sort_method: undefined,
  limits: undefined,
  target_collection: undefined,
  // multi_lingual is initialized at point of use with prefetched data (see `useQuery` fetch in `CurrentResultChips`).
  multi_lingual: undefined,
  language: undefined,
  search_string: undefined,
};

export const MIN_PAR_LENGTH_VALUES: Record<SourceLanguage, number> = {
  chn: 5,
  pli: 25,
  skt: 25,
  tib: 7,
};
export const DEFAULT_PAR_LENGTH_VALUES: Record<SourceLanguage, number> = {
  chn: 7,
  pli: 30,
  skt: 30,
  tib: 14,
};

/**
 * Query params that only effect display (not number of results); counted in "Custom options" results page chip.
 */
export const customOptionsChipQueries: string[] = [
  queryParams.folio,
  queryParams.sortMethod,
];

/**
 * Query params that are NOT counted in results page "Custom filters" chip.
 */
export const customFiltersChipQueryExclusions: string[] = [
  ...customOptionsChipQueries,
  queryParams.searchString,
];
