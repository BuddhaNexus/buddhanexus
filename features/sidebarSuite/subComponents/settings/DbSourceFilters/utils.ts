import { DbSourceTreeNodeDataType as NodeType } from "@components/db/SearchableDbSourceTree/types";
import {
  DbSourceFilters,
  DbSourceFilterType,
} from "features/sidebarSuite/config/types";
import { exhaustiveStringTuple } from "utils/validators";

export const DB_SOURCE_UPDATE_MAPPING: Record<
  NodeType,
  Record<DbSourceFilterType, keyof DbSourceFilters>
> = {
  [NodeType.Collection]: {
    include: "include_collections",
    exclude: "exclude_collections",
  },
  [NodeType.Category]: {
    include: "include_categories",
    exclude: "exclude_categories",
  },
  [NodeType.Text]: {
    include: "include_files",
    exclude: "exclude_files",
  },
};

export const getFilterIds = ({
  filterParam,
  filterSettingName,
}: {
  filterParam: DbSourceFilters | null;
  filterSettingName: DbSourceFilterType;
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
    include: [...include_files, ...include_categories, ...include_collections],
    exclude: [...exclude_files, ...exclude_categories, ...exclude_collections],
  };

  return idMapping[filterSettingName] || [];
};

export const updateFilterParamArray = ({
  array,
  id,
  action,
}: {
  array: any[];
  id: string;
  action: "add" | "remove";
}): any[] => {
  if (action === "add") {
    return [...array, id];
  } else if (action === "remove") {
    return array.filter((item) => item !== id);
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
  filterSettingName: DbSourceFilterType;
}) => {
  let updatedParams = { ...filterParam };

  for (const [key, filterValue] of Object.entries(filterParam)) {
    let updatedFilterValue = filterValue;
    if (key.startsWith(filterSettingName)) {
      updatedFilterValue = updateFilterParamArray({
        array: filterValue,
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
  filterSettingName: DbSourceFilterType;
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
  exhaustiveStringTuple<DbSourceFilterType>()("exclude", "include");
