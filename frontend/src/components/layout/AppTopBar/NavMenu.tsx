import React from "react";
import { useTranslation } from "next-i18next";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

import { DbLanguageMenu } from "./DbLanguageMenu";
import { NavLink } from "./NavLink";

export const NavMenu = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (isSmUp) {
    return (
      <Box component="nav" sx={{ display: "flex" }}>
        <DbLanguageMenu type="database" />
        <DbLanguageMenu type="visual" />
        <NavLink title={t("header.guide")} href="/guide" />
      </Box>
    );
  }

  return (
    <Box component="nav">
      <IconButton
        size="large"
        aria-label="navigation menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <DbLanguageMenu type="database" isMobile />
        </MenuItem>
        <MenuItem>
          <DbLanguageMenu type="visual" isMobile />
        </MenuItem>
        <MenuItem>
          <NavLink title={t("header.guide")} href="/guide" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
