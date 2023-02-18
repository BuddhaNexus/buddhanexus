import { useState } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { DbViewSelector } from "@components/db/DbViewSelector";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import CurrentResultChips from "features/sidebar/CurrentResultChips";
import { PageContainerWithSidebar } from "features/sidebar/PageContainerWithSidebar";
import TableView from "features/tableView/TableView";
import type { PagedResponse } from "types/api/common";
import type { TablePageData } from "types/api/table";
import { DbApi, getLanguageMenuData } from "utils/api/db";
import { ALL_LOCALES, SourceLanguage } from "utils/constants";
import { getI18NextStaticProps } from "utils/nextJsHelpers";

export default function PageWithFilters() {
  const { sourceLanguage, fileName, serializedParams } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  const handleFilterClick = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

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
      getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
      getPreviousPageParam: (lastPage) =>
        lastPage.pageNumber === 0
          ? lastPage.pageNumber
          : lastPage.pageNumber - 1,
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
    <PageContainerWithSidebar
      maxWidth="xl"
      backgroundName={sourceLanguage}
      isOpen={[sidebarIsOpen, setSidebarIsOpen]}
    >
      <Typography variant="h2" component="h1">
        {fileName.toUpperCase()}
      </Typography>
      <SourceTextSearchInput />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ py: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DbViewSelector currentView="numbers" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CurrentResultChips />

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleFilterClick}
          >
            <SettingsIcon color="action" />
          </IconButton>
        </Box>
      </Stack>

      {isInitialLoading || !data ? (
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      ) : (
        <div style={{ height: "100vh" }}>
          <TableView
            data={data.pages.flatMap((page) => page.data)}
            onEndReached={fetchNextPage}
            onStartReached={fetchPreviousPage}
          />
        </div>
      )}
    </PageContainerWithSidebar>
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
