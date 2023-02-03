import type { FC, PropsWithChildren } from "react";
import { OptionsSidebar } from "@components/db/sidebar/OptionsSidebar";
import { AppTopBar } from "@components/layout/AppTopBar";
import { Box, Container } from "@mui/material";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import type { Breakpoint } from "@mui/system";
import bgChn from "@public/assets/images/bg_chn_upscaled_bw.jpg";
import bgPli from "@public/assets/images/bg_pli_upscaled_bw.jpg";
import bgSkt from "@public/assets/images/bg_skt_upscaled_bw.jpg";
import bgTib from "@public/assets/images/bg_tib_upscaled_bw.jpg";
import bgWelcome from "@public/assets/images/bg_welcome_upscaled_bw.jpg";
import type { Property } from "csstype";
import { SourceLanguage } from "utils/constants";

const BgImageSrcs: Record<BackgroundName, string> = {
  [SourceLanguage.TIBETAN]: bgTib.src,
  [SourceLanguage.CHINESE]: bgChn.src,
  [SourceLanguage.SANSKRIT]: bgSkt.src,
  [SourceLanguage.PALI]: bgPli.src,
  welcome: bgWelcome.src,
};

const BgImageBgSize: Record<BackgroundName, Property.BackgroundSize> = {
  [SourceLanguage.TIBETAN]: "contain",
  [SourceLanguage.CHINESE]: "contain",
  [SourceLanguage.SANSKRIT]: "contain",
  [SourceLanguage.PALI]: "contain",
  welcome: "cover",
};

type BackgroundName = SourceLanguage | "welcome";

interface Props extends PropsWithChildren {
  backgroundName?: BackgroundName;
  maxWidth?: Breakpoint;
  state: [boolean, (value: boolean | ((prevVar: boolean) => boolean)) => void];
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 360;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  // maxWidth: "100%",
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export const PageContainerWithSidebar: FC<Props> = ({
  children,
  backgroundName,
  maxWidth = "md",
  state,
}) => {
  const [open, setOpen] = state;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <AppTopBar />
      </AppBar>
      {backgroundName && (
        <Container
          maxWidth={false}
          sx={{
            background: `url(${BgImageSrcs[backgroundName]})`,
            backgroundSize: BgImageBgSize[backgroundName],
            opacity: 0.07,
            height: "100%",
            width: "100%",
            position: "fixed",
            zIndex: -1,
          }}
        />
      )}
      <Main open={open}>
        <DrawerHeader />
        <Container
          maxWidth={maxWidth}
          sx={{ pt: 8, flex: 1, display: "flex", flexDirection: "column" }}
        >
          {children}
        </Container>
      </Main>
      <OptionsSidebar state={[open, setOpen]} drawerWidth={drawerWidth} />
    </Box>
  );
};
