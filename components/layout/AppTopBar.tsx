import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import LocaleSelector from "@components/layout/LocaleSelector";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import Brightness1Icon from "@mui/icons-material/Brightness4";
import Brightness2Icon from "@mui/icons-material/Brightness7";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { IconButton, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { isNavigationDrawerOpen } from "features/atoms";
import { GlobalSearchDesktop, GlobalSearchMobile } from "features/globalSearch";
import { useSetAtom } from "jotai";

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

export const AppTopBar = () => {
  const materialTheme = useTheme();

  const { mode, setMode } = useColorScheme();
  const { sourceLanguage } = useDbQueryParams();

  const { route } = useRouter();
  const { t } = useTranslation();
  const setIsDrawerOpen = useSetAtom(isNavigationDrawerOpen);

  const [isMounted, setIsMounted] = useState(false);

  const isHomeRoute = route === "/";
  const isSearchRoute = route.startsWith("/search");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
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
              flex: 1,
              grow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Link
              color="inherit"
              sx={{
                display: "inline-flex",
                alignItems: "center",
              }}
              href="/"
              underline="none"
              noWrap
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  [materialTheme.breakpoints.up("sm")]: {
                    pr: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src="/assets/logos/bn_tree_only.svg"
                  width={68}
                  sx={{
                    maxHeight: 48,
                    minWidth: 48,
                    [materialTheme.breakpoints.down("sm")]: {
                      maxHeight: 36,
                    },
                  }}
                  alt="logo"
                />
                {!isHomeRoute && (
                  <Box
                    component="img"
                    src="/assets/logos/bn_text_only.svg"
                    width={144}
                    sx={{
                      maxHeight: 24,
                      [materialTheme.breakpoints.down("sm")]: {
                        display: "none",
                      },
                    }}
                    alt="BuddhaNexus"
                  />
                )}
              </Box>
            </Link>

            {sourceLanguage && (
              <IconButton
                color="inherit"
                onClick={() => setIsDrawerOpen((isOpen) => !isOpen)}
              >
                <ExploreOutlinedIcon sx={{ fontSize: 28 }} />
              </IconButton>
            )}
            {!isSearchRoute && <GlobalSearchDesktop />}
          </Box>
          <Box
            component="nav"
            sx={{
              display: "flex",
              overflow: "auto",
            }}
          >
            <>
              <DatabaseMenu />
              <AppBarLink title={t("header.guide")} href="/guide" />
            </>
          </Box>
          <IconButton
            sx={{ mr: 1 }}
            color="inherit"
            // TODO i18n
            aria-label="Toggle theme"
            data-testid="theme-toggle"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            {isMounted ? (
              mode === "dark" ? (
                <Brightness1Icon fontSize="inherit" />
              ) : (
                <Brightness2Icon fontSize="inherit" />
              )
            ) : (
              <HourglassEmptyIcon fontSize="inherit" />
            )}
          </IconButton>
          <LocaleSelector />
        </Toolbar>
      </AppBar>
      {!isSearchRoute && (
        <aside id="mobile-search" aria-label={t("search.search")}>
          <GlobalSearchMobile />
        </aside>
      )}
    </>
  );
};
