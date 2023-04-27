import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box } from "@mui/material";
import {
  // LimitCollectionFilters,
  ParLengthFilter,
  ScoreFilter,
} from "features/sidebar/settingComponents";
import { currentDbViewAtom } from "features/sidebar/settingComponents/DbViewSelector";
import { StandinSetting } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import {
  type Filter,
  FILTER_CONTEXT_OMISSIONS as omissions,
  filterList,
  isSettingOmitted,
} from "utils/dbUISettings";

export const FilterSettings = () => {
  const currentView = useAtomValue(currentDbViewAtom);

  const { sourceLanguage } = useDbQueryParams();

  const filters = filterList.filter(
    (filter: Filter) =>
      !isSettingOmitted({
        omissions,
        settingName: filter,
        dbLang: sourceLanguage,
        view: currentView,
      })
  );

  return filters.length > 0 ? (
    <Box sx={{ mx: 2 }}>
      {filters.includes("score") && <ScoreFilter />}
      {filters.includes("par_length") && <ParLengthFilter />}
      {/* {filters.includes("limit_collection") && <LimitCollectionFilters />} */}
      {filters.includes("target_collection") &&
        StandinSetting("target_collection")}
    </Box>
  ) : null;
};
