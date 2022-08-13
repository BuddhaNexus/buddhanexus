import React from "react";
import AppBar from "@mui/material/AppBar";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const AppBarLink = ({ title }: { title: string }) => (
  <Link
    variant="button"
    color="primary.contrastText"
    href="#"
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
      <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }} noWrap>
        BuddhaNexus
      </Typography>
      <nav>
        <AppBarLink title="Features" />
        <AppBarLink title="Support" />
        <AppBarLink title="Database" />
      </nav>
    </Toolbar>
  </AppBar>
);
