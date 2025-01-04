import { OPEN_SETTINGS_CALC } from "@components/hooks/useSettingsDrawer";
import { Box, Link, Popper as MuiPopper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  paddingTop: 0,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: `${open ? OPEN_SETTINGS_CALC : "100%"}`,
    transform: "none",
  },
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export const Popper = styled(MuiPopper)(({ theme }) => ({
  zIndex: theme.zIndex.tooltip,
  height: "32px",
}));

export const PopperMsgBox = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.inverted,
  color: theme.palette.text.inverted,
}));

export const ExternalSourceLink = styled(Link)(() => ({
  "&:hover": {
    filter: "brightness(80%)",
  },
  textDecoration: "none",
  height: "32px",
}));
