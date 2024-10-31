import React from "react";
import { useTranslation } from "next-i18next";
import { Box, Typography } from "@mui/material";
import { GRAPH_CONTAINER_MIN_HEIGHT } from "src/pages/db/[language]/[file]/graph";

export const DatasetWarning = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: GRAPH_CONTAINER_MIN_HEIGHT,
        py: 1,
        px: 2,
      }}
    >
      <Typography
        variant="h5"
        component="p"
        color="error.main"
        sx={{ transform: { md: "translateY(-25%)" } }}
      >
        {t("prompts.queryWarning")}
      </Typography>
    </Box>
  );
};
