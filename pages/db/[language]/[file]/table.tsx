import type { GetStaticPaths, GetStaticProps } from "next";
import { DbViewSelector } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import TableView from "features/tableView/TableView";
import type { PagedResponse } from "types/api/common";
import type { TablePageData } from "types/api/table";
import { DbApi } from "utils/api/dbApi";
import { getLanguageMenuData } from "utils/api/languageMenu";
import { ALL_LOCALES, SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export default function TablePage() {
  const { sourceLanguage, fileName } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  // TODO: add error handling
  const { data, fetchNextPage, fetchPreviousPage, isInitialLoading } =
    useInfiniteQuery<PagedResponse<TablePageData>>({
      queryKey: DbApi.TableView.makeQueryKey(fileName),
      queryFn: ({ pageParam = 0 }) => DbApi.TableView.call(fileName, pageParam),
      getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
      getPreviousPageParam: (lastPage) =>
        lastPage.pageNumber === 0
          ? lastPage.pageNumber
          : lastPage.pageNumber - 1,
    });

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
      <DbViewSelector currentView="table" />

      {isInitialLoading || !data ? (
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      ) : (
        <TableView
          data={data.pages.flatMap((page) => page.data)}
          onEndReached={fetchNextPage}
          onStartReached={fetchPreviousPage}
        />
      )}
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18nProps = await getI18NextStaticProps({
    locale,
  });

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
