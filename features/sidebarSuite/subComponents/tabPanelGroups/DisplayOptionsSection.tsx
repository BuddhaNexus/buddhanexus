import React, { Fragment, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Box, Typography } from "@mui/material";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import {
  DISPLAY_OPTIONS_OMISSIONS_CONFIG as omissions,
  LocalDisplayOptionEnum,
  QueriedDisplayOptionEnum,
} from "features/sidebarSuite/common/dbSidebarSettings";
import { StandinSetting } from "features/sidebarSuite/SidebarSuite";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "features/sidebarSuite/subComponents/settings";
import { DbViewSelector } from "features/sidebarSuite/subComponents/settings/DbViewSelector";
import { useAtomValue } from "jotai";

export const DisplayOptionsSection = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentViewAtom);

  const { sourceLanguage } = useDbQueryParams();

  const options = useMemo(() => {
    return [
      ...Object.values(QueriedDisplayOptionEnum),
      ...Object.values(LocalDisplayOptionEnum),
    ].filter(
      (option) =>
        !isSettingOmitted({
          omissions,
          settingName: option,
          language: sourceLanguage,
          view: currentView,
        })
    );
  }, [sourceLanguage, currentView]);

  if (options.length === 0) {
    return (
      <Box sx={{ mx: 2 }}>
        <Typography variant="h6" component="h3" mb={2}>
          {t("headings.display")}
        </Typography>
        <DbViewSelector />
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 2 }}>
      <Typography variant="h6" component="h3" mb={2}>
        {t("headings.display")}
      </Typography>
      <DbViewSelector />
      {options.map((option) => {
        const key = `display-option-${option}`;

        switch (option) {
          case "folio": {
            return <FolioOption key={key} />;
          }
          case "sort_method": {
            return <SortOption key={key} />;
          }
          case "multi_lingual": {
            return (
              <Fragment key={key}>{StandinSetting("multi_lingual")}</Fragment>
            );
          }
          case "script": {
            return <TextScriptOption key={key} />;
          }
          case "showAndPositionSegmentNrs": {
            return (
              <Fragment key={key}>
                {StandinSetting("showAndPositionSegmentNrs")}
              </Fragment>
            );
          }
          default: {
            return null;
          }
        }
      })}
    </Box>
  );
};
