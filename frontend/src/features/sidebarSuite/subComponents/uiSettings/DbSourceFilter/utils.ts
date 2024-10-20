import { DbSourceTreeNodeDataType as NodeType } from "@components/db/SearchableDbSourceTree/types";
import {
  DbSourceFilterUISetting,
  WorkingAPIFilters,
  APIFilterName,
} from "@features/sidebarSuite/types";
import { exhaustiveStringTuple } from "@utils/helpers";

export const DB_SOURCE_UPDATE_MAPPING: Record<
  NodeType,
  Record<DbSourceFilterUISetting, APIFilterName>
> = {
  [NodeType.Collection]: {
    include_sources: "include_collections",
    exclude_sources: "exclude_collections",
  },
  [NodeType.Category]: {
    include_sources: "include_categories",
    exclude_sources: "exclude_categories",
  },
  [NodeType.Text]: {
    include_sources: "include_files",
    exclude_sources: "exclude_files",
  },
};

export const getFilterIds = ({
  filtersParam,
  filterSettingName,
}: {
  filtersParam: WorkingAPIFilters | null;
  filterSettingName: DbSourceFilterUISetting;
}) => {
  const {
    exclude_files = [],
    exclude_categories = [],
    exclude_collections = [],
    include_collections = [],
    include_categories = [],
    include_files = [],
  } = filtersParam ?? {};

  const idMapping = {
    include_sources: [
      ...include_files,
      ...include_categories,
      ...include_collections,
    ],
    exclude_sources: [
      ...exclude_files,
      ...exclude_categories,
      ...exclude_collections,
    ],
  };

  return idMapping[filterSettingName] || [];
};

export const updateFilterParamArray = ({
  array,
  id,
  action,
}: {
  array: string[];
  id: string;
  action: "add" | "remove";
}) => {
  if (action === "add") {
    return [...array, id];
  } else if (action === "remove") {
    return array?.filter((item) => item !== id);
  }
  return array;
};

export const dbSourceFilterSelectors =
  exhaustiveStringTuple<DbSourceFilterUISetting>()(
    "exclude_sources",
    "include_sources"
  );
