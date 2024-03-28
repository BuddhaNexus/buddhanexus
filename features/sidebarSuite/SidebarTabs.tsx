import { useTranslation } from "next-i18next";
import { TabList, TabPanel } from "@mui/lab/";
import { Tab } from "@mui/material";
import PanelHeading from "features/sidebarSuite/common/PanelHeading";
import isFeatureEnabled from "utils/featureControls";

import { Info } from "./subComponents/Info";
import { DisplayOptionsSection } from "./subComponents/tabPanelGroups/DisplayOptionsSection";
import { ExternalLinksSection } from "./subComponents/tabPanelGroups/ExternalLinksSection";
import { PrimarySettings } from "./subComponents/tabPanelGroups/PrimarySettings";
import { UtilityOptionsSection } from "./subComponents/tabPanelGroups/UtilityOptionsSection";

interface SettingTabListProps {
  isSearchRoute: boolean | undefined;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}
export const SidebarTabList = ({
  isSearchRoute,
  onTabChange,
}: SettingTabListProps) => {
  const { t } = useTranslation("settings");

  const searchPageTabList = [
    <Tab key="settings-tab-0" value="0" label={t("tabs.options")} />,
  ];

  const dbFilePageTabList = [
    <Tab key="settings-tab-0" value="0" label={t("tabs.settings")} />,
    <Tab key="settings-tab-1" value="1" label={t("tabs.options")} />,
  ];

  if (isFeatureEnabled.infoTabs) {
    [searchPageTabList, dbFilePageTabList].forEach((tabList) => {
      const tab = String(tabList.length);
      tabList.push(
        <Tab key={`settings-tab-${tab}`} value={tab} label={t("tabs.info")} />,
      );
    });
  }

  return (
    <TabList onChange={onTabChange}>
      {isSearchRoute ? searchPageTabList : dbFilePageTabList}
    </TabList>
  );
};

export const SearchPageSidebarTabPanels = () => {
  const { t } = useTranslation("settings");

  return (
    <>
      <TabPanel value="0" sx={{ px: 2 }}>
        <PanelHeading heading={t("tabs.settings")} />
        <PrimarySettings pageType="search" />
        <UtilityOptionsSection />
      </TabPanel>

      {isFeatureEnabled.infoTabs ? (
        <TabPanel value="1">
          <Info />
        </TabPanel>
      ) : null}
    </>
  );
};

export const DbFilePageSidebarTabPanels = () => {
  return (
    <>
      <TabPanel value="0" sx={{ px: 2 }}>
        <PrimarySettings pageType="dbResult" />
      </TabPanel>

      <TabPanel value="1" sx={{ px: 2, pt: 2 }}>
        <DisplayOptionsSection />
        <UtilityOptionsSection />
        <ExternalLinksSection />
      </TabPanel>

      {isFeatureEnabled.infoTabs ? (
        <TabPanel value="2">
          <Info />
        </TabPanel>
      ) : null}
    </>
  );
};
