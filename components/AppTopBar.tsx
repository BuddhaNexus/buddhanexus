import React from "react";
import { useTranslation } from "next-i18next";
import AppBar from "@mui/material/AppBar";
import Link from "@mui/material/Link";
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
  const { t } = useTranslation();

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.divider}` })}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Link
          variant="h6"
          color="inherit"
          sx={{ flexGrow: 1 }}
          href="/"
          underline="none"
          noWrap
        >
          {t("global.siteTitle")}
        </Link>
        <nav>
          <AppBarLink title="Support" href="/support" />
          <AppBarLink title="Database" href="/database" />
        </nav>
      </Toolbar>
    </AppBar>
  );
};
