import React from "react";
import { useTranslation } from "next-i18next";
import { Box, CircularProgress } from "@mui/material";

export function CenteredProgress() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: "100%",
      }}
    >
      <CircularProgress color="inherit" aria-label={t("prompts.loading")} />
    </Box>
  );
}
