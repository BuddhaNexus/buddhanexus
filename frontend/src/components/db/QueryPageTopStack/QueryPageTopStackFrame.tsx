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
      direction={{ xs: "row", sm: "row-reverse" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ pt: 2, pb: 3 }}
    >
      <Box>{children}</Box>

      <Box>
        <CurrentResultChips matches={matches} />
      </Box>
    </Stack>
  );
};
