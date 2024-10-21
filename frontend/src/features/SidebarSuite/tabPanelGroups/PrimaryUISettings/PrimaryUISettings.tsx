import { useTranslation } from "next-i18next";
import PanelHeading from "@features/SidebarSuite/common/PanelHeading";
import type { SidebarSuitePageContext } from "@features/SidebarSuite/types";
import { searchRequestFilters } from "@features/SidebarSuite/uiSettings/config";
import { Box } from "@mui/material";

import DbRoutePrimaryUISettings from "./DbRoutePrimaryUISettings";
import FilterUISettings from "./FilterUISettings";

export const PrimaryUISettings = ({
  pageType = "dbSourceFile",
}: {
  pageType: SidebarSuitePageContext;
}) => {
  const { t } = useTranslation("settings");

  if (pageType === "dbSourceFile") {
    return <DbRoutePrimaryUISettings />;
  }

  return (
    <Box>
      <PanelHeading heading={t("headings.filters")} sx={{ mt: 1 }} />
      <FilterUISettings filterSettingNames={searchRequestFilters} />
    </Box>
  );
};
