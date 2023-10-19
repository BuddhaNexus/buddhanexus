import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import MatchesChip from "@components/db/MatchesChip";
import ParallelsChip from "@components/db/ParallelsChip";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import {
  customFiltersChipQueryExclusions,
  customOptionsChipQueries,
} from "features/sidebarSuite/config";
import type {
  DefaultQueryParams,
  QueryParams,
} from "features/sidebarSuite/config/types";

function getSettingCounts({
  currentQueries,
  defaultQueries,
}: {
  currentQueries: Partial<QueryParams>;
  defaultQueries: DefaultQueryParams;
}) {
  let display = 0;
  let filter = 0;

  for (const [key, value] of Object.entries(currentQueries)) {
    const queryKey = key as keyof typeof defaultQueries;

    if (
      defaultQueries[queryKey] === value ||
      value === "position" ||
      value === null
    ) {
      continue;
    }

    if (customOptionsChipQueries.includes(key)) {
      display += 1;
      continue;
    }

    if (customFiltersChipQueryExclusions.includes(key)) {
      continue;
    }

    filter += 1;
  }

  if (!Object.keys(currentQueries).includes("multi_lingual")) {
    display += 1;
  }

  return { display, filter };
}

export default function CurrentResultChips({
  matches = 0,
}: {
  matches?: number;
}) {
  const router = useRouter();
  const { t } = useTranslation("settings");

  const isSearchRoute = router.route.startsWith("/search");
  const { queryParams, defaultQueryParams } = useDbQueryParams();

  // TODO: fix count return
  const count = getSettingCounts({
    currentQueries: queryParams,
    defaultQueries: defaultQueryParams,
  });

  return (
    <Box>
      {isSearchRoute ? <MatchesChip matches={matches} /> : <ParallelsChip />}

      {count.filter > 0 && (
        <Chip
          size="small"
          label={t("resultsHead.filters", { value: count.filter })}
          sx={{ mx: 0.5, p: 0.5 }}
        />
      )}
      {count.display > 0 && (
        <Chip
          size="small"
          label={t("resultsHead.options", { value: count.display })}
          sx={{ mx: 0.5, p: 0.5 }}
        />
      )}
    </Box>
  );
}
