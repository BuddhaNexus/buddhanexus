import { useTranslation } from "next-i18next";
import { TabList, TabPanel } from "@mui/lab/";
import { Tab } from "@mui/material";

import { Info } from "./subComponents/Info";
import { DisplayOptionsSection } from "./subComponents/tabPanelGroups/DisplayOptionsSection";
import { ExternalLinksSection } from "./subComponents/tabPanelGroups/ExternalLinksSection";
import { FilterSettings } from "./subComponents/tabPanelGroups/FilterSettings";
import { UtilityOptionsSection } from "./subComponents/tabPanelGroups/UtilityOptionsSection";

interface SettingTabListProps {
  isSearchRoute: boolean;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}
export const SidebarTabList = ({
  isSearchRoute,
  onTabChange,
}: SettingTabListProps) => {
  const { t } = useTranslation("settings");

  /* TODO: defined what's needed for search page results */
  const searchPageTabList = [
    <Tab key="settings-tab-0" value="0" label={t("tabs.filters")} />,
    <Tab key="settings-tab-1" value="1" label="More" />,
  ];

  const dbFilePageTabList = [
    <Tab key="settings-tab-0" value="0" label={t("tabs.options")} />,
    <Tab key="settings-tab-1" value="1" label={t("tabs.filters")} />,
    <Tab key="settings-tab-2" value="2" label={t("tabs.info")} />,
  ];

  return (
    <TabList onChange={onTabChange}>
      {isSearchRoute ? searchPageTabList : dbFilePageTabList}
    </TabList>
  );
};

export const DbFilePageSidebarTabPanels = () => {
  return (
    <>
      <TabPanel value="0" sx={{ px: 0 }}>
        <DisplayOptionsSection />

        <UtilityOptionsSection />

        <ExternalLinksSection />
      </TabPanel>
      <TabPanel value="1" sx={{ px: 0 }}>
        <FilterSettings />
      </TabPanel>
      <TabPanel value="2">
        <Info />
      </TabPanel>
    </>
  );
};

export const SearchPageSidebarTabPanels = () => {
  return (
    <>
      <TabPanel value="0" sx={{ px: 0 }}>
        <FilterSettings />
      </TabPanel>
      {/* TODO: defined what's needed for search page results */}
      <TabPanel value="1">
        <Info />
      </TabPanel>
    </>
  );
};
