import React from "react";
import LocaleSelector from "@components/layout/LocaleSelector";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import LanguageIcon from "@mui/icons-material/Language";
import { Box, IconButton } from "@mui/material";

import { ThemeToggleButton } from "./ThemeToggleButton";

export const UtilityButtonsLoading = () => (
  <Box
    sx={{
      display: "flex",
      //   gap: 0.5,
      alignItems: "center",
      minWidth: "72px",
    }}
  >
    <IconButton disabled>
      <Brightness6Icon fontSize="inherit" />
    </IconButton>
    <IconButton sx={{ pr: 0 }} disabled>
      <LanguageIcon fontSize="inherit" />
    </IconButton>
  </Box>
);

export const UtilityButtons = () => (
  <>
    <ThemeToggleButton />
    <LocaleSelector />
  </>
);
