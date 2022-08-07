import React from "react";
import AppBar from "@mui/material/AppBar";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export const AppTopBar = () => (
  <AppBar
    position="static"
    color="default"
    elevation={0}
    sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.divider}` })}
  >
    <Toolbar sx={{ flexWrap: "wrap" }}>
      <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }} noWrap>
        BuddhaNexus
      </Typography>
      <nav>
        <Link
          variant="button"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          Features
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          Enterprise
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          Support
        </Link>
      </nav>
    </Toolbar>
  </AppBar>
);
