import { QueryClient } from "@tanstack/react-query";
import { DbApi, OldDbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";

export const queryCacheTimeDefaults = {
  // 1 hour
  staleTime: 60 * 60 * 1000,
  // 2 days
  gcTime: 2 * 24 * 60 * 60 * 1000,
};

export async function prefetchDefaultDbPageData(
  sourceLanguage: SourceLanguage,
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

  return queryClient;
}

export async function prefetchDbResultsPageData(
  sourceLanguage: SourceLanguage,
  fileName: string,
): Promise<QueryClient> {
  const queryClient = new QueryClient({
    // https://www.codemzy.com/blog/react-query-cachetime-staletime
    defaultOptions: {
      queries: {
        ...queryCacheTimeDefaults,
      },
    },
  });

  // TODO: the current implementation uses an endpoint from the old API, we should switch to the new one when available
  await queryClient.prefetchQuery({
    queryKey: OldDbApi.TextDisplayName.makeQueryKey(fileName),
    queryFn: () => OldDbApi.TextDisplayName.call(fileName),
  });

  // TODO: review. disabled for now to lighten build burden.
  // await queryClient.prefetchQuery({
  //   queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
  //   queryFn: () => DbApi.SidebarSourceTexts.call(sourceLanguage),
  // });

  // TODO: confirm spect for multi_lingal query param. For discussion see: https://github.com/BuddhaNexus/buddhanexus-frontend-next/issues/117
  // await queryClient.prefetchQuery({
  //   queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
  //   queryFn: () => DbApi.AvailableLanguagesData.call(fileName),
  // });

  return queryClient;
}
