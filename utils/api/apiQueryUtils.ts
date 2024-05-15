import { QueryClient } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";
import type { APILimits } from "utils/api/types";
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

  await queryClient.prefetchQuery({
    queryKey: DbApi.TextDisplayName.makeQueryKey(fileName),
    queryFn: () => DbApi.TextDisplayName.call({ segmentnr: fileName }),
  });

  // TODO: review. disabled for now to lighten build burden.
  // await queryClient.prefetchQuery({
  //   queryKey: DbApi.SidebarSourceTexts.makeQueryKey(sourceLanguage),
  //   queryFn: () => DbApi.SidebarSourceTexts.call(sourceLanguage),
  // });

  // TODO: confirm spec for multi_lingal query param. For discussion see: https://github.com/BuddhaNexus/buddhanexus-frontend-next/issues/117
  // await queryClient.prefetchQuery({
  //   queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
  //   queryFn: () => DbApi.AvailableLanguagesData.call(fileName),
  // });

  return queryClient;
}

export function parseAPIRequestBody<T extends { limits?: APILimits }>(body: T) {
  const limits = body?.limits ? JSON.parse(body.limits as string) : {};

  return { ...body, limits };
}
