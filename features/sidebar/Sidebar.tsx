import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { TabContext, TabList, TabPanel } from "@mui/lab/";
import { Box, Drawer, IconButton, List, ListItem, Tab } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  FolioOption,
  InclusionExclusionFilters,
  MinMatchLengthFilter,
  SortOption,
} from "features/sidebar/settingComponents";
import type { DisplayQuery, FilterQuery } from "utils/api/queries";
import { displayOptions, filters } from "utils/api/queries";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

interface Props {
  drawerWidth: number;
  isOpen: [boolean, (value: boolean | ((prevVar: boolean) => boolean)) => void];
}

const StandinFilter = (filter: string) => (
  <div>
    <small>{filter} setting coming to a sidebar near your soon!</small>
  </div>
);

const FilterComponents: Partial<Record<FilterQuery, React.ElementType>> = {
  limit_collection: InclusionExclusionFilters,
  par_length: MinMatchLengthFilter,
  target_collection: () => StandinFilter("target_collection"),
};

const OptionComponents: Record<DisplayQuery, React.ElementType> = {
  folio: FolioOption,
  sort_method: SortOption,
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export function Sidebar({ isOpen, drawerWidth }: Props) {
  const theme = useTheme();

  const [sidebarIsOpen, setSidebarIsOpen] = isOpen;
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
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
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
                <Tab label="Filters" value="1" />
                <Tab label="Options" value="2" />
              </TabList>
            </Box>

            <TabPanel value="1" sx={{ px: 0 }}>
              <List>
                {filters["proto-filters"].map((filterName) => {
                  if (!FilterComponents[filterName]) {
                    return null;
                  }

                  const FilterComponent = FilterComponents[
                    filterName
                  ] as React.ElementType;

                  return (
                    <ListItem key={filterName}>
                      <FilterComponent currentView="proto-filters" />
                    </ListItem>
                  );
                })}
              </List>
            </TabPanel>

            <TabPanel value="2" sx={{ px: 0 }}>
              <List>
                {displayOptions["proto-filters"].map((optionName) => {
                  if (!OptionComponents[optionName]) {
                    return null;
                  }

                  const OptionComponent = OptionComponents[optionName];
                  return (
                    <ListItem key={optionName}>
                      <OptionComponent currentView="proto-filters" />
                    </ListItem>
                  );
                })}
              </List>
            </TabPanel>
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
