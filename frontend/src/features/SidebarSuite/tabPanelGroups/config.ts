import {
  DBSourceFilePageFilterUISettingName,
  DisplayUISettingName,
  UtilityUISettingName,
} from "@features/SidebarSuite/types";
import { dbSoureFileRequestFilters } from "@features/SidebarSuite/uiSettings/config";
import { APISchemas } from "@utils/api/types";
import { DbViewEnum } from "@utils/constants";

export const AVAILABLE_UI_FILTERS: Record<
  DbViewEnum,
  DBSourceFilePageFilterUISettingName[]
> = {
  [DbViewEnum.GRAPH]: dbSoureFileRequestFilters.filter(
    (filterName) => filterName !== "exclude_sources",
  ),
  [DbViewEnum.NUMBERS]: dbSoureFileRequestFilters,
  [DbViewEnum.TABLE]: dbSoureFileRequestFilters,
  [DbViewEnum.TEXT]: dbSoureFileRequestFilters,
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
