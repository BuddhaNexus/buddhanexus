import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormLabel } from "@mui/material";
import {
  ExcludeCollectionFilter,
  ExcludeTextFilter,
  IncludeCollectionFilter,
  IncludeTextFilter,
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
  const { t } = useTranslation("settings");

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
      {/* TODO: Update filters on new endpoint backend refactor */}
      {filters.includes("limit_collection") && (
        <FormLabel id="exclude-collection-filters-label">
          {t(`filtersLabels.minMatch`)}
        </FormLabel>
      )}
      {filters.includes("limit_collection") && <ExcludeCollectionFilter />}
      {filters.includes("limit_collection") && <ExcludeTextFilter />}
      {filters.includes("limit_collection") && <IncludeCollectionFilter />}
      {filters.includes("limit_collection") && <IncludeTextFilter />}
      {filters.includes("target_collection") &&
        StandinSetting("target_collection")}
    </Box>
  ) : null;
};
