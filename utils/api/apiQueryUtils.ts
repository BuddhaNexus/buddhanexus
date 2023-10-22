import { QueryClient } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";

export const queryCacheTimeDefaults = {
  // 1 hour
  staleTime: 60 * 60 * 1000,
  // 2 days
  gcTime: 2 * 24 * 60 * 60 * 1000,
};

export async function prefetchApiData(
  sourceLanguage: SourceLanguage,
  fileName?: string,
): Promise<QueryClient> {
  const queryClient = new QueryClient({
    // https://www.codemzy.com/blog/react-query-cachetime-staletime
    defaultOptions: {
      queries: {
        ...queryCacheTimeDefaults,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
    queryFn: () => DbApi.SidebarSourceTexts.call(sourceLanguage),
  });

  if (fileName) {
    await queryClient.prefetchQuery({
      queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
      queryFn: () => DbApi.AvailableLanguagesData.call(fileName),
    });
  }

  return queryClient;
}
