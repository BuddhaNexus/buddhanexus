import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import PanelHeading from "@features/sidebarSuite/common/PanelHeading";
import { displaySettingComponents } from "@features/sidebarSuite/subComponents/uiSettings";
import { DisplayUISettingName } from "@features/sidebarSuite/types";
import { displayUISettings } from "@features/sidebarSuite/uiSettingsDefinition";
import {
  getAvailableSettings,
  type UnavailableLanguages,
} from "@features/sidebarSuite/utils";
import { Box } from "@mui/material";
import { DbViewEnum } from "@utils/constants";
import { useAtomValue } from "jotai";

type LanguageUnabvailableSettings = Partial<
  Record<DisplayUISettingName, UnavailableLanguages>
>;
type UnavailableDisplaySettings = Record<
  DbViewEnum,
  LanguageUnabvailableSettings
>;

const UNAVAILABLE_SETTINGS: UnavailableDisplaySettings = {
  [DbViewEnum.GRAPH]: {
    folio: "allLangs",
    sort_method: "allLangs",
    showSegmentNrs: "allLangs",
  },
  [DbViewEnum.NUMBERS]: {
    sort_method: "allLangs",
    script: "allLangs",
    showSegmentNrs: "allLangs",
  },
  [DbViewEnum.TABLE]: {
    sort_method: "allLangs",
    script: ["pa", "zh", "sa"],
    showSegmentNrs: "allLangs",
  },
  [DbViewEnum.TEXT]: {
    sort_method: "allLangs",
    script: ["pa", "zh", "sa"],
  },
};

export const DisplayOptionsSection = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentDbViewAtom);
  const { dbLanguage } = useDbRouterParams();

  const uiSettings = useMemo(() => {
    return getAvailableSettings<DisplayUISettingName>({
      dbLanguage,
      uiSettings: displayUISettings,
      unavailableSettingsForView: UNAVAILABLE_SETTINGS[currentView],
    });
  }, [dbLanguage, currentView]);

  if (uiSettings.length === 0) {
    return null;
  }

  return (
    <Box>
      <PanelHeading heading={t("headings.display")} sx={{ mb: 2 }} />
      {uiSettings.map((setting) => {
        const Component = displaySettingComponents[setting];
        const key = `display-setting-${setting}`;

        if (!Component) return null;
        return React.cloneElement(Component, { key });
      })}
    </Box>
  );
};
