import { QueryClient } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { DbLanguage } from "@utils/api/types";

export const queryCacheTimeDefaults = {
  // 1 hour
  staleTime: 60 * 60 * 1000,
  // 2 days
  gcTime: 2 * 24 * 60 * 60 * 1000,
};

export async function prefetchDefaultDbPageData(
  dbLanguage: DbLanguage,
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
    queryKey: DbApi.DbSourcesMenu.makeQueryKey(dbLanguage),
    queryFn: () => DbApi.DbSourcesMenu.call({ language: dbLanguage }),
  });

  return queryClient;
}

export async function prefetchDbResultsPageData(
  dbLanguage: DbLanguage,
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

  // TODO: confirm spec for multi_lingal query param. For discussion see: https://github.com/BuddhaNexus/buddhanexus-frontend-next/issues/117
  // await queryClient.prefetchQuery({
  //   queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
  //   queryFn: () => DbApi.AvailableLanguagesData.call(fileName),
  // });

  return queryClient;
}

export function parseAPIRequestBody<T>(body: T) {
  // TODO: refactor for limits > filter update
  // const limits = body?.limits ? JSON.parse(body.limits as string) : {};

  return { ...body };
}
