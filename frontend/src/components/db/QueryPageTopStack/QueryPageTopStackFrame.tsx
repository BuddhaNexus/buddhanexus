import * as React from "react";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { Box, Stack } from "@mui/material";

export const QueryPageTopStackFrame = ({
  children,
  matches = 0,
}: {
  children: React.ReactNode;
  matches?: number;
}) => {
  return (
    <Stack
      direction={{ xs: "row", lg: "row-reverse" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ pt: 2, pb: 3 }}
    >
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}
      >
        {children}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <CurrentResultChips matches={matches} />
      </Box>
    </Stack>
  );
};
