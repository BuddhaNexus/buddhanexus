import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Brightness1Icon from "@mui/icons-material/Brightness4";
import Brightness2Icon from "@mui/icons-material/Brightness7";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { IconButton } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export const ThemeToggleButton = () => {
  const { mode, setMode } = useColorScheme();
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <IconButton
      sx={{ mr: 1 }}
      color="inherit"
      aria-label={t("header.toggleTheme")}
      data-testid="theme-toggle"
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
    >
      {isMounted ? (
        mode === "dark" ? (
          <Brightness1Icon fontSize="inherit" />
        ) : (
          <Brightness2Icon fontSize="inherit" />
        )
      ) : (
        <HourglassEmptyIcon fontSize="inherit" />
      )}
    </IconButton>
  );
};
