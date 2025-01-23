import React, { memo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useResultPageType } from "@components/hooks/useResultPageType";
import LocaleSelector from "@components/layout/LocaleSelector";
import { GlobalSearch } from "@features/globalSearch";
import { useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import { LogoLink } from "./LogoLink";
import { NavMenu } from "./NavMenu";
import { ThemeToggleButton } from "./ThemeToggleButton";

export const AppTopBar = memo(function AppTopBar() {
  const materialTheme = useTheme();
  const { route } = useRouter();
  const { t } = useTranslation();
  const isHomeRoute = route === "/";
  const { isSearchPage } = useResultPageType();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: materialTheme.zIndex.drawer + 1,
        borderBottom: `1px solid ${materialTheme.palette.background.accent}`,
      }}
      data-testid="app-bar"
    >
      <Toolbar sx={{ mx: 2 }} disableGutters>
        <Box
          sx={{
            display: "flex",
            // gives space for open search bar
            flex: 1,
            grow: 1,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <LogoLink showText={!isHomeRoute} />

          {!isSearchPage && <GlobalSearch />}
        </Box>

        <NavMenu />

        <ThemeToggleButton />
        <LocaleSelector />
      </Toolbar>
    </AppBar>
  );
});
