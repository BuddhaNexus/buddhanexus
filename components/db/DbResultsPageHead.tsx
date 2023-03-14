// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: ENABLE TS AFTER REFACTOR

import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSetQueryValues } from "@components/hooks/useSetQueryValues";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { sidebarIsOpenAtom } from "features/sidebar/Sidebar";
import { useAtom } from "jotai";

export const DbResultsPageHead = () => {
  // TODO: get full text name
  const { fileName, queryParams, setQueryParams, defaultQueryParams } =
    useDbQueryParams();

  const { setAllQueryValues } = useSetQueryValues();

  // const { t } = useTranslation("settings");

  const [sidebarIsOpen, setSidebarIsOpen] = useAtom(sidebarIsOpenAtom);

  const handleSettingsClick = () => setSidebarIsOpen(!sidebarIsOpen);

  const handleReset = () => {
    setAllQueryValues("reset");
    setQueryParams(defaultQueryParams);
  };

  useEffect(() => {}, [queryParams]);

  return (
    <>
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
          <CurrentResultChips />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            sx={{ p: 1, alignSelf: "flex-end" }}
            variant="text"
            size="small"
            onClick={handleReset}
          >
            {/* {t(`resultsHead.reset`)} */}
            Reset
          </Button>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleSettingsClick}
          >
            <SettingsIcon color="action" />
          </IconButton>
        </Box>
      </Stack>
    </>
  );
};
