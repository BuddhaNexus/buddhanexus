import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { Link } from "@components/common/Link";
import LanguageSelect from "@components/layout/LanguageSelect";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconButton, useTheme as useMaterialTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

interface AppBarLinkProps {
  title: string;
  href?: string;
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

  const { route } = useRouter();
  const { t } = useTranslation();

  const isHomeRoute = route === "/";
  const isATIIRoute = route.startsWith("/atii");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.common.pali}`,
      })}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Link
          color="inherit"
          sx={{
            marginRight: "auto",
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

        <Box component="nav" sx={{ display: "flex" }}>
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
            sx={{ ml: 1 }}
            color="inherit"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        ) : (
          // prevent layout jump
          <Box sx={{ width: 48 }} />
        )}

        <LanguageSelect />
      </Toolbar>
    </AppBar>
  );
};
