import React, { Fragment, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Box } from "@mui/material";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import PanelHeading from "features/sidebarSuite/common/PanelHeading";
import { StandinSetting } from "features/sidebarSuite/SidebarSuite";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "features/sidebarSuite/subComponents/settings";
import { DbViewSelector } from "features/sidebarSuite/subComponents/settings/DbViewSelector";
import { useAtomValue } from "jotai";

// Exclusively used in DB file selection results pages and has not been refactored for options in multiple contexts (i.e. global search results page).
export const DisplayOptionsSection = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentViewAtom);

  const {
    sourceLanguage,
    settingEnums,
    settingsList,
    settingsOmissionsConfig,
  } = useDbQueryParams();

  const options = useMemo(() => {
    return [
      ...Object.values(settingEnums.QueriedDisplayOptionEnum),
      ...Object.values(settingEnums.LocalDisplayOptionEnum),
    ].filter(
      (option) =>
        !isSettingOmitted({
          omissions: settingsOmissionsConfig.displayOptions,
          settingName: option,
          language: sourceLanguage,
          view: currentView,
        })
    );
  }, [sourceLanguage, currentView]);

  if (options.length === 0) {
    return (
      <Box>
        <PanelHeading heading={t("headings.display")} />
        <DbViewSelector />
      </Box>
    );
  }

  return (
    <Box>
      <PanelHeading heading={t("headings.display")} sx={{ mb: 2 }} />

      <DbViewSelector />
      {options.map((option) => {
        const key = `display-option-${option}`;

        switch (option) {
          case settingsList.queryParams.folio: {
            return <FolioOption key={key} />;
          }
          case settingsList.queryParams.sortMethod: {
            return <SortOption key={key} />;
          }
          case settingsList.queryParams.multiLingual: {
            return (
              <Fragment key={key}>{StandinSetting("multi_lingual")}</Fragment>
            );
          }
          case settingsList.local.script: {
            return <TextScriptOption key={key} />;
          }
          case settingsList.local.showAndPositionSegmentNrs: {
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
