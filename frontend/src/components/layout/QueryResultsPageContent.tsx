import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import { Main } from "@features/sidebarSuite/common/MuiStyledSidebarComponents";
import { SidebarSuite } from "@features/sidebarSuite/SidebarSuite";
import type { Breakpoint, SxProps } from "@mui/material";
import {
  Container,
  Typography,
  useTheme as useMaterialTheme,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

interface Props extends PropsWithChildren {
  maxWidth: Breakpoint | false;
  containerStyles: SxProps;
}
export const QueryResultsPageContent: FC<Props> = ({
  children,
  maxWidth,
  containerStyles,
}) => {
  const { t } = useTranslation();
  const { fileName } = useDbRouterParams();

  const lgWidth = useMaterialTheme().breakpoints.values.lg;

  const [isInitialized, setIsInitialized] = useState(false);
  const { isSettingsOpen, setIsSettingsOpen } = useSettingsDrawer();

  useEffect(() => {
    if (!isInitialized) {
      setIsSettingsOpen(window.innerWidth >= lgWidth);
      setIsInitialized(true);
    }
  }, [isInitialized, lgWidth, setIsSettingsOpen]);

  return (
    <>
      {isInitialized ? (
        <Main open={isSettingsOpen}>
          <Container maxWidth={maxWidth} sx={containerStyles}>
            {children}
          </Container>
          <SidebarSuite />
        </Main>
      ) : (
        <main style={{ height: "100%" }}>
          <Typography component="h1" sx={visuallyHidden}>
            {fileName ?? t("search.pageTitle")}
          </Typography>
        </main>
      )}
    </>
  );
};
