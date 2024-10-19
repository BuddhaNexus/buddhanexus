import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import ParallelsChip from "@components/db/ParallelsChip";
import SearchMatchesChip from "@components/db/SearchMatchesChip";
import {
  dbSoureFileRequestFilters,
  searchRequestFilters,
  displayUISettings,
} from "@features/sidebarSuite/uiSettingsDefinition";
import {
  SearchPageFilterUISettingName,
  DBSourceFilePageFilterUISettingName,
  DisplayUISettingName,
} from "@features/sidebarSuite/types";
import Chip from "@mui/material/Chip";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

const searchFilterSet = new Set(searchRequestFilters);
const dbSourceFileFilterSet = new Set(dbSoureFileRequestFilters);
const displayParamSet = new Set(displayUISettings);

function getSettingCounts({
  route,
  searchParams,
}: {
  route: "search" | "dbSourcePage";
  searchParams: ReadonlyURLSearchParams;
}) {
  let display = 0;
  let filter = 0;
  let isExcludeSet = false;
  let isIncludeSet = false;

  for (const key of Object.keys(searchParams)) {
    if (key.startsWith("exclude_") && !isExcludeSet) {
      filter += 1;
      isExcludeSet = true;
      continue;
    }

    if (key.startsWith("include_") && !isIncludeSet) {
      filter += 1;
      isIncludeSet = true;
      continue;
    }

    if (
      route === "search" &&
      searchFilterSet.has(key as SearchPageFilterUISettingName)
    ) {
      filter += 1;
      continue;
    }

    if (route === "dbSourcePage" && displayParamSet.has(key as DisplayUISettingName)) {
      display += 1;
      continue;
    }

    if (
      route === "dbSourcePage" &&
      dbSourceFileFilterSet.has(key as DBSourceFilePageFilterUISettingName)
    ) {
      filter += 1;
    }
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
  const searchParams = useSearchParams();

  const count = getSettingCounts({
    route: isSearchRoute ? "search" : "dbSourcePage",
    searchParams,
  });

  return (
    <>
      {isSearchRoute ? (
        <SearchMatchesChip matches={matches} isSearchRoute />
      ) : (
        <ParallelsChip />
      )}

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
