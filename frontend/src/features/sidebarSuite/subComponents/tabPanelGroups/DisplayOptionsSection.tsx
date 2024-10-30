import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { isSettingOmitted } from "@features/sidebarSuite/common/dbSidebarHelpers";
import PanelHeading from "@features/sidebarSuite/common/PanelHeading";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "@features/sidebarSuite/subComponents/settings";
import { SegmentOptions } from "@features/sidebarSuite/subComponents/settings/SegmentOptions";
import { Box } from "@mui/material";
import { useAtomValue } from "jotai";

// Exclusively used in DB file selection results pages and has not been refactored for options in multiple contexts (i.e. global search results page).
export const DisplayOptionsSection = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentDbViewAtom);

  const {
    sourceLanguage,
    pageSettings,
    uniqueSettings,
    settingsOmissionsConfig,
  } = useDbQueryParams();

  const options = useMemo(() => {
    return Object.values(pageSettings.dbResult.displayOptions).filter(
      (option) =>
        !isSettingOmitted({
          omissions: settingsOmissionsConfig.displayOptions,
          settingName: option,
          language: sourceLanguage,
          pageContext: currentView,
        }),
    );
  }, [
    pageSettings,
    settingsOmissionsConfig.displayOptions,
    sourceLanguage,
    currentView,
  ]);

  if (options.length === 0) {
    return null;
  }

  return (
    <Box>
      <PanelHeading heading={t("headings.display")} sx={{ mb: 2 }} />
      {options.map((option) => {
        const key = `display-option-${option}`;

        switch (option) {
          case uniqueSettings.queryParams.folio: {
            return <FolioOption key={key} />;
          }
          case uniqueSettings.queryParams.sortMethod: {
            return <SortOption key={key} />;
          }
          // SEE: features/sidebarSuite/config/settings.ts for suspended setting info
          case uniqueSettings.local.script: {
            return <TextScriptOption key={key} />;
          }
          case uniqueSettings.local.showSegmentNrs: {
            return <SegmentOptions key={key} />;
          }
          default: {
            return null;
          }
        }
      })}
    </Box>
  );
};
