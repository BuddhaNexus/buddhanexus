import React from "react";
import type { GetStaticPaths } from "next";
import { DbViewSelector } from "@components/db/DbViewSelector";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainerWithSidebar } from "@components/layout/PageContainerWithSidebar";
import FilterListIcon from "@mui/icons-material/FilterList";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, CircularProgress, IconButton, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import TableView from "features/tableView/TableView";
import type { TablePageData } from "types/api/table";
import { DbApi, getLanguageMenuData } from "utils/api/db";
import { ALL_LOCALES, SourceLanguage } from "utils/constants";

export { getI18NextStaticProps as getStaticProps } from "utils/nextJsHelpers";

export default function PageWithFilters() {
  const { sourceLanguage, fileName } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  // TODO: add error handling
  const { data, isLoading } = useQuery<TablePageData>({
    queryKey: DbApi.TableView.makeQueryKey(fileName),
    queryFn: () => DbApi.TableView.call(fileName),
  });

  const [open, setOpen] = React.useState(true);

  const handleFilterClick = () => {
    setOpen(!open);
  };

  if (isFallback) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <PageContainerWithSidebar
      maxWidth="xl"
      backgroundName={sourceLanguage}
      state={[open, setOpen]}
    >
      <SourceTextSearchInput />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ py: 1 }}
      >
        <DbViewSelector currentView="numbers" />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleFilterClick}
          >
            <Badge badgeContent={1} color="primary">
              <FilterListIcon color="action" />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            sx={{ ml: 2 }}
            onClick={handleFilterClick}
          >
            <SettingsIcon color="action" />
          </IconButton>
        </Box>
      </Stack>

      {isLoading || !data ? (
        <CircularProgress color="inherit" />
      ) : (
        <div style={{ height: "70vh" }}>
          <TableView data={data} />
        </div>
      )}
    </PageContainerWithSidebar>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const languageMenuData = await getLanguageMenuData(SourceLanguage.PALI);
  const pliFilenames = languageMenuData.map((menuData) => menuData.fileName);
  // todo: also do this for other languages

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
    paths: pliFilenames.flatMap((file) =>
      ALL_LOCALES.map((locale) => ({
        params: { language: SourceLanguage.PALI, file },
        locale,
      }))
    ),
    fallback: true,
  };
};
