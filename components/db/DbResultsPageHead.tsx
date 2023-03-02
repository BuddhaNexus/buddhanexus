// import { useTranslation } from "react-i18next";
import CurrentResultChips from "@components/db/CurrentResultChips";
import type { DbView } from "@components/db/DbViewSelector";
import { DbViewSelector } from "@components/db/DbViewSelector";
import { SourceTextSearchInput } from "@components/db/SourceTextSearchInput";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { sidebarIsOpenAtom } from "features/sidebar/Sidebar";
import { useAtom, useSetAtom } from "jotai";
import {
  DEFAULT_QUERY_SETTING_VALUES,
  QUERY_DEFAULTS,
  querySettingsValuesAtom,
} from "utils/dbSidebar";

export const DbResultsPageHead = ({ currentView }: { currentView: DbView }) => {
  // TODO: get full text name
  const { fileName, setQueryParams, sourceLanguage } = useDbQueryParams();

  const QUERY_PARAM_DEFAULTS = {
    ...QUERY_DEFAULTS,
    par_length: QUERY_DEFAULTS.par_length[sourceLanguage],
  };

  // const { t } = useTranslation("settings");

  const [sidebarIsOpen, setSidebarIsOpen] = useAtom(sidebarIsOpenAtom);
  const setQueryValues = useSetAtom(querySettingsValuesAtom);

  const handleSettingsClick = () => setSidebarIsOpen(!sidebarIsOpen);

  const handleReset = () => {
    setQueryValues(DEFAULT_QUERY_SETTING_VALUES);
    setQueryParams(QUERY_PARAM_DEFAULTS);
  };

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
          <Button
            sx={{ ml: 1, alignSelf: "flex-end" }}
            variant="text"
            size="small"
            onClick={handleReset}
          >
            {/* {t(`resultsHead.reset`)} */}
            Reset
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DbViewSelector currentView={currentView} />
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
