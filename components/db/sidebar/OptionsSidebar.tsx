import { VIEW_FILTERS } from "@components/db/sidebar/filters";
import { MinMatchLengthFilter as MinMatchLength } from "@components/db/sidebar/filterUIs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
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
import { styled, useTheme } from "@mui/material/styles";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

interface Props {
  drawerWidth: number;
  isOpen: [boolean, (value: boolean | ((prevVar: boolean) => boolean)) => void];
}

const StandinFilter = () => (
  <div>
    <small>Filter coming to a sidebar near your soon!</small>
  </div>
);

const FilterComponents: Record<string, React.ElementType> = {
  par_length: MinMatchLength,
  limit_collection: StandinFilter,
  active_segment: StandinFilter,
  sort_method: StandinFilter,
  target_collection: StandinFilter,
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export function OptionsSidebar({ isOpen, drawerWidth }: Props) {
  const theme = useTheme();
  const [open, setOpen] = isOpen;

  const handleDrawerClose = () => {
    setOpen(false);
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
      open={open}
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
        <Typography
          sx={{ pt: 1, pl: 2 }}
          color="#888"
          variant="h6"
          component="h2"
        >
          FILTERS
        </Typography>
        <List>
          {VIEW_FILTERS["proto-filters"].pli.map((filterName) => {
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
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
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
