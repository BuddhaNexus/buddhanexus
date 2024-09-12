import { Fragment, memo, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Box } from "@mui/material";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import PanelHeading from "features/sidebarSuite/common/PanelHeading";
import { UniqueSettingsType } from "features/sidebarSuite/config/settings";
import type { SidebarSuitePageContext } from "features/sidebarSuite/config/types";
import { StandinSetting } from "features/sidebarSuite/SidebarSuite";
import {
  IncludeExcludeFilters,
  ParLengthFilter,
  ScoreFilter,
  SearchLanguageSelector,
} from "features/sidebarSuite/subComponents/settings";
import { DbViewSelector } from "features/sidebarSuite/subComponents/settings/DbViewSelector";
import { useAtomValue } from "jotai";
import { SourceLanguage } from "utils/constants";

type FiltersProps = {
  filters: string[];
  uniqueSettings: UniqueSettingsType;
  sourceLanguage: SourceLanguage;
};

const Filters = memo(function Filters({
  filters,
  uniqueSettings,
  sourceLanguage,
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
        return <IncludeExcludeFilters key={key} language={sourceLanguage} />;
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

  return filters.length > 0 ? (
    <Box>
      {isDbRoute ? (
        <>
          <PanelHeading heading={t("tabs.settings")} />
          <DbViewSelector />
        </>
      ) : null}

      <PanelHeading heading={t("headings.filters")} sx={{ mt: 1 }} />

      <Filters
        filters={filters}
        uniqueSettings={uniqueSettings}
        sourceLanguage={sourceLanguage}
      />
    </Box>
  ) : null;
};
