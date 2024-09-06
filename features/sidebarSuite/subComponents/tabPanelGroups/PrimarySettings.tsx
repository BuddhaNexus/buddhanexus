import { Fragment, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box } from "@mui/material";
import { currentViewAtom } from "features/atoms";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import PanelHeading from "features/sidebarSuite/common/PanelHeading";
import type { SidebarSuitePageContext } from "features/sidebarSuite/config/types";
import { StandinSetting } from "features/sidebarSuite/SidebarSuite";
import {
  IncludeExcludeFilters,
  // MultiLingualSelector,
  ParLengthFilter,
  ScoreFilter,
  SearchLanguageSelector,
} from "features/sidebarSuite/subComponents/settings";
import { DbViewSelector } from "features/sidebarSuite/subComponents/settings/DbViewSelector";
import { useAtomValue } from "jotai";

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
      {filters.map((filter) => {
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
            return (
              <IncludeExcludeFilters key={key} language={sourceLanguage} />
            );
          }
          case uniqueSettings.queryParams.targetCollection: {
            return (
              <Fragment key={key}>
                {StandinSetting("target_collection")}
              </Fragment>
            );
          }
          default: {
            return null;
          }
        }
      })}
    </Box>
  ) : null;
};
