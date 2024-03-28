import { Fragment, useMemo } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Box } from "@mui/material";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import type { SidebarSuitePageContext } from "features/sidebarSuite/config/types";
import { StandinSetting } from "features/sidebarSuite/SidebarSuite";
import {
  IncludeExcludeFilters,
  MultiLingualSelector,
  ParLengthFilter,
  ScoreFilter,
  SearchLanguageSelector,
} from "features/sidebarSuite/subComponents/settings";
import { useAtomValue } from "jotai";

export const FilterSettings = ({
  pageType = "dbResult",
}: {
  pageType: SidebarSuitePageContext;
}) => {
  const currentView = useAtomValue(currentViewAtom);

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
          case uniqueSettings.queryParams.multiLingual: {
            return <MultiLingualSelector key={key} />;
          }
          case uniqueSettings.queryParams.limits: {
            return (
              <IncludeExcludeFilters key={key} lanuguage={sourceLanguage} />
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
