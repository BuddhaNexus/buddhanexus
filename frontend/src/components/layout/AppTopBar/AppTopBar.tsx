import React, { memo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import { useResultPageType } from "@components/hooks/useResultPageType";
import LocaleSelector from "@components/layout/LocaleSelector";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import { GlobalSearch } from "@features/globalSearch";
import { IconButton, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { LogoLink } from "./LogoLink";
import { ThemeToggleButton } from "./ThemeToggleButton";

interface AppBarLinkProps {
  title: string;
  href: string;
}

const AppBarLink = ({ title, href }: AppBarLinkProps) => (
  <Link
    variant="button"
    color="primary.contrastText"
    href={href}
    underline="hover"
    sx={{ my: 1, mx: 1.5 }}
  >
    {title}
  </Link>
);

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
          <DatabaseMenu />
          <AppBarLink title={t("header.guide")} href="/guide" />
        </Box>

        <ThemeToggleButton />
        <LocaleSelector />
      </Toolbar>
    </AppBar>
  );
});
