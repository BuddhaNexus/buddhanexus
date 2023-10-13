import React from "react";
import { useRouter } from "next/router";
import LanguageIcon from "@mui/icons-material/Language";
import { IconButton, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import type { SupportedLocale } from "types/i18next";
// import CheckIcon from '@mui/icons-material/Check';

type LocaleLabels = {
  [key in SupportedLocale]: { flag: string; full: string };
};

const localeLabels: LocaleLabels = {
  en: { flag: "🇬🇧", full: "🇬🇧  English" },
  de: { flag: "🇩🇪", full: "🇩🇪  Deutsch" },
};

export default function LanguageSelect() {
  const router = useRouter();
  const { pathname, query, asPath } = router;
  // const locale = router.locale as SupportedLocale;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSwitched = async (locale: SupportedLocale) => {
    handleClose();
    await router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        color="inherit"
        aria-controls={isOpen ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        // sx={{ fontSize: "1.5rem" }}
        onClick={handleClick}
      >
        <LanguageIcon sx={{ fontSize: 24 }} color="inherit" />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={isOpen}
        variant="menu"
        MenuListProps={{
          "aria-labelledby": "language-button",
        }}
        onClose={handleClose}
      >
        {Object.keys(localeLabels).map((key) => {
          const locale = key as SupportedLocale;
          return (
            <MenuItem
              key={locale}
              value={locale}
              lang={locale}
              onClick={() => handleLanguageSwitched(locale)}
            >
              {localeLabels[locale].full}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
