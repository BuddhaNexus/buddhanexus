import React from "react";
import { useTranslation } from "react-i18next";
import Brightness1Icon from "@mui/icons-material/Brightness4";
import Brightness2Icon from "@mui/icons-material/Brightness7";
import { IconButton } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export const ThemeToggleButton = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation("common");

  return (
    <IconButton
      color="inherit"
      aria-label={t("header.toggleTheme")}
      data-testid="theme-toggle"
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
    >
      {mode === "dark" ? (
        <Brightness1Icon fontSize="inherit" />
      ) : (
        <Brightness2Icon fontSize="inherit" />
      )}
    </IconButton>
  );
};
