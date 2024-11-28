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
      spacing={2}
    >
      <Box>{children}</Box>

      <Box>
        <CurrentResultChips matches={matches} />
      </Box>
    </Stack>
  );
};
