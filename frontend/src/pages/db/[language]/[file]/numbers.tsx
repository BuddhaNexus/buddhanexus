import React from "react";
import {
  // GetStaticProps,
  GetServerSideProps,
} from "next";
// import { getValidDbLanguage } from "@utils/validators";
// import { getI18NextStaticProps } from "@utils/nextJsHelpers";
// import merge from "lodash/merge";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { ErrorPage } from "@components/db/ErrorPage";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useSetDbViewFromPath } from "@components/hooks/useDbView";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { CenteredProgress } from "@components/layout/CenteredProgress";
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
// import { prefetchDbResultsPageData } from "@utils/api/apiQueryUtils";

// export { getDbViewFileStaticPaths as getStaticPaths } from "@utils/nextJsHelpers";

export default function NumbersPage() {
  const { dbLanguage, fileName } = useDbRouterParams();
  const { isFallback } = useSourceFile();

  useSetDbViewFromPath();

  const {
    data: headerCollections,
    isLoading: areHeadersLoading,
    isError: isHeadersError,
  } = useQuery({
    queryKey: DbApi.NumbersViewCategories.makeQueryKey({
      filename: fileName,
    }),
    queryFn: () => DbApi.NumbersViewCategories.call({ filename: fileName }),
  });

  // const requestBody = React.useMemo(
  //   () => ({
  //     file_name: fileName,
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

  const {
    data,
    fetchNextPage,
    isLoading: isTableContentLoading,
    isFetching,
    isError: isTableContentError,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: DbApi.NumbersView.makeQueryKey(requestBody),
    queryFn: ({ pageParam = 0 }) =>
      DbApi.NumbersView.call({
        ...requestBody,
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
    return <ErrorPage backgroundName={dbLanguage} />;
  }

  const isLoading = isTableContentLoading || areHeadersLoading;

  if (isFallback || isLoading || !data) {
    return (
      <PageContainer backgroundName={dbLanguage}>
        <CenteredProgress />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth={false}
      backgroundName={dbLanguage}
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
        language={dbLanguage}
        fileName={fileName}
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
