import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import MatchesChip from "@components/db/MatchesChip";
import ParallelsChip from "@components/db/ParallelsChip";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import {
  customFiltersChipQueryExclusions,
  customOptionsChipQueries,
} from "features/sidebarSuite/config";
import type {
  DefaultQueryParams,
  QueryParams,
} from "features/sidebarSuite/config/types";
import { DbApi } from "utils/api/dbApi";

function getFilterCount(key: string) {
  return customFiltersChipQueryExclusions.includes(key) ? 0 : 1;
}
function getDisplayOptionCount(key: string) {
  return customOptionsChipQueries.includes(key) ? 1 : 0;
}

function getSettingCounts({
  isSearchRoute,
  currentQueries,
  defaultQueries,
}: {
  isSearchRoute: boolean;
  currentQueries: Partial<QueryParams>;
  defaultQueries: DefaultQueryParams;
}) {
  let display = 0;
  let filter = 0;

  for (const [key, value] of Object.entries(currentQueries)) {
    const queryKey = key as keyof typeof defaultQueries;

    if (isSearchRoute) {
      filter += getFilterCount(key);
      continue;
    }

    // default params only apply to source text results pages
    // TODO: explore alternative default value match checking approach. Can the param just be removed from the query string?
    const defaultValue = defaultQueries[queryKey];

    // This handles params set by a controlled input selector that allow multiple selections (at the time of writing, `SourceLanguagesSelector`). The array value is stringified to enable comparison.
    const matchesDefaultValueOfArrayParam =
      Array.isArray(defaultValue) && [...defaultValue]?.join(",") === value;

    if (
      defaultValue === value ||
      matchesDefaultValueOfArrayParam ||
      value === "position" ||
      value === null
    ) {
      continue;
    }

    display += getDisplayOptionCount(key);
    filter += getFilterCount(key);
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
  const { fileName, queryParams, defaultQueryParams, uniqueSettings } =
    useDbQueryParams();
  const { data: multiLangParamData } = useQuery({
    queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
    queryFn: () => DbApi.AvailableLanguagesData.call(fileName),
  });

  const count = getSettingCounts({
    isSearchRoute,
    currentQueries: queryParams,
    defaultQueries: {
      ...defaultQueryParams,
      [uniqueSettings.remote.availableLanguages]: multiLangParamData,
    },
  });

  return (
    <>
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
    </>
  );
}
