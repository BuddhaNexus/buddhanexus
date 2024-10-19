import { DbSourceTreeNodeDataType as NodeType } from "@components/db/SearchableDbSourceTree/types";
import {
  DbSourceFilters,
  DbSourceFilterUISetting,
} from "@features/sidebarSuite/types";
import { exhaustiveStringTuple } from "@utils/helpers";

export const DB_SOURCE_UPDATE_MAPPING: Record<
  NodeType,
  Record<DbSourceFilterUISetting, keyof DbSourceFilters>
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
  filterParam,
  filterSettingName,
}: {
  filterParam: DbSourceFilters | null;
  filterSettingName: DbSourceFilterUISetting;
}) => {
  const {
    exclude_files = [],
    exclude_categories = [],
    exclude_collections = [],
    include_collections = [],
    include_categories = [],
    include_files = [],
  } = filterParam ?? {};

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

export const removeItemsById = ({
  filterParam,
  id,
  filterSettingName,
}: {
  filterParam: DbSourceFilters;
  id: string;
  filterSettingName: DbSourceFilterUISetting;
}) => {
  let updatedParams = { ...filterParam };

  for (const [key, filterValue] of Object.entries(filterParam)) {
    let updatedFilterValue = filterValue;
    if (key.startsWith(filterSettingName)) {
      updatedFilterValue = updateFilterParamArray({
        array: filterValue ?? [],
        id,
        action: "remove",
      });
    }

    updatedParams = {
      ...updatedParams,
      [key]: updatedFilterValue.length > 0 ? updatedFilterValue : undefined,
    };
  }

  return updatedParams;
};

export const clearAllFilterParams = ({
  filterParam,
  filterSettingName,
}: {
  filterParam: DbSourceFilters;
  filterSettingName: DbSourceFilterUISetting;
}) => {
  let updatedParams = { ...filterParam };
  for (const [key] of Object.entries(filterParam)) {
    if (key.startsWith(filterSettingName)) {
      updatedParams = {
        ...updatedParams,
        [key]: undefined,
      };
    }
  }
  return updatedParams;
};

export const dbSourceFilterSelectors =
  exhaustiveStringTuple<DbSourceFilterUISetting>()(
    "exclude_sources",
    "include_sources",
  );
