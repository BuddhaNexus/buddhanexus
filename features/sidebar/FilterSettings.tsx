import { currentDbViewAtom } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box } from "@mui/material";
import {
  LimitCollectionFilters,
  ParLengthFilter,
  ScoreFilter,
} from "features/sidebar/settingComponents";
import { StandinSetting } from "features/sidebar/Sidebar";
import { useAtomValue } from "jotai";
import {
  type Filter,
  FILTER_CONTEXT_OMISSIONS as omissions,
  filterList,
  isSettingOmitted,
} from "utils/dbSidebar";

export const FilterSettings = () => {
  const currentDbView = useAtomValue(currentDbViewAtom);

  const { sourceLanguage } = useDbQueryParams();

  const currentFilters = filterList.filter(
    (filter: Filter) =>
      !isSettingOmitted({
        omissions,
        settingName: filter,
        dbLang: sourceLanguage,
        view: currentDbView,
      })
  );

  return currentFilters.length > 0 ? (
    <Box sx={{ mx: 2 }}>
      {currentFilters.includes("score") && <ScoreFilter />}
      {currentFilters.includes("par_length") && <ParLengthFilter />}
      {currentFilters.includes("limit_collection") && (
        <LimitCollectionFilters />
      )}
      {currentFilters.includes("target_collection") &&
        StandinSetting("target_collection")}
    </Box>
  ) : null;
};
