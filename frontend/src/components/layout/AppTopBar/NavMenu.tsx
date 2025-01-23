import React from "react";
import { useTranslation } from "next-i18next";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { DbLanguageMenu } from "./DbLanguageMenu";
import { NavLink } from "./NavLink";

const Desktop = () => {
  const { t } = useTranslation();

  return (
    <Box component="nav" sx={{ display: { xs: "none", sm: "flex" } }}>
      <DbLanguageMenu type="database" />
      <DbLanguageMenu type="visual" />
      <NavLink title={t("header.guide")} href="/guide" />
    </Box>
  );
};

const Loading = () => {
  return (
    <>
      <IconButton
        size="large"
        aria-label="navigation menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        sx={{ display: { sm: "none" } }}
        disabled
      >
        <MenuIcon />
      </IconButton>

      <Desktop />
    </>
  );
};

export const NavMenu = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!isMounted) {
    return <Loading />;
  }

  if (isSmUp) {
    return <Desktop />;
  }

  return (
    <Box component="nav">
      <IconButton
        size="large"
        aria-label="navigation menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={handleMenuOpen}
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
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        keepMounted
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
