import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import PanelHeading from "@features/sidebarSuite/common/PanelHeading";
import { displaySettingComponents } from "@features/sidebarSuite/subComponents/uiSettings";

import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { displayUISettings } from "@features/sidebarSuite/uiSettingsLists";

import { DisplayUISettingName } from "@features/sidebarSuite/types";
import {
  getAvailableSettings,
  type UnavailableLanguages,
} from "@features/sidebarSuite/utils";
import { DbViewEnum, SourceLanguage as Lang } from "@utils/constants";

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
    script: [Lang.PALI, Lang.CHINESE, Lang.SANSKRIT],
    showSegmentNrs: "allLangs",
  },
  [DbViewEnum.TEXT]: {
    sort_method: "allLangs",
    script: [Lang.PALI, Lang.CHINESE, Lang.SANSKRIT],
  },
};

export const DisplayOptionsSection = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentDbViewAtom);
  const { sourceLanguage } = useDbRouterParams();

  const uiSettings = useMemo(() => {
    return getAvailableSettings<DisplayUISettingName>({
      sourceLanguage,
      uiSettings: displayUISettings,
      unavailableSettingsForView: UNAVAILABLE_SETTINGS[currentView],
    });
  }, [sourceLanguage, currentView]);

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
