import * as React from "react";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { useResultPageType } from "@components/hooks/useResultPageType";
import { Stack, Typography } from "@mui/material";
import { RESULT_PAGE_TITLE_GROUP_ID } from "@utils/constants";

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
  subtitle?: string;
}) => {
  const { isSearchPage } = useResultPageType();

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "left", md: "center" }}
      spacing={{ xs: 0, md: 2 }}
      pb={1}
    >
      <hgroup id={RESULT_PAGE_TITLE_GROUP_ID} style={{ maxWidth: "880px" }}>
        <Typography variant="h3" component="h1" mt={1} fontWeight={400}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            variant="subtitle2"
            component="p"
            mb={1}
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        ) : null}
      </hgroup>

      <Stack
        direction={{ xs: "row-reverse", md: "column" }}
        justifyContent={{ xs: "flex-end", sm: "space-between", md: "center" }}
        alignItems={{ xs: "center", md: "flex-end" }}
        spacing={{ xs: 0, md: 2 }}
      >
        <CurrentResultChips matches={matchCount} />
        <QueryPageButtons>
          {isSearchPage ? <SearchButtons /> : <DbFileButtons />}
        </QueryPageButtons>
      </Stack>
    </Stack>
  );
};
