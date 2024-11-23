import React, { useCallback, useState } from "react";
import { useResultPageType } from "@components/hooks/useResultPageType";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import { TabContext } from "@mui/lab/";
import { Box, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { TabContent } from "./TabContent";

export function SidebarSuite() {
  const { isSettingsOpen, setIsSettingsOpen, drawerWidth } =
    useSettingsDrawer();
  const [activeTab, setActiveTab] = useState("0");
  const { isSearchPage } = useResultPageType();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

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
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      variant={isMd ? "persistent" : "temporary"}
      anchor="right"
      open={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
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
