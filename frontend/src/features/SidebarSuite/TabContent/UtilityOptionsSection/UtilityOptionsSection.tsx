import type { JSX } from "react";
import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useNullableDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useResultPageType } from "@components/hooks/useResultPageType";
import PanelHeading from "@features/SidebarSuite/common/PanelHeading";
import {
  UNAVAILABLE_DB_SOURCE_PAGE_UI_UTILITIES,
  UNAVAILABLE_SEARCH_PAGE_UI_UTILITIES,
} from "@features/SidebarSuite/TabContent/config";
import { UtilityUIOptionName } from "@features/SidebarSuite/types";
import { utilityUISettings } from "@features/SidebarSuite/uiSettings/config";
import { getAvailableSettings } from "@features/SidebarSuite/utils";
import List from "@mui/material/List";
import { useAtomValue } from "jotai";

import { CopyResultInfoButton } from "./CopyResultInfoButton";
import { DownloadResultsButton } from "./DownloadResultsButton";
import { EmailResultInfoButton } from "./EmailResultInfoButton";

export const UtilityUiomponents: Record<
  UtilityUIOptionName,
  JSX.Element | null
> = {
  download_data: <DownloadResultsButton />,
  copyResultInfo: <CopyResultInfoButton />,
  emailResultInfo: <EmailResultInfoButton />,
};

export const UtilityOptionsSection = () => {
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentDbViewAtom);
  const { dbLanguage } = useNullableDbRouterParams();

  const pageType = useResultPageType();

  const uiOptions = useMemo(() => {
    if (pageType.isSearchPage) {
      return utilityUISettings.filter(
        (setting) => !UNAVAILABLE_SEARCH_PAGE_UI_UTILITIES.includes(setting),
      );
    }

    if (dbLanguage && pageType.isDbFilePage) {
      return getAvailableSettings<UtilityUIOptionName>({
        dbLanguage,
        uiSettings: utilityUISettings,
        unavailableSettingsForViewOrLang:
          UNAVAILABLE_DB_SOURCE_PAGE_UI_UTILITIES[currentView],
      });
    }

    return [];
  }, [dbLanguage, currentView, pageType]);

  if (uiOptions.length === 0) {
    return null;
  }

  return (
    <>
      <PanelHeading heading={t("headings.tools")} sx={{ mt: 3 }} />

      <List sx={{ m: 0 }}>
        {uiOptions.map((filter) => {
          const Component = UtilityUiomponents[filter];
          const key = `filter-setting-${filter}`;

          if (!Component) return null;
          return React.cloneElement(Component, { key });
        })}
      </List>
    </>
  );
};
