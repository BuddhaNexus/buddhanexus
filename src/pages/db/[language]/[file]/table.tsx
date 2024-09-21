import React, { useMemo } from "react";
import type { GetStaticProps } from "next";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useDbView } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { SourceTextBrowserDrawer } from "@features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import TableView from "@features/tableView/TableView";
import { dehydrate, useInfiniteQuery } from "@tanstack/react-query";
import { prefetchDbResultsPageData } from "@utils/api/apiQueryUtils";
import { DbApi } from "@utils/api/dbApi";
import type { SourceLanguage } from "@utils/constants";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import merge from "lodash/merge";

export { getDbViewFileStaticPaths as getStaticPaths } from "@utils/nextJsHelpers";

// TODO: investigate why there is a full page rerender when switching to table view (but not text view).
export default function TablePage() {
  const { sourceLanguage, fileName, defaultQueryParams, queryParams } =
    useDbQueryParams();
  const { isFallback } = useSourceFile();
  useDbView();

  const requestBody = React.useMemo(
    () => ({
      file_name: fileName,
      ...defaultQueryParams,
      ...queryParams,
    }),
    [fileName, defaultQueryParams, queryParams],
  );

  const { data, fetchNextPage, fetchPreviousPage, isLoading } =
    useInfiniteQuery({
      initialPageParam: 0,
      queryKey: DbApi.TableView.makeQueryKey(requestBody),
      queryFn: ({ pageParam }) =>
        DbApi.TableView.call({
          ...requestBody,
          page: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
      getPreviousPageParam: (lastPage) =>
        lastPage.pageNumber === 0 ? undefined : lastPage.pageNumber - 1,
    });

  const allData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data) : []),
    [data],
  );

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        <DbViewPageHead />
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={sourceLanguage}
      isQueryResultsPage
    >
      <DbViewPageHead />

      {isLoading || !data ? (
        <CenteredProgress />
      ) : (
        <TableView
          data={allData}
          onEndReached={fetchNextPage}
          onStartReached={fetchPreviousPage}
        />
      )}
      <SourceTextBrowserDrawer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18nProps = await getI18NextStaticProps({ locale }, ["settings"]);

  const queryClient = await prefetchDbResultsPageData(
    params?.language as SourceLanguage,
    params?.file as string,
  );

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps,
  );
};
