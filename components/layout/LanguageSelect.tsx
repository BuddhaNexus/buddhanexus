import React from "react";
import { useRouter } from "next/router";
import { Button, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const languageLabels = {
  EN: "🇬🇧  English",
  DE: "🇩🇪  Deutsch",
};

export default function LanguageSelect() {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSwitched = async (language: "de" | "en") => {
    handleClose();
    await router.push({ pathname, query }, asPath, { locale: language });
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
        {locale === "en" ? "🇬🇧" : "🇩🇪"}
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
        <MenuItem value="en" onClick={() => handleLanguageSwitched("en")}>
          {languageLabels.EN}
        </MenuItem>
        <MenuItem value="de" onClick={() => handleLanguageSwitched("de")}>
          {languageLabels.DE}
        </MenuItem>
      </Menu>
    </div>
  );
}
