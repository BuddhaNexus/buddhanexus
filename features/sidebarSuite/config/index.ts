import { DbViewEnum } from "@components/hooks/useDbView";
import { SourceLanguage } from "utils/constants";

import { uniqueSettings } from "./settings";
import type {
  DbPageFilter,
  DisplayOption,
  LocalDisplayOption,
  QueriedDisplayOption,
  QueryParams,
  SettingOmissions,
  UtilityOption,
} from "./types";

const { queryParams, local, remote } = uniqueSettings;

// Not all filters, options and utilities are applicable for all DB languages and views. The setting menu assumes each setting component is to be rendered, unless defined in the following config objects listing contexts in which specific settings should be ommitted. For example, the `limits` filter should be shown in all cases except for graph view, in any language.

export const DB_PAGE_FILTER_OMISSIONS_CONFIG: SettingOmissions<DbPageFilter> = {
  [queryParams.limits]: {
    [DbViewEnum.GRAPH]: ["allLangs"],
  },
  [queryParams.targetCollection]: {
    [DbViewEnum.NUMBERS]: ["allLangs"],
    [DbViewEnum.TABLE]: ["allLangs"],
    [DbViewEnum.TEXT]: ["allLangs"],
  },
};

const QUERIED_DISPLAY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<QueriedDisplayOption> =
  {
    [queryParams.folio]: {
      // "folio" is used as "jump to" in text view and "only show" in other applicable views
      [DbViewEnum.GRAPH]: ["allLangs"],
    },
    [queryParams.multiLingual]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.NUMBERS]: ["allLangs"],
      [DbViewEnum.TABLE]: ["allLangs"],
    },
    [queryParams.sortMethod]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.NUMBERS]: ["allLangs"],
      [DbViewEnum.TEXT]: ["allLangs"],
    },
  };

const LOCAL_DISPLAY_OPTIONS_OMISSIONS_CONFIG: SettingOmissions<LocalDisplayOption> =
  {
    [local.script]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.NUMBERS]: ["allLangs"],
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
    [local.showAndPositionSegmentNrs]: {
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.NUMBERS]: ["allLangs"],
      [DbViewEnum.TABLE]: ["allLangs"],
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
      [DbViewEnum.GRAPH]: ["allLangs"],
      [DbViewEnum.TEXT]: ["allLangs"],
    },
  };

export const SETTINGS_OMISSIONS_CONFIG = {
  filters: { ...DB_PAGE_FILTER_OMISSIONS_CONFIG },
  displayOptions: {
    ...DISPLAY_OPTIONS_OMISSIONS_CONFIG,
  },
  utilityOptions: { ...UTILITY_OPTIONS_OMISSIONS_CONFIG },
};

export const DEFAULT_QUERY_PARAMS_VALUES: QueryParams = {
  score: 30,
  // par_length is given a dummy value of 25 (lowest value applicable to all languages). The true value is initated in useDbQueryParams hook when src lang value is available.
  par_length: 25,
  folio: undefined,
  sort_method: undefined,
  limits: undefined,
  target_collection: undefined,
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
 * Query params that only effect display (not number of results).
 */
export const displaySettingChipQueries: string[] = [
  queryParams.folio,
  queryParams.multiLingual,
  queryParams.sortMethod,
];

/**
 * Query params that are not counted as custom filter settings.
 */
export const filterChipQueryExclusions: string[] = [
  ...displaySettingChipQueries,
  queryParams.searchString,
];
