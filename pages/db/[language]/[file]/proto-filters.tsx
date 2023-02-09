import React from "react";
import type { GetStaticPaths } from "next";
import { DbViewSelector } from "@components/db/DbViewSelector";
import CurrentResultChips from "@components/db/sidebar/CurrentResultChips";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainerWithSidebar } from "@components/layout/PageContainerWithSidebar";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import TableView from "features/tableView/TableView";
import { getLanguageMenuData } from "utils/api/db";
import { ALL_LOCALES, SourceLanguage } from "utils/constants";

export { getI18NextStaticProps as getStaticProps } from "utils/nextJsHelpers";

export default function PageWithFilters() {
  const { sourceLanguage } = useDbQueryParams();
  const { isFallback } = useSourceFile();

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
      isOpen={[open, setOpen]}
    >
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

      <TableView />
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
