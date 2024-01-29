import React from "react";
import { useRouter } from "next/router";
import CheckIcon from "@mui/icons-material/Check";
import LanguageIcon from "@mui/icons-material/Language";
import { Button, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import type { SupportedLocale } from "types/i18next";
import { SUPPORTED_LOCALES } from "utils/constants";

export default function LocaleSelector() {
  const router = useRouter();
  const { pathname, query, asPath, locale } = router;
  const currentLocale = locale as SupportedLocale;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (newLocale: SupportedLocale) => {
    handleClose();
    await router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div>
      <Button
        id="basic-button"
        variant="text"
        color="inherit"
        aria-controls={isOpen ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        onClick={handleClick}
      >
        <LanguageIcon sx={{ fontSize: 24, mr: 1 }} color="inherit" />
        {SUPPORTED_LOCALES[currentLocale]}
      </Button>
      <Menu
        id="language-menu"
        role="navigation"
        anchorEl={anchorEl}
        open={isOpen}
        variant="menu"
        sx={{
          mt: 1,
        }}
        MenuListProps={{
          "aria-labelledby": "language-button",
        }}
        onClose={handleClose}
      >
        {Object.entries(SUPPORTED_LOCALES).map(([localeCode, localeName]) => {
          return (
            <MenuItem
              key={localeCode}
              value={localeCode}
              lang={localeCode}
              onClick={() =>
                handleLanguageChange(localeCode as SupportedLocale)
              }
            >
              {localeName}
              {currentLocale === localeCode && (
                <CheckIcon sx={{ ml: 2 }} color="primary" />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
