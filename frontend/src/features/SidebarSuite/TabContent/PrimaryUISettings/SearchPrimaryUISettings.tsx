import { useTranslation } from "next-i18next";
import { useLanguageParam } from "@components/hooks/params";
import PanelHeading from "@features/SidebarSuite/common/PanelHeading";
import { AVAILABLE_SEARCH_PAGE_FILTERS } from "@features/SidebarSuite/TabContent/config";
import { searchRequestFilters } from "@features/SidebarSuite/uiSettings/config";
import { Box } from "@mui/material";

import FilterUISettings from "./FilterUISettings";

export default function SearchPrimaryUISettings() {
  const { t } = useTranslation("settings");

  const [language] = useLanguageParam();

  const filters = searchRequestFilters.filter((filterName) =>
    AVAILABLE_SEARCH_PAGE_FILTERS[filterName].has(language),
  );

  if (filters.length === 0) return null;

  return (
    <Box>
      <PanelHeading heading={t("headings.filters")} sx={{ mb: 1 }} />
      <FilterUISettings filterSettingNames={filters} />
    </Box>
  );
}
