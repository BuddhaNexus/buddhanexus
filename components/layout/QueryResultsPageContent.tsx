import { type FC, type PropsWithChildren, useEffect, useRef } from "react";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import type { SxProps } from "@mui/material";
import { Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { Breakpoint } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import { Main } from "features/sidebarSuite/common/MuiStyledSidebarComponents";
import { SidebarSuite } from "features/sidebarSuite/SidebarSuite";

interface Props extends PropsWithChildren {
  maxWidth: Breakpoint;
  containerStyles: SxProps;
}
export const QueryResultsPageContent: FC<Props> = ({
  children,
  maxWidth,
  containerStyles,
}) => {
  const isInitialized = useRef(false);
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"), {
    noSsr: true,
  });

  const { isSettingsOpen, setIsSettingsOpen } = useSettingsDrawer();

  useEffect(() => {
    if (!isInitialized.current) {
      setIsSettingsOpen(isLg);
      isInitialized.current = true;
    }
  }, [setIsSettingsOpen, isLg]);

  return (
    <>
      {isInitialized.current ? (
        <Main open={isSettingsOpen}>
          <Container maxWidth={maxWidth} sx={containerStyles}>
            {children}
          </Container>
          <SidebarSuite />
        </Main>
      ) : (
        <main style={{ height: "100%" }}>
          <Typography component="h1" sx={visuallyHidden}>
            Loading...
          </Typography>
        </main>
      )}
    </>
  );
};
