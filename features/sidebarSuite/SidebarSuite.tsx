import { useCallback } from "react";
import { useIsRoute } from "@components/hooks/useIsRoute";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TabContext } from "@mui/lab/";
import { Box, Drawer, IconButton, Toolbar } from "@mui/material";
import { atom, useAtom } from "jotai";
import { ROUTE_PATTERNS } from "utils/constants";

import {
  DrawerHeader,
  SETTINGS_DRAWER_WIDTH,
} from "./common/MuiStyledSidebarComponents";
import {
  DbFilePageSidebarTabPanels,
  SearchPageSidebarTabPanels,
  SidebarTabList,
} from "./SidebarTabs";

export const isSidebarOpenAtom = atom(true);
const activeSettingsTabAtom = atom("0");

// TODO: remove once full settings suit is complete
export const StandinSetting = (setting: string) => (
  <div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>
);

export function SidebarSuite() {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [activeTab, setActiveTab] = useAtom(activeSettingsTabAtom);
  const isRoute = useIsRoute([
    { route: "search", pattern: ROUTE_PATTERNS.search },
  ]);

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setActiveTab(newValue);
    },
    [setActiveTab]
  );

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
                <SidebarTabList
                  isSearchRoute={isRoute.search}
                  onTabChange={handleTabChange}
                />
              </Box>

              <IconButton onClick={() => setIsSidebarOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </DrawerHeader>

            {isRoute.search ? (
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
