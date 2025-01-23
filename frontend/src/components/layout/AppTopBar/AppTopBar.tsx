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

import { DbLanguageMenu } from "./DbLanguageMenu";
import { LogoLink } from "./LogoLink";
import { NavLink } from "./NavLink";
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
      <Toolbar>
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

        <Box
          component="nav"
          sx={{
            display: "flex",
            overflow: "auto",
          }}
        >
          <DbLanguageMenu type="database" />
          <DbLanguageMenu type="visual" />
          <NavLink title={t("header.guide")} href="/guide" />
        </Box>

        <ThemeToggleButton />
        <LocaleSelector />
      </Toolbar>
    </AppBar>
  );
});
