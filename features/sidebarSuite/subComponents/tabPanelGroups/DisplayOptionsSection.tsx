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

  const { sourceLanguage, settingEnums, filterOmissionsConfig } =
    useDbQueryParams();

  const options = useMemo(() => {
    return [
      ...Object.values(settingEnums.QueriedDisplayOptionEnum),
      ...Object.values(settingEnums.LocalDisplayOptionEnum),
    ].filter(
      (option) =>
        !isSettingOmitted({
          omissions: filterOmissionsConfig,
          settingName: option,
          language: sourceLanguage,
          view: currentView,
        })
    );
  }, [sourceLanguage, currentView]);

  if (options.length === 0) {
    return (
      <Box sx={{ mx: 2 }}>
        <PanelHeading heading={t("headings.display")} />
        <DbViewSelector />
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 2 }}>
      <PanelHeading heading={t("headings.display")} />
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
