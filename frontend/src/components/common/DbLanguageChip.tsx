import React, { useCallback } from "react";
import type { Theme } from "@mui/material";
import { Chip, useTheme } from "@mui/material";
import { DbLanguage } from "@utils/api/types";

const getLanguageColor = (language: DbLanguage, theme: Theme): string => {
  switch (language) {
    case "pa": {
      return theme.palette.common.pali;
    }
    case "bo": {
      return theme.palette.common.tibetan;
    }
    case "zh": {
      return theme.palette.common.chinese;
    }
    case "sa": {
      return theme.palette.common.sanskrit;
    }
    default: {
      return theme.palette.common.black;
    }
  }
};

export function DbLanguageChip({
  label,
  language,
}: {
  label: string;
  language: DbLanguage;
}) {
  const materialTheme = useTheme();

  const languageBadgeColor = useCallback(
    () => getLanguageColor(language, materialTheme),
    [language, materialTheme],
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
