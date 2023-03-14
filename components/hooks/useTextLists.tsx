import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";
import type { CategoryMenuItem, TextMenuItem } from "utils/api/textLists";

import { useDbQueryParams } from "./useDbQueryParams";

export const useTextLists = () => {
  const { sourceLanguage } = useDbQueryParams();

  const { data: textsData, isLoading: isLoadingTexts } = useQuery({
    queryKey: DbApi.TextMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.TextMenu.call(sourceLanguage),
  });

  const { data: categoriesData, isLoading: isLoadingCats } = useQuery({
    queryKey: DbApi.CategoryMenu.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.CategoryMenu.call(sourceLanguage),
  });

  const texts = textsData ?? (new Map() as Map<string, TextMenuItem>);
  const categories =
    categoriesData ?? (new Map() as Map<string, CategoryMenuItem>);

  return {
    texts,
    categories,
    isLoadingTexts,
    isLoadingCats,
  };
};
