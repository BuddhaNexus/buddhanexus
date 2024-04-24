import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TabContext } from "@mui/lab/";
import { Box, Drawer, IconButton, Toolbar } from "@mui/material";

import { DrawerHeader } from "./common/MuiStyledSidebarComponents";
import {
  DbFilePageSidebarTabPanels,
  SearchPageSidebarTabPanels,
  SidebarTabList,
  SidebarTabListSearch,
} from "./SidebarTabs";

// TODO: remove once full settings suit is complete
export const StandinSetting = (setting: string) => (
  <div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>
);

export function SidebarSuite() {
  const router = useRouter();
  const { isSettingsOpen, setIsSettingsOpen, drawerWidth } =
    useSettingsDrawer();
  const [activeTab, setActiveTab] = useState("0");
  const isSearchRoute = router.route.startsWith("/search");

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setActiveTab(newValue);
    },
    [setActiveTab],
  );

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={isSettingsOpen}
    >
      <Toolbar />
      <aside
        id="db-results-settings-sidebar"
        aria-label="settings and info tabs"
      >
        <Box sx={{ width: 1 }}>
          <TabContext value={activeTab}>
            <DrawerHeader>
              <Box sx={{ width: 1, borderBottom: 1, borderColor: "divider" }}>
                {isSearchRoute ? (
                  <SidebarTabListSearch onTabChange={handleTabChange} />
                ) : (
                  <SidebarTabList onTabChange={handleTabChange} />
                )}
              </Box>

              <IconButton
                aria-label="close settings"
                onClick={() => setIsSettingsOpen(false)}
              >
                <CloseRoundedIcon />
              </IconButton>
            </DrawerHeader>

            {isSearchRoute ? (
              <SearchPageSidebarTabPanels />
            ) : (
              <DbFilePageSidebarTabPanels />
            )}
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
