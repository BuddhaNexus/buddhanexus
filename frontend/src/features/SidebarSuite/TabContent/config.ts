import {
  DBSourceFilePageFilterUISettingName,
  DisplayUISettingName,
  SearchPageFilterUISettingName,
  UtilityUISettingName,
} from "@features/SidebarSuite/types";
import { dbSourceFileRequestFilters } from "@features/SidebarSuite/uiSettings/config";
import { APISchemas } from "@utils/api/types";
import { DbViewEnum } from "@utils/constants";

export const AVAILABLE_DB_FILE_PAGE_FILTERS: Record<
  DbViewEnum,
  DBSourceFilePageFilterUISettingName[]
> = {
  [DbViewEnum.GRAPH]: dbSourceFileRequestFilters.filter(
    (filterName) => filterName !== "exclude_sources",
  ),
  [DbViewEnum.NUMBERS]: dbSourceFileRequestFilters,
  [DbViewEnum.TABLE]: dbSourceFileRequestFilters,
  [DbViewEnum.TEXT]: dbSourceFileRequestFilters,
};

export const AVAILABLE_SEARCH_PAGE_FILTERS: Record<
  SearchPageFilterUISettingName,
  Set<APISchemas["Languages"]>
> = {
  language: new Set(["all", "bo", "zh", "pa", "sa"]),
  exclude_sources: new Set(["bo", "zh", "pa", "sa"]),
  include_sources: new Set(["bo", "zh", "pa", "sa"]),
};

type LanguageUnabvailableUtilities = Partial<
  Record<UtilityUISettingName, APISchemas["Languages"][]>
>;
type UnavailableDisplayUtilities = Record<
  DbViewEnum,
  LanguageUnabvailableUtilities
>;

export const UNAVAILABLE_DB_SOURCE_PAGE_UI_UTILITIES: UnavailableDisplayUtilities =
  {
    [DbViewEnum.GRAPH]: {
      download_data: ["all"],
    },
    [DbViewEnum.NUMBERS]: {},
    [DbViewEnum.TABLE]: {
      download_data: ["all"],
    },
    [DbViewEnum.TEXT]: {},
  };

export const UNAVAILABLE_SEARCH_PAGE_UI_UTILITIES: UtilityUISettingName[] = [
  "download_data",
  "copyQueryTitle",
];

type LanguageUnabvailableDisplaySettings = Partial<
  Record<DisplayUISettingName, APISchemas["Languages"][]>
>;
type UnavailableDisplaySettings = Record<
  DbViewEnum,
  LanguageUnabvailableDisplaySettings
>;

export const UNAVAILABLE_DISPLAY_SETTINGS: UnavailableDisplaySettings = {
  [DbViewEnum.GRAPH]: {
    folio: ["all"],
    sort_method: ["all"],
    showSegmentNrs: ["all"],
  },
  [DbViewEnum.NUMBERS]: {
    sort_method: ["all"],
    script: ["all"],
    showSegmentNrs: ["all"],
  },
  [DbViewEnum.TABLE]: {
    sort_method: ["all"],
    script: ["pa", "zh", "sa"],
    showSegmentNrs: ["all"],
  },
  [DbViewEnum.TEXT]: {
    sort_method: ["all"],
    script: ["pa", "zh", "sa"],
  },
};
