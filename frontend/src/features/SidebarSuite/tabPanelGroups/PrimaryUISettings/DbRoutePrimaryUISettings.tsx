import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import PanelHeading from "@features/SidebarSuite/common/PanelHeading";
import { DbViewSelector } from "@features/SidebarSuite/uiSettings/DbViewSelector";
import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { AVAILABLE_UI_FILTERS } from "src/features/SidebarSuite/tabPanelGroups/config";

import FilterUISettings from "./FilterUISettings";

export default function DbRoutePrimaryUISettings() {
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentDbViewAtom);

  const filters = AVAILABLE_UI_FILTERS[currentView];

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
