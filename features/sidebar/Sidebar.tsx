import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import { filterDefaults, filters } from "features/sidebar/filterParams";
import {
  InclusionTextsFilters,
  MinMatchLengthFilter,
} from "features/sidebar/filters";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

interface Props {
  drawerWidth: number;
  isOpen: [boolean, (value: boolean | ((prevVar: boolean) => boolean)) => void];
}

const StandinFilter = (filter: string) => (
  <div>
    <small>{filter} filter coming to a sidebar near your soon!</small>
  </div>
);

const FilterComponents: Record<string, React.ElementType> = {
  par_length: MinMatchLengthFilter,
  limit_collection: InclusionTextsFilters,
  active_segment: () => StandinFilter("active_segment"),
  sort_method: () => StandinFilter("sort_method"),
  target_collection: () => StandinFilter("target_collection"),
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
  const { setQueryParams } = useDbQueryParams();

  const [sidebarIsOpen, setSidebarIsOpen] = isOpen;

  const handleDrawerClose = () => {
    setSidebarIsOpen(false);
  };

  const handleQueryReset = () => {
    setQueryParams(filterDefaults);
    return null;
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
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ py: 1, px: 2 }}
        >
          <Typography color="#888" variant="h6" component="h2">
            FILTERS
          </Typography>

          <Button size="small" onClick={handleQueryReset}>
            Reset
          </Button>
        </Stack>
        <List>
          {filters["proto-filters"].map((filterName) => {
            if (!FilterComponents[filterName]) {
              return null;
            }

            const FilterComponent = FilterComponents[filterName];
            return (
              <ListItem key={filterName}>
                <FilterComponent sourceLang="pli" currentView="proto-filters" />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <Typography
          sx={{ pt: 1, pl: 2 }}
          color="#888"
          variant="h6"
          component="h2"
        >
          SETTINGS
        </Typography>
        <List>
          {["Sīla", "Samādhi", "Paññā"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ToggleOnIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </aside>
    </Drawer>
  );
}
