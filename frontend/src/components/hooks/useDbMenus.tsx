import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import type { ParsedCategoryMenuItem } from "@utils/api/endpoints/menus/category";
import type { ParsedTextFileMenuItem } from "@utils/api/endpoints/menus/files";

import { useDbQueryParams } from "./useDbQueryParams";

export const useDbMenus = () => {
  const { sourceLanguage } = useDbQueryParams();

  const { data: textsData, isLoading: isLoadingTexts } = useQuery({
    queryKey: DbApi.SourceTextMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.SourceTextMenu.call({ language: sourceLanguage }),
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: DbApi.CategoryMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.CategoryMenu.call({ language: sourceLanguage }),
  });

  const texts = React.useMemo(() => {
    return (
      textsData?.reduce(
        (
          map: Map<string, ParsedTextFileMenuItem>,
          text: ParsedTextFileMenuItem,
        ) => {
          map.set(text.id, {
            ...text,
          });
          return map;
        },
        new Map(),
      ) ?? new Map<string, ParsedTextFileMenuItem>()
    );
  }, [textsData]);
  const categories =
    categoriesData ?? new Map<string, ParsedCategoryMenuItem>();

  return {
    texts,
    categories,
    isLoadingTexts,
    isLoadingCategories,
  };
};
