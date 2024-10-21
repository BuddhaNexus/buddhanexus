import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import PanelHeading from "@features/SidebarSuite/common/PanelHeading";
import { DisplayUISettingName } from "@features/SidebarSuite/types";
import { displaySettingComponents } from "@features/SidebarSuite/uiSettings";
import { displayUISettings } from "@features/SidebarSuite/uiSettings/config";
import { getAvailableSettings } from "@features/SidebarSuite/utils";
import { Box } from "@mui/material";
import { useAtomValue } from "jotai";

import { UNAVAILABLE_DISPLAY_SETTINGS } from "./config";

export const DisplayOptionsSection = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentDbViewAtom);
  const { dbLanguage } = useDbRouterParams();

  const uiSettings = useMemo(() => {
    return getAvailableSettings<DisplayUISettingName>({
      dbLanguage,
      uiSettings: displayUISettings,
      unavailableSettingsForViewOrLang:
        UNAVAILABLE_DISPLAY_SETTINGS[currentView],
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
