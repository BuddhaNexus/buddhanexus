import { Fragment, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Box, FormLabel } from "@mui/material";
import { isSettingOmitted } from "features/sidebar/common/dbSidebarHelpers";
import {
  FILTER_OMISSIONS_CONFIG as omissions,
  FilterEnum,
} from "features/sidebar/common/dbSidebarSettings";
import {
  ExcludeCollectionFilter,
  ExcludeTextFilter,
  IncludeCollectionFilter,
  IncludeTextFilter,
  ParLengthFilter,
  ScoreFilter,
} from "features/sidebar/settingComponents";
import { StandinSetting } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";

export const FilterSettings = () => {
  const { t } = useTranslation("settings");

  const currentView = useAtomValue(currentViewAtom);

  const { sourceLanguage } = useDbQueryParams();

  const filters = useMemo(() => {
    return Object.values(FilterEnum).filter(
      (filter) =>
        !isSettingOmitted({
          omissions,
          settingName: filter,
          dbLang: sourceLanguage,
          view: currentView,
        })
    );
  }, [sourceLanguage, currentView]);

  return filters.length > 0 ? (
    <Box sx={{ mx: 2 }}>
      {filters.map((filter) => {
        const key = `filter-setting-${filter}`;

        switch (filter) {
          case "score": {
            return <ScoreFilter key={key} />;
          }
          case "par_length": {
            return <ParLengthFilter key={key} />;
          }
          case "limit_collection": {
            // TODO: Update case when new endpoints are available
            return (
              <Fragment key={key}>
                <FormLabel id="exclude-include-filters-label">
                  {t(`filtersLabels.includeExcludeFilters`)}
                </FormLabel>
                <ExcludeCollectionFilter />
                <ExcludeTextFilter />
                <IncludeCollectionFilter />
                <IncludeTextFilter />
              </Fragment>
            );
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
