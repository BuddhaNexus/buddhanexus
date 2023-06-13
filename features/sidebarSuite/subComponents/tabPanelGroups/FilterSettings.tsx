import { Fragment, useMemo } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Box } from "@mui/material";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import type { SidebarSuitePageContext } from "features/sidebarSuite/common/dbSidebarSettings";
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

  const { sourceLanguage, settingEnums, filterOmissionsConfig } =
    useDbQueryParams();

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
        return filterList.filter((value) => value !== "includeExclude");
      }
      return filterList;
    }

    return filterList.filter(
      (filter) =>
        !isSettingOmitted({
          omissions: filterOmissionsConfig,
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
    filterOmissionsConfig,
  ]);

  return filters.length > 0 ? (
    <Box>
      {filters.map((filter) => {
        const key = `filter-setting-${filter}`;

        switch (filter) {
          case "lang": {
            return <SearchLanguageSelector key={key} />;
          }
          case "score": {
            return <ScoreFilter key={key} />;
          }
          case "par_length": {
            return <ParLengthFilter key={key} />;
          }
          // TODO: Update case when new endpoints are available
          case "includeExclude": {
            return <IncludeExcludeFilters key={key} />;
          }
          case "target_collection": {
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
