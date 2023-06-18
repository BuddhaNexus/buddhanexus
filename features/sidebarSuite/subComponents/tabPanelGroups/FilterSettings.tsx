import { Fragment, useMemo } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Box } from "@mui/material";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import type { SidebarSuitePageContext } from "features/sidebarSuite/config/types";
import { StandinSetting } from "features/sidebarSuite/SidebarSuite";
import {
  IncludeExcludeFilters,
  ParLengthFilter,
  ScoreFilter,
  SearchLanguageSelector,
} from "features/sidebarSuite/subComponents/settings";
import { useAtomValue } from "jotai";
import { StringParam, useQueryParam } from "use-query-params";

export const FilterSettings = ({
  pageType = "db",
}: {
  pageType: SidebarSuitePageContext;
}) => {
  const currentView = useAtomValue(currentViewAtom);

  const {
    sourceLanguage,
    settingEnums,
    settingsList,
    settingsOmissionsConfig,
  } = useDbQueryParams();

  const [currentLang] = useQueryParam(
    settingEnums.SearchPageFilterEnum.LANGUAGE,
    StringParam
  );

  const filters = useMemo(() => {
    const filterList = Object.values(
      pageType === "search"
        ? settingEnums.SearchPageFilterEnum
        : settingEnums.DbPageFilterEnum
    );

    if (pageType === "search") {
      if (!currentLang || currentLang === "all") {
        return filterList.filter(
          // This value is linked to the "include exclude" param case check below and is used to identify the whole block of filters
          (value) => value !== settingsList.queryParams.includeCollection
        );
      }
      return filterList;
    }

    return filterList.filter(
      (filter) =>
        !isSettingOmitted({
          omissions: settingsOmissionsConfig.filters,
          settingName: filter,
          language: sourceLanguage,
          view: currentView,
        })
    );
  }, [
    pageType,
    currentLang,
    sourceLanguage,
    currentView,
    settingsOmissionsConfig,
  ]);

  return filters.length > 0 ? (
    <Box>
      {filters.map((filter) => {
        const key = `filter-setting-${filter}`;

        switch (filter) {
          case settingsList.queryParams.language: {
            return <SearchLanguageSelector key={key} />;
          }
          case settingsList.queryParams.score: {
            return <ScoreFilter key={key} />;
          }
          case settingsList.queryParams.parLength: {
            return <ParLengthFilter key={key} />;
          }
          // This case only tests for one of the "include exclude" params as all 4 filters are always used as a block
          case settingsList.queryParams.includeCollection: {
            return <IncludeExcludeFilters key={key} />;
          }
          case settingsList.queryParams.targetCollection: {
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
