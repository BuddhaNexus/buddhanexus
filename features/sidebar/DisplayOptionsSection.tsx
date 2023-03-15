import React from "react";
import { useTranslation } from "next-i18next";
import {
  currentDbViewAtom,
  DbViewSelector,
} from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, Typography } from "@mui/material";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "features/sidebar/settingComponents";
import { StandinSetting } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import {
  DISPLAY_OPTIONS_CONTEXT_OMISSIONS as omissions,
  type DisplayOption,
  isSettingOmitted,
  localDisplayOptionList,
  queriedDisplayOptionList,
} from "utils/dbSidebar";

export const DisplayOptionsSection = () => {
  const currentView = useAtomValue(currentDbViewAtom);
  const { sourceLanguage } = useDbQueryParams();
  const { t } = useTranslation("settings");

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

  return options.length > 0 ? (
    <Box sx={{ mx: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
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
  ) : null;
};
