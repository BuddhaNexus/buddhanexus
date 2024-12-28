import * as React from "react";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { useResultPageType } from "@components/hooks/useResultPageType";
import { Box, Stack, Typography } from "@mui/material";

import { DbFileButtons } from "./DbFileButtons";
import { QueryPageButtons } from "./QueryPageButtons";
import { SearchButtons } from "./SearchButtons";

export const QueryPageTopStack = ({
  matchCount = 0,
  title,
  subtitle,
}: {
  matchCount?: number;
  title: string;
  subtitle: string;
}) => {
  const { isSearchPage } = useResultPageType();

  return (
    <Stack
      direction={{ xs: "row", sm: "row-reverse" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Stack justifyContent="center" alignItems="flex-end" spacing={2}>
        <CurrentResultChips matches={matchCount} />
        <QueryPageButtons>
          {isSearchPage ? <SearchButtons /> : <DbFileButtons />}
        </QueryPageButtons>
      </Stack>

      <Box>
        <Typography
          variant="h2"
          component="h1"
          my={1}
          fontWeight={400}
          color="text.primary"
        >
          {title}
        </Typography>
        <Typography variant="h4" component="h4" mb={1}>
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
};
