import React from "react";
import { useTranslation } from "next-i18next";
import LanguageSelect from "@components/LanguageSelect";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconButton, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import { ColorModeContext } from "utils/colorModeContext";

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
  const theme = useTheme();
  const { t } = useTranslation();

  const colorMode = React.useContext(ColorModeContext);

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={0}
      sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.divider}` })}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Link
          color="inherit"
          sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          href="/"
          underline="none"
          noWrap
        >
          <Box
            component="img"
            src="/assets/icons/bn_tree.svg"
            sx={{
              maxHeight: 48,
              pr: 2,
              [theme.breakpoints.down("sm")]: {
                maxHeight: 36,
              },
            }}
            alt="logo"
          />
          <Box
            component="img"
            src="/assets/icons/bn_name.svg"
            sx={{
              maxHeight: 24,
              [theme.breakpoints.down("sm")]: {
                display: "none",
              },
            }}
            alt="BuddhaNexus"
          />
        </Link>

        <nav>
          <AppBarLink title={t("header.support")} href="/support" />
          <AppBarLink title={t("header.database")} href="/database" />
        </nav>

        <IconButton
          sx={{ ml: 1 }}
          color="inherit"
          onClick={colorMode.toggleColorMode}
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
        <LanguageSelect />
      </Toolbar>
    </AppBar>
  );
};
