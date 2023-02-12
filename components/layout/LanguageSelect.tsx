import React from "react";
import { useRouter } from "next/router";
import { IconButton, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import type { SupportedLocale } from "types/i18next";

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
  const locale = router.locale as SupportedLocale;

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
        aria-controls={isOpen ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        sx={{ fontSize: "1.5rem" }}
        onClick={handleClick}
      >
        {localeLabels[locale].flag}
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
