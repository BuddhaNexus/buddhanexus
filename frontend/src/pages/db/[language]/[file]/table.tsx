import React, { useMemo } from "react";
import {
  // GetStaticProps,
  GetServerSideProps,
} from "next";
// import {getValidDbLanguage } from "@utils/validators";
// import { getI18NextStaticProps } from "@utils/nextJsHelpers";
// import merge from "lodash/merge";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useSetDbViewFromPath } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
import { PageContainer } from "@components/layout/PageContainer";
import { DbSourceBrowserDrawer } from "@features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import TableView from "@features/tableView/TableView";
import {
  // dehydrate,
  useInfiniteQuery,
} from "@tanstack/react-query";
// import { prefetchDbResultsPageData } from "@utils/api/apiQueryUtils";
import { DbApi } from "@utils/api/dbApi";

// export { getDbViewFileStaticPaths as getStaticPaths } from "@utils/nextJsHelpers";

// TODO: investigate why there is a full page rerender when switching to table view (but not text view).
export default function TablePage() {
  const { dbLanguage, fileName } = useDbRouterParams();
  const { isFallback } = useSourceFile();

  useSetDbViewFromPath();

  // const requestBody = React.useMemo(
  //   () => ({
  //     filename: fileName,
  //     ...defaultQueryParams,
  //     ...queryParams,
  //   }),
  //   [fileName, defaultQueryParams, queryParams]
  // );

  const requestBody = {
    filename: fileName,
    filters: undefined,
    sort_method: "position",
    folio: "",
  };

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
    [data]
  );

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={dbLanguage}>
        <DbViewPageHead />
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" backgroundName={dbLanguage} isQueryResultsPage>
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
//   const i18nProps = await getI18NextStaticProps({ locale }, ["settings"]);
//
//   const queryClient = await prefetchDbResultsPageData(
//     getValidDbLanguage(params?.language),
//     params?.file as string,
//   );
//
//   return merge(
//     { props: { dehydratedState: dehydrate(queryClient) } },
//     i18nProps,
//   );
// };
