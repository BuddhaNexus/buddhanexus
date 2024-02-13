import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  currentViewAtom,
  shouldHideSegmentNumbersAtom,
  shouldUseOldSegmentColorsAtom,
} from "@components/hooks/useDbView";
import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import PanelHeading from "features/sidebarSuite/common/PanelHeading";
import {
  FolioOption,
  SortOption,
  TextScriptOption,
} from "features/sidebarSuite/subComponents/settings";
import { DbViewSelector } from "features/sidebarSuite/subComponents/settings/DbViewSelector";
import { useAtom, useAtomValue } from "jotai";

// Exclusively used in DB file selection results pages and has not been refactored for options in multiple contexts (i.e. global search results page).
export const DisplayOptionsSection = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentViewAtom);

  const [shouldHideSegmentNumbers, setShouldHideSegmentNumbers] = useAtom(
    shouldHideSegmentNumbersAtom,
  );
  const [shouldUseOldSegmentColors, setShouldUseOldSegmentColors] = useAtom(
    shouldUseOldSegmentColorsAtom,
  );

  const {
    sourceLanguage,
    settingRenderGroups,
    uniqueSettings,
    settingsOmissionsConfig,
  } = useDbQueryParams();

  const options = useMemo(() => {
    return [
      ...Object.values(settingRenderGroups.queriedDisplayOption),
      ...Object.values(settingRenderGroups.localDisplayOption),
    ].filter(
      (option) =>
        !isSettingOmitted({
          omissions: settingsOmissionsConfig.displayOptions,
          settingName: option,
          language: sourceLanguage,
          view: currentView,
        }),
    );
  }, [
    settingRenderGroups,
    settingsOmissionsConfig.displayOptions,
    sourceLanguage,
    currentView,
  ]);

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
            return (
              <FormGroup key={key}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={shouldHideSegmentNumbers}
                      onChange={(event) =>
                        setShouldHideSegmentNumbers(event.target.checked)
                      }
                    />
                  }
                  // todo: i18n
                  label="Hide segment numbers"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={shouldUseOldSegmentColors}
                      onChange={(event) =>
                        setShouldUseOldSegmentColors(event.target.checked)
                      }
                    />
                  }
                  // todo: i18n
                  label="Use segment colors from the previous website"
                />
              </FormGroup>
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
