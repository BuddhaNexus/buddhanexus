import React from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, Typography } from "@mui/material";
import { isSettingOmitted } from "features/sidebar/common/dbSidebarHelpers";
import {
  DISPLAY_OPTIONS_CONTEXT_OMISSIONS as omissions,
  type DisplayOption,
  localDisplayOptionList,
  queriedDisplayOptionList,
} from "features/sidebar/common/dbSidebarSettings";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "features/sidebar/settingComponents";
import {
  currentDbViewAtom,
  DbViewSelector,
} from "features/sidebar/settingComponents/DbViewSelector";
import { StandinSetting } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";

export const DisplayOptionsSection = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentDbViewAtom);

  const { sourceLanguage } = useDbQueryParams();

  const options = [
    ...queriedDisplayOptionList,
    ...localDisplayOptionList,
  ].filter(
    (option: DisplayOption) =>
      !isSettingOmitted({
        omissions,
        settingName: option,
        dbLang: sourceLanguage,
        view: currentView,
      })
  );

  if (options.length === 0) {
    return (
      <Box sx={{ mx: 2 }}>
        <Typography variant="h6" component="h3" mb={2}>
          {t("headings.display")}
        </Typography>
        <DbViewSelector currentView={currentView} />
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 2 }}>
      <Typography variant="h6" component="h3" mb={2}>
        {t("headings.display")}
      </Typography>
      <DbViewSelector currentView={currentView} />
      {options.includes("script") && <TextScriptOption />}
      {options.includes("folio") && <FolioOption />}
      {options.includes("multi_lingual") && StandinSetting("multi_lingual")}
      {options.includes("showAndPositionSegmentNrs") &&
        StandinSetting("showAndPositionSegmentNrs")}
      {options.includes("sort_method") && <SortOption />}
    </Box>
  );
};
