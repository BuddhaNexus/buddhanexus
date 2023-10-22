import React, { useCallback } from "react";
import type { Theme } from "@mui/material";
import { Chip, useTheme } from "@mui/material";
import { SourceLanguage } from "utils/constants";

const getLanguageColor = (language: SourceLanguage, theme: Theme): string => {
  switch (language) {
    case SourceLanguage.PALI: {
      return theme.palette.common.pali;
    }
    case SourceLanguage.TIBETAN: {
      return theme.palette.common.tibetan;
    }
    case SourceLanguage.CHINESE: {
      return theme.palette.common.chinese;
    }
    case SourceLanguage.SANSKRIT: {
      return theme.palette.common.sanskrit;
    }
    default: {
      return theme.palette.common.black;
    }
  }
};

export function SourceLanguageChip({
  label,
  language,
}: {
  label: string;
  language: SourceLanguage;
}) {
  const theme = useTheme();

  const languageBadgeColor = useCallback(
    () => getLanguageColor(language, theme),
    [language, theme],
  );

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        m: 0.5,
        p: 0.5,
        color: "white",
        fontWeight: 700,
        backgroundColor: languageBadgeColor,
        width: "fit-content",
      }}
    />
  );
}
