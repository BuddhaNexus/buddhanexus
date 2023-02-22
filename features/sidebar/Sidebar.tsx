import { useTranslation } from "react-i18next";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { TabContext, TabList, TabPanel } from "@mui/lab/";
import { Box, Drawer, IconButton, Tab, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { atom, useAtom } from "jotai";

import { DisplayOptionsSettings } from "./DisplayOptionsSettings";
import { FilterSettings } from "./FilterSettings";
import {
  DrawerHeader,
  SETTINGS_DRAWER_WIDTH,
} from "./MuiStyledSidebarComponents";
import { UtilityOptions } from "./UtilityOptions";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

export const sidebarIsOpenAtom = atom(true);
const activeTabAtom = atom("1");

export const StandinFilter = (setting: string) => (
  <div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>
);

export function Sidebar() {
  const theme = useTheme();
  const { t } = useTranslation("settings");

  const [sidebarIsOpen, setSidebarIsOpen] = useAtom(sidebarIsOpenAtom);

  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  const handleDrawerClose = () => {
    setSidebarIsOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
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
      open={sidebarIsOpen}
    >
      <aside>
        <DrawerHeader
          sx={{
            bgcolor: "background.header",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>

            <IconButton href="/guide" target="_blank" rel="noopener noreferrer">
              <HelpOutlineIcon />
            </IconButton>
          </Box>
        </DrawerHeader>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                aria-label="Filters, desplay options and other settings"
                onChange={handleTabChange}
              >
                <Tab label={t("tabs.options")} value="1" />
                <Tab label={t("tabs.filters")} value="2" />
                <Tab label={t("tabs.info")} value="3" />
              </TabList>
            </Box>

            <TabPanel value="1" sx={{ px: 0 }}>
              <DisplayOptionsSettings />

              <UtilityOptions />

              <Typography variant="h6" mx={2}>
                Links
              </Typography>
            </TabPanel>

            <TabPanel value="2" sx={{ px: 0 }}>
              <FilterSettings />
            </TabPanel>

            <TabPanel value="3">
              <Typography>
                Some specific information about the results in this view /
                language.
              </Typography>
              <Typography variant="h6" mt={2}>
                Tip example
              </Typography>
              <Typography>
                You can use the <kbd>Home</kbd> and <kbd>End</kbd> keys to jump
                to the beginning and end of loaded portions of a text.
              </Typography>
            </TabPanel>
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
