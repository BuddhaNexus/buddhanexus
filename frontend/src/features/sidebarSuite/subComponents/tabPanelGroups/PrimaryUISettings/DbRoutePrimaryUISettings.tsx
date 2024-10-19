import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import PanelHeading from "@features/sidebarSuite/common/PanelHeading";
import { DbViewSelector } from "@features/sidebarSuite/subComponents/uiSettings/DbViewSelector";
import { DBSourceFilePageFilterUISettingName } from "@features/sidebarSuite/types";
import { dbSoureFileRequestFilters } from "@features/sidebarSuite/uiSettingsDefinition";
import { Box } from "@mui/material";
import { DbViewEnum } from "@utils/constants";
import { useAtomValue } from "jotai";

import FilterUISettings from "./FilterUISettings";

const AVAILABLE_FILTERS: Record<
  DbViewEnum,
  DBSourceFilePageFilterUISettingName[]
> = {
  [DbViewEnum.GRAPH]: dbSoureFileRequestFilters.filter(
    (filterName) => filterName !== "exclude_sources",
  ),
  [DbViewEnum.NUMBERS]: dbSoureFileRequestFilters,
  [DbViewEnum.TABLE]: dbSoureFileRequestFilters,
  [DbViewEnum.TEXT]: dbSoureFileRequestFilters,
};

export default function DbRoutePrimaryUISettings() {
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentDbViewAtom);

  const filters = AVAILABLE_FILTERS[currentView];

  if (filters.length === 0) return null;

  return (
    <Box>
      <PanelHeading heading={t("tabs.settings")} />
      <DbViewSelector />

      <PanelHeading heading={t("headings.filters")} sx={{ mt: 1 }} />
      <FilterUISettings filterSettingNames={filters} />
    </Box>
  );
}
