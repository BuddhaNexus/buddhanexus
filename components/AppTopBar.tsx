import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
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

export const AppTopBar = () => (
  <AppBar
    position="static"
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
          sx={{ maxHeight: 48, pr: 2 }}
          alt="logo"
        />
        <Box
          component="img"
          src="/assets/icons/bn_name.svg"
          sx={{ maxHeight: 24 }}
          alt="BuddhaNexus"
        />
      </Link>
      <nav>
        <AppBarLink title="Support" href="/support" />
        <AppBarLink title="Database" href="/database" />
      </nav>
    </Toolbar>
  </AppBar>
);
