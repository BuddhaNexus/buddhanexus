import React from "react";
import type { GetStaticProps } from "next";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useDbView } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import {
  dehydrate,
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import NumbersTable from "features/numbersView/NumbersTable";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import merge from "lodash/merge";
import { prefetchDbResultsPageData } from "utils/api/apiQueryUtils";
import { DbApi } from "utils/api/dbApi";
import type { SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export { getDbViewFileStaticPaths as getStaticPaths } from "utils/nextJsHelpers";

export default function NumbersPage() {
  const { sourceLanguage, fileName, defaultQueryParams, queryParams } =
    useDbQueryParams();
  const { isFallback } = useSourceFile();
  useDbView();

  const {
    data: headerCollections,
    isLoading: areHeadersLoading,
    isError: isHeadersError,
  } = useQuery({
    queryKey: DbApi.NumbersViewCollections.makeQueryKey({
      fileName,
      queryParams,
    }),
    queryFn: () => DbApi.NumbersViewCollections.call({ fileName, queryParams }),
  });

  const {
    data,
    fetchNextPage,
    isLoading: isTableContentLoading,
    isFetching,
    isError: isTableContentError,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: DbApi.NumbersView.makeQueryKey({ fileName, queryParams }),
    queryFn: ({ pageParam = 0 }) =>
      DbApi.NumbersView.call({
        file_name: fileName,
        ...defaultQueryParams,
        ...queryParams,
        page: Number(pageParam),
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
    return <ErrorPage backgroundName={sourceLanguage} />;
  }

  const isLoading = isTableContentLoading || areHeadersLoading;

  if (isFallback || isLoading || !data) {
    return (
      <PageContainer backgroundName={sourceLanguage}>
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth={false}
      backgroundName={sourceLanguage}
      isQueryResultsPage
    >
      <DbViewPageHead />

      <NumbersTable
        categories={headerCollections ?? []}
        data={allFetchedPages.data}
        hasNextPage={allFetchedPages.hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        isLoading={isLoading}
        language={sourceLanguage}
        fileName={fileName}
      />
      <SourceTextBrowserDrawer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18nProps = await getI18NextStaticProps({ locale }, [
    "common",
    "settings",
  ]);

  const queryClient = await prefetchDbResultsPageData(
    params?.language as SourceLanguage,
    params?.file as string,
  );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps,
  );
};
