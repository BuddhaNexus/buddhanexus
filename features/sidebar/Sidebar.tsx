import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import {
  FolioOption,
  InclusionExclusionFilters,
  MinMatchLengthFilter,
  SortOption,
} from "features/sidebar/settingComponents";
import type { DisplayQuery, FilterQuery } from "utils/api/queries";
import { displayOptions, filters, queryDefaults } from "utils/api/queries";

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
  const { setQueryParams } = useDbQueryParams();

  const [sidebarIsOpen, setSidebarIsOpen] = isOpen;

  const handleDrawerClose = () => {
    setSidebarIsOpen(false);
  };

  const handleQueryReset = () => {
    setQueryParams(queryDefaults);
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
        {displayOptions["proto-filters"].length > 0 ? (
          <>
            <Divider />
            <Typography
              sx={{ pt: 2, pl: 2 }}
              color="#888"
              variant="h6"
              component="h2"
            >
              OPTIONS
            </Typography>
            <List>
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
            </List>
          </>
        ) : null}
      </aside>
    </Drawer>
  );
}
