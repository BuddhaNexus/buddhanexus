import { useTranslation } from "next-i18next";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TabContext, TabList, TabPanel } from "@mui/lab/";
import { Box, Drawer, IconButton, Tab, Toolbar } from "@mui/material";
import { atom, useAtom } from "jotai";

import { Info } from "./common/Info";
import {
  DrawerHeader,
  SETTINGS_DRAWER_WIDTH,
} from "./common/MuiStyledSidebarComponents";
import { DisplayOptionsSection } from "./DisplayOptionsSection";
import { ExternalLinksSection } from "./ExternalLinksSection";
import { FilterSettings } from "./FilterSettings";
import { UtilityOptionsSection } from "./UtilityOptionsSection";

type ActiveTab = "1" | "2" | "3";

export const isSidebarOpenAtom = atom(true);
export const activeSettingsTabAtom = atom<ActiveTab>("1");

// TODO: remove once full settings suit is complete
export const StandinSetting = (setting: string) => (
  <div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>
);

export function Sidebar() {
  const { t } = useTranslation("settings");
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [activeTab, setActiveTab] = useAtom(activeSettingsTabAtom);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: ActiveTab
  ) => {
    setActiveTab(newValue);
  };

  return (
    <Drawer
      sx={{
        width: SETTINGS_DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SETTINGS_DRAWER_WIDTH,
        },
      }}
      variant="persistent"
      anchor="right"
      open={isSidebarOpen}
    >
      <Toolbar />
      <aside>
        <Box sx={{ width: 1 }}>
          <TabContext value={activeTab}>
            <DrawerHeader>
              <Box sx={{ width: 1, borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  aria-label="Filters, desplay options and other settings"
                  onChange={handleTabChange}
                >
                  <Tab label={t("tabs.options")} value="1" />
                  <Tab label={t("tabs.filters")} value="2" />
                  <Tab label={t("tabs.info")} value="3" />
                </TabList>
              </Box>

              <IconButton onClick={() => setIsSidebarOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </DrawerHeader>

            <TabPanel value="1" sx={{ px: 0 }}>
              <DisplayOptionsSection />

              <UtilityOptionsSection />

              <ExternalLinksSection />
            </TabPanel>

            <TabPanel value="2" sx={{ px: 0 }}>
              <FilterSettings />
            </TabPanel>

            <TabPanel value="3">
              <Info />
            </TabPanel>
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
