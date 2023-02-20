import { useState } from "react";
import { currentDbViewAtom } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { TabContext, TabList, TabPanel } from "@mui/lab/";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tab,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  FolioOption,
  InclusionExclusionFilters,
  MinMatchLengthFilter,
  SortOption,
  TextScriptOption,
} from "features/sidebar/settingComponents";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  DISPLAY_OPTIONS,
  type DisplayOption,
  type Filter,
  FILTERS,
  // UTILITY_OPTIONS,
} from "utils/dbUISettings";

import {
  DrawerHeader,
  SETTINGS_DRAWER_WIDTH,
} from "./MuiStyledSidebarComponents";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

export const sidebarIsOpenAtom = atom(true);

const StandinFilter = (setting: string) => (
  <div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>
);

const displayOptionComponents: [DisplayOption, React.ElementType][] = [
  ["folio", FolioOption],
  ["multi_lingual", () => StandinFilter("showAndPositionSegmentNrs")],
  ["script", TextScriptOption],
  [
    "showAndPositionSegmentNrs",
    () => StandinFilter("showAndPositionSegmentNrs"),
  ],
  ["sort_method", SortOption],
];

const filterComponents: [Filter, React.ElementType][] = [
  ["co_occ", () => <span />],
  ["par_length", MinMatchLengthFilter],
  ["limit_collection", InclusionExclusionFilters],
  ["score", () => <span />],
  ["target_collection", () => StandinFilter("target_collection")],
];

export function Sidebar() {
  const theme = useTheme();

  const { sourceLanguage } = useDbQueryParams();

  const currentDbView = useAtomValue(currentDbViewAtom);
  const [sidebarIsOpen, setSidebarIsOpen] = useAtom(sidebarIsOpenAtom);

  const [tabPosition, setTabPosition] = useState("1");

  const handleDrawerClose = () => {
    setSidebarIsOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabPosition(newValue);
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
          <TabContext value={tabPosition}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                aria-label="Filters, desplay options and other settings"
                onChange={handleTabChange}
              >
                <Tab label="Options" value="1" />
                <Tab label="Filters" value="2" />
                <Tab label="Info" value="3" />
              </TabList>
            </Box>

            <TabPanel value="1" sx={{ px: 0 }}>
              <Typography variant="h6" mx={2}>
                Display
              </Typography>
              <List>
                {displayOptionComponents.map((option) => {
                  const [name, DisplayOptionComponent] = option;
                  if (!DISPLAY_OPTIONS[name].views.includes(currentDbView)) {
                    return null;
                  }
                  if (!DISPLAY_OPTIONS[name].langs.includes(sourceLanguage)) {
                    return null;
                  }

                  return (
                    <ListItem key={name}>
                      <DisplayOptionComponent />
                    </ListItem>
                  );
                })}
              </List>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" mx={2}>
                Tools
              </Typography>
              <List sx={{ px: 1 }}>
                {[
                  {
                    id: 1,
                    label: "Download results as xmlx file",
                    Icon: FileDownloadIcon,
                  },
                  {
                    id: 2,
                    label: "Copy results page link",
                    Icon: ShareOutlinedIcon,
                  },
                  {
                    id: 3,
                    label: "Email results page link",
                    Icon: ForwardToInboxIcon,
                  },
                ].map((item) => {
                  const { id, label, Icon } = item;
                  return (
                    <ListItem key={id} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <Icon />
                        </ListItemIcon>
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" mx={2}>
                Links
              </Typography>
            </TabPanel>

            <TabPanel value="2" sx={{ px: 0 }}>
              <List>
                {filterComponents.map((filter) => {
                  const [name, FilterComponent] = filter;
                  if (!FILTERS[name].views.includes(currentDbView)) {
                    return null;
                  }
                  if (!FILTERS[name].langs.includes(sourceLanguage)) {
                    return null;
                  }
                  // TODO: REMOVE LEGACY FILTERS ON CONFIRMATION
                  if (name === "co_occ" || name === "score") {
                    return null;
                  }

                  return (
                    <ListItem key={name}>
                      <FilterComponent />
                    </ListItem>
                  );
                })}
              </List>
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
