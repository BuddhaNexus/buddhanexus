import { Fragment, useMemo } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { currentViewAtom } from "@components/hooks/useDbView";
import { Box } from "@mui/material";
import { isSettingOmitted } from "features/sidebarSuite/common/dbSidebarHelpers";
import {
  FILTER_OMISSIONS_CONFIG as omissions,
  FilterEnum,
} from "features/sidebarSuite/common/dbSidebarSettings";
import { StandinSetting } from "features/sidebarSuite/SidebarSuite";
import {
  IncludeExcludeFilters,
  ParLengthFilter,
  ScoreFilter,
} from "features/sidebarSuite/subComponents/settings";
import { useAtomValue } from "jotai";

export const FilterSettings = () => {
  const currentView = useAtomValue(currentViewAtom);

  const { sourceLanguage } = useDbQueryParams();

  const filters = useMemo(() => {
    return Object.values(FilterEnum).filter(
      (filter) =>
        !isSettingOmitted({
          omissions,
          settingName: filter,
          language: sourceLanguage,
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
