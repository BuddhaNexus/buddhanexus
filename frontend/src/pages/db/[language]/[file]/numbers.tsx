import React from "react";
import {
  // GetStaticProps,
  GetServerSideProps,
} from "next";
// import { getValidDbLanguage } from "@utils/validators";
// import { getI18NextStaticProps } from "@utils/nextJsHelpers";
// import merge from "lodash/merge";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LoadingSpinner from "@components/common/LoadingSpinner";
// import { prefetchDbResultsPageData } from "@utils/api/apiQueryUtils";
// export { getDbViewFileStaticPaths as getStaticPaths } from "@utils/nextJsHelpers";
import { ResultQueryError } from "@components/db/ResultQueryError";
import { useStandardViewBaseQueryParams } from "@components/hooks/groupedQueryParams";
import { useSortMethodParam } from "@components/hooks/params";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useSetDbViewFromPath } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import NumbersTable from "@features/numbersView/NumbersTable";
import { DbSourceBrowserDrawer } from "@features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import {
  // dehydrate,
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";

export default function NumbersPage() {
  const { dbLanguage, fileName } = useDbRouterParams();
  const { isFallback } = useSourceFile();

  useSetDbViewFromPath();

  const requestBodyBase = useStandardViewBaseQueryParams();
  const [sort_method] = useSortMethodParam();

  const {
    data: headerCollections,
    isLoading: areHeadersLoading,
    isError: isHeadersError,
    error: headersError,
  } = useQuery({
    queryKey: DbApi.NumbersViewCategories.makeQueryKey({
      filename: fileName,
    }),
    queryFn: () => DbApi.NumbersViewCategories.call({ filename: fileName }),
  });

  const {
    data,
    fetchNextPage,
    isLoading: isTableContentLoading,
    isFetching,
    isError: isTableContentError,
    error: tableContentError,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: DbApi.NumbersView.makeQueryKey({
      ...requestBodyBase,
      sort_method,
    }),
    queryFn: ({ pageParam = 0 }) =>
      DbApi.NumbersView.call({
        ...requestBodyBase,
        sort_method,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
    getPreviousPageParam: (lastPage) =>
      lastPage.pageNumber === 0 ? undefined : lastPage.pageNumber - 1,
    placeholderData: keepPreviousData,
  });

  const allFetchedPages = React.useMemo(() => {
    const { pages = [] } = data ?? {};

    let nextPage = true;
    const flatData = pages.flatMap((page) => {
      const { data: pageData = [], hasNextPage } = page ?? {};
      nextPage = Boolean(hasNextPage);
      return pageData;
    });

    return { data: flatData ?? {}, hasNextPage: nextPage };
  }, [data]);

  const isError = isHeadersError || isTableContentError;

  if (isError) {
    return (
      <PageContainer
        maxWidth={false}
        backgroundName={dbLanguage}
        isQueryResultsPage
      >
        <ResultQueryError
          errorMessage={tableContentError?.message ?? headersError?.message}
        />
      </PageContainer>
    );
  }

  const isLoading = isTableContentLoading || areHeadersLoading;

  if (isFallback || isLoading) {
    return (
      <PageContainer
        maxWidth={false}
        backgroundName={dbLanguage}
        isQueryResultsPage
      >
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth={false}
      backgroundName={dbLanguage}
      isQueryResultsPage
    >
      <NumbersTable
        categories={headerCollections ?? []}
        data={allFetchedPages.data}
        hasNextPage={allFetchedPages.hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        isLoading={isLoading}
        language={dbLanguage}
      />
      <DbSourceBrowserDrawer />
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "settings"])),
  },
});

// export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
//   const i18nProps = await getI18NextStaticProps({ locale }, [
//     "common",
//     "settings",
//   ]);
//
//   const queryClient = await prefetchDbResultsPageData(
//     getValidLanguage(params?.language),
//     params?.file as string,
//   );
//
//   return merge(
//     { props: { dehydratedState: dehydrate(queryClient) } },
//     i18nProps,
//   );
// };
