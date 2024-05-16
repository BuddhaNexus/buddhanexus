import apiClient from "@api";
import type {
  APIMenuFilterCategoriesRequestQuery,
  APIMenuFilterCategoriesResponseData,
} from "utils/api/types";

export interface ParsedCategoryMenuItem {
  id: string;
  name: string;
  label: string;
}

const parseCategoryMenuData = (data: APIMenuFilterCategoriesResponseData) => {
  return data.categoryitems.reduce(
    (map: Map<string, ParsedCategoryMenuItem>, currentCategory) => {
      const { category, categoryname } = currentCategory;

      if (!category || !categoryname) {
        return map;
      }

      const value: ParsedCategoryMenuItem = {
        id: category,
        name: categoryname,
        label: `${category} ${categoryname}`,
      };

      map.set(category, value);
      return map;
    },
    new Map(),
  );
};

export type ParsedCategoryMenuData = ReturnType<typeof parseCategoryMenuData>;

export async function getCategoryMenuData(
  query: APIMenuFilterCategoriesRequestQuery,
) {
  if (!query.language) {
    return new Map();
  }

  const { data } = await apiClient.GET("/menus/category/", {
    params: { query },
  });

  return data ? parseCategoryMenuData(data) : new Map();
}
