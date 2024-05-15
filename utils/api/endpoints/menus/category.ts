import apiClient from "@api";
import type { CategoryMenuItem } from "utils/api/types/menus";
import type { SourceLanguage } from "utils/constants";

export async function getCategoryMenuData(
  language: SourceLanguage,
): Promise<Map<string, CategoryMenuItem>> {
  if (!language) {
    return new Map();
  }

  const { data } = await apiClient.GET("/menus/category/", {
    params: { query: { language } },
  });

  const categoryData = data as { categoryitems: any[] };

  return categoryData.categoryitems
    .flat()
    .reduce(
      (
        map: Map<string, CategoryMenuItem>,
        cat: { category: string; categoryname: string },
      ) => {
        const { category, categoryname } = cat;
        map.set(category, {
          id: category,
          name: categoryname,
          label: `${category} ${categoryname}`,
        });
        return map;
      },
      new Map(),
    );
}
