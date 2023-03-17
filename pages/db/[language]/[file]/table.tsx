import React from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { DbResultsPageHead } from "@components/db/DbResultsPageHead";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SourceTextBrowserDrawer } from "features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import TableView from "features/tableView/TableView";
import type { PagedResponse } from "types/api/common";
import type { TablePageData } from "types/api/table";
import { DbApi } from "utils/api/dbApi";
import { getLanguageMenuData } from "utils/api/languageMenu";
import { ALL_LOCALES, SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export default function TablePage() {
  const { sourceLanguage, fileName, serializedParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  // TODO: add error handling
  const { data, fetchNextPage, fetchPreviousPage, isInitialLoading } =
    useInfiniteQuery<PagedResponse<TablePageData>>({
      queryKey: [DbApi.TableView.makeQueryKey(fileName), serializedParams],
      queryFn: ({ pageParam = 0 }) =>
        DbApi.TableView.call({
          fileName,
          pageNumber: pageParam,
          serializedParams,
        }),
      /* TODO: fix "null" pageParam issue causing result duplication (see: https://github.com/TanStack/query/issues/4309)
      
      Migrating to v5 might be the best solution (see: https://github.com/TanStack/query/discussions/4252 & https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5#infinite-queries-now-need-a-defaultpageparam), but, for the mo, these options have been temporarily fixed.
      
      getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
      getPreviousPageParam: (lastPage) =>
        lastPage.pageNumber === 0
          ? lastPage.pageNumber
          : lastPage.pageNumber - 1,
      refetchOnWindowFocus: false, */
      getNextPageParam: (lastPage) => lastPage.pageNumber,
      getPreviousPageParam: (lastPage) =>
        lastPage.pageNumber === 0 ? lastPage.pageNumber : lastPage.pageNumber,
      refetchOnWindowFocus: false,
    });

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      backgroundName={sourceLanguage}
      hasSidebar={true}
    >
      <DbResultsPageHead />

      {isInitialLoading || !data ? (
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      ) : (
        // TODO: clarify why this extra div is needed for display
        <div style={{ height: "100vh" }}>
          <TableView
            data={data.pages.flatMap((page) => page.data)}
            onEndReached={fetchNextPage}
            onStartReached={fetchPreviousPage}
          />
        </div>
      )}
      <SourceTextBrowserDrawer />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["settings"]
  );

  return {
    props: {
      ...i18nProps.props,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pliMenuData = await getLanguageMenuData(SourceLanguage.PALI);
  const paliFilenames = pliMenuData.map((menuData) => menuData.fileName);
  const chineseMenuData = await getLanguageMenuData(SourceLanguage.CHINESE);
  const chineseFilenames = chineseMenuData.map((menuData) => menuData.fileName);
  const sanskritMenuData = await getLanguageMenuData(SourceLanguage.SANSKRIT);
  const sanskritFilenames = sanskritMenuData.map(
    (menuData) => menuData.fileName
  );
  const tibetanMenuData = await getLanguageMenuData(SourceLanguage.TIBETAN);
  const tibetanFilenames = tibetanMenuData.map((menuData) => menuData.fileName);

  const allFilenames = [
    { language: SourceLanguage.TIBETAN, filenames: tibetanFilenames },
    { language: SourceLanguage.CHINESE, filenames: chineseFilenames },
    { language: SourceLanguage.SANSKRIT, filenames: sanskritFilenames },
    { language: SourceLanguage.PALI, filenames: paliFilenames },
  ];

  /**
   * Returns object like:
   * [
   *   { params: { language: 'pli', file: 'dn1' }, locale: 'en' },
   *   { params: { language: 'pli', file: 'dn1' }, locale: 'de' },
   *   { params: { language: 'pli', file: 'dn2' }, locale: 'en' },
   *   ...
   * ]
   */
  return {
    paths: allFilenames.flatMap(({ language, filenames }) =>
      filenames.flatMap((file) =>
        ALL_LOCALES.map((locale) => ({ params: { language, file }, locale }))
      )
    ),
    fallback: true,
  };
};
