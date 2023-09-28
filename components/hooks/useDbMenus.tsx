import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";
import type { DatabaseText, CategoryMenuItem } from "types/api/menus";

import { useDbQueryParams } from "./useDbQueryParams";

export const useDbMenus = () => {
  const { sourceLanguage } = useDbQueryParams();

  const { data: textsData, isLoading: isLoadingTexts } = useQuery({
    queryKey: DbApi.SourceTextMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.SourceTextMenu.call(sourceLanguage),
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: DbApi.CategoryMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.CategoryMenu.call(sourceLanguage),
  });

  const texts = textsData?.reduce(
    (map: Map<string, DatabaseText>, text: DatabaseText) => {
      map.set(text.id, {
        ...text,
      });
      return map;
    },
    new Map()
  );
  const categories = categoriesData ?? new Map<string, CategoryMenuItem>();

  return {
    texts,
    categories,
    isLoadingTexts,
    isLoadingCategories,
  };
};
