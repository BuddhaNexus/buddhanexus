import React from "react";
import { useRouter } from "next/router";
import { Button, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { routes } from "routes-i18n";
import type { SupportedLocale } from "types/next-i18next";

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
    let path = routes[pathname]?.[locale];
    const slug = query.slug as string;

    if (slug) {
      path = slug && routes[`/${slug}`][locale];
    }

    await (path
      ? router.push({ pathname: path, query }, path, { locale })
      : router.push({ pathname, query }, asPath, { locale }));
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={isOpen ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        sx={{ fontSize: "1.5rem" }}
        onClick={handleClick}
      >
        {localeLabels[locale].flag}
      </Button>
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
