import { useCallback, useState } from "react";
import { useResultPageType } from "@components/hooks/useResultPageType";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import { TabContext } from "@mui/lab/";
import { Box, Drawer, Toolbar } from "@mui/material";

import { TabContent } from "./TabContent";

export function SidebarSuite() {
  const { isSettingsOpen, setIsSettingsOpen, drawerWidth } =
    useSettingsDrawer();
  const [activeTab, setActiveTab] = useState("0");
  const { isSearchPage } = useResultPageType();

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
            <TabContent
              isSearchPage={isSearchPage}
              handleTabChange={handleTabChange}
              setIsSettingsOpen={setIsSettingsOpen}
            />
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
