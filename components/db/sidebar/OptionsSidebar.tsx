import { VIEW_FILTERS } from "@components/db/sidebar/filterContexts";
import {
  MinMatchLengthFilter as MinMatchLength,
  SectionSelectFilter as SectionSelect,
} from "@components/db/sidebar/filters";
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
  state: [boolean, (value: boolean | ((prevVar: boolean) => boolean)) => void];
}

const FilterComponents: Record<string, React.ElementType> = {
  MinMatchLength,
  SectionSelect,
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export function OptionsSidebar({ state, drawerWidth }: Props) {
  const theme = useTheme();
  const [open, setOpen] = state;

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
              throw new Error(`Can't find filter ${filterName}`);
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
