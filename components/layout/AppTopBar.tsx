import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { Link } from "@components/common/Link";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import LanguageSelect from "@components/layout/LanguageSelect";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { IconButton, useTheme as useMaterialTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { isNavigationDrawerOpen } from "features/atoms/layout";
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
  const materialTheme = useMaterialTheme();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const { sourceLanguage } = useDbQueryParams();

  const { route } = useRouter();
  const { t } = useTranslation();
  const setIsDrawerOpen = useSetAtom(isNavigationDrawerOpen);

  const isHomeRoute = route === "/";
  const isATIIRoute = route.startsWith("/atii");
  const isSearchRoute = route.startsWith("/search");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ zIndex: materialTheme.zIndex.drawer + 1 }}
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
            href={isATIIRoute ? "/atii" : "/"}
            underline="none"
            noWrap
          >
            <>
              <Box
                component="img"
                src={
                  isATIIRoute
                    ? "/assets/images/atii_logo.png"
                    : "/assets/icons/bn_tree.svg"
                }
                width={isATIIRoute ? undefined : 64}
                sx={{
                  maxHeight: 48,
                  minWidth: 48,
                  pr: 2,
                  [materialTheme.breakpoints.down("sm")]: {
                    maxHeight: 36,
                  },
                }}
                alt="logo"
              />
              {!isHomeRoute && !isATIIRoute && (
                <Box
                  component="img"
                  src="/assets/icons/bn_name.svg"
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
            </>
          </Link>

          <Box
            sx={{
              display: {
                xs: "none",
                lg: "flex",
              },
            }}
          >
            {sourceLanguage && (
              <IconButton
                sx={{ ml: 2 }}
                color="inherit"
                onClick={() => setIsDrawerOpen((isOpen) => !isOpen)}
              >
                <ExploreOutlinedIcon sx={{ fontSize: 28 }} />
              </IconButton>
            )}
          </Box>
          {!isSearchRoute && <GlobalSearchDesktop />}
        </Box>

        <Box
          component="nav"
          sx={{
            display: "flex",
            overflow: "auto",
          }}
        >
          {isATIIRoute ? (
            <AppBarLink title="BuddhaNexus" href="/" />
          ) : (
            <>
              <DatabaseMenu />
              <AppBarLink title={t("header.support")} href="/support" />
              <AppBarLink title="ATII" href="/atii" />
            </>
          )}
        </Box>

        {isMounted ? (
          <IconButton
            sx={{ mx: 1 }}
            color="inherit"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? (
              <Brightness7Icon fontSize="inherit" />
            ) : (
              <Brightness4Icon fontSize="inherit" />
            )}
          </IconButton>
        ) : (
          // prevent layout jump
          <Box sx={{ width: 48 }} />
        )}

        <LanguageSelect />
      </Toolbar>

      {!isSearchRoute && (
        <Toolbar
          sx={(theme) => ({
            display: {
              lg: "none",
            },
            backgroundColor: theme?.palette.background.default,
            opacity: 0.96,
            borderBottom: `1px solid #c7c7c7`,
          })}
        >
          {sourceLanguage && (
            <IconButton
              sx={{ mr: 2 }}
              color="primary"
              onClick={() => setIsDrawerOpen((isOpen) => !isOpen)}
            >
              <ExploreOutlinedIcon fontSize="large" />
            </IconButton>
          )}
          <GlobalSearchMobile />
        </Toolbar>
      )}
    </AppBar>
  );
};
