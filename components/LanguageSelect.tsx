import React from "react";
import { useRouter } from "next/router";
import { Button, Menu } from "@mui/material";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

const languageLabels = {
  EN: "🇬🇧 English",
  DE: "🇩🇪 Deutsch",
};

export default function LanguageSelect() {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSwitched = async (language: "en" | "de") => {
    handleClose();
    await router.push({ pathname, query }, asPath, { locale: language });
  };

  return (
    <Box sx={{ mx: 1 }}>
      <Button
        id="basic-button"
        aria-controls={isOpen ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        onClick={handleClick}
      >
        {locale === "en" ? languageLabels.EN : languageLabels.DE}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={isOpen}
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
    </Box>
  );
}
