import React from "react";
import { Box, CircularProgress } from "@mui/material";

export function CenteredProgress() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
}
