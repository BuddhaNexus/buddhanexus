import { Fragment, memo, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box } from "@mui/material";
import { currentViewAtom } from "features/atoms";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import PanelHeading from "features/sidebarSuite/common/PanelHeading";
import { UniqueSettingsType } from "features/sidebarSuite/config/settings";
import type { SidebarSuitePageContext } from "features/sidebarSuite/config/types";
import { StandinSetting } from "features/sidebarSuite/SidebarSuite";
import {
  DbSourceFilters,
  ParLengthFilter,
  ScoreFilter,
  SearchLanguageSelector,
} from "features/sidebarSuite/subComponents/settings";
import { DbViewSelector } from "features/sidebarSuite/subComponents/settings/DbViewSelector";
import { useAtomValue } from "jotai";

type FiltersProps = {
  filters: string[];
  uniqueSettings: UniqueSettingsType;
};

const Filters = memo(function Filters({
  filters,
  uniqueSettings,
}: FiltersProps) {
  return filters.map((filter) => {
    const key = `filter-setting-${filter}`;

    switch (filter) {
      case uniqueSettings.queryParams.language: {
        return <SearchLanguageSelector key={key} />;
      }
      case uniqueSettings.queryParams.score: {
        return <ScoreFilter key={key} />;
      }
      case uniqueSettings.queryParams.parLength: {
        return <ParLengthFilter key={key} />;
      }
      // disabled in features/sidebarSuite/config/settings.ts
      // case uniqueSettings.queryParams.multiLingual: {
      //   return <MultiLingualSelector key={key} />;
      // }
      case uniqueSettings.queryParams.limits: {
        return <DbSourceFilters key={key} />;
      }
      case uniqueSettings.queryParams.targetCollection: {
        return (
          <Fragment key={key}>{StandinSetting("target_collection")}</Fragment>
        );
      }
      default: {
        return null;
      }
    }
  });
});

export const PrimarySettings = ({
  pageType = "dbResult",
}: {
  pageType: SidebarSuitePageContext;
}) => {
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentViewAtom);
  const router = useRouter();
  const isDbRoute = router.route.startsWith("/db");

  const {
    sourceLanguage,
    pageSettings,
    uniqueSettings,
    settingsOmissionsConfig,
  } = useDbQueryParams();

  const filters = useMemo(() => {
    const filterList = Object.values(pageSettings[pageType].filters);

    return filterList.filter(
      (filter) =>
        !isSettingOmitted({
          omissions: settingsOmissionsConfig.filters,
          settingName: filter,
          language: sourceLanguage,
          pageContext: pageType === "search" ? "search" : currentView,
        }),
    );
  }, [
    pageType,
    sourceLanguage,
    currentView,
    settingsOmissionsConfig,
    pageSettings,
  ]);

  if (filters.length === 0) return null;

  if (isDbRoute) {
    return (
      <Box>
        <PanelHeading heading={t("tabs.settings")} />
        <DbViewSelector />

        <PanelHeading heading={t("headings.filters")} sx={{ mt: 1 }} />
        <Filters filters={filters} uniqueSettings={uniqueSettings} />
      </Box>
    );
  }

  return (
    <Box>
      <PanelHeading heading={t("headings.filters")} sx={{ mt: 1 }} />
      <Filters filters={filters} uniqueSettings={uniqueSettings} />
    </Box>
  );
};
