import React from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import ParallelsChip from "@components/db/ParallelsChip";
import SearchMatchesChip from "@components/db/SearchMatchesChip";
import {
  ResultPageType,
  useResultPageType,
} from "@components/hooks/useResultPageType";
import {
  DBSourceFilePageFilterUISettingName,
  DisplayUISettingName,
  SearchPageFilterUISettingName,
} from "@features/SidebarSuite/types";
import {
  dbSourceFileRequestFilters,
  displayUISettings,
  searchRequestFilters,
} from "@features/SidebarSuite/uiSettings/config";
import Chip from "@mui/material/Chip";

const searchFilterSet = new Set(searchRequestFilters);
const dbSourceFileFilterSet = new Set(dbSourceFileRequestFilters);
const displayUISettingsSet = new Set(displayUISettings);

function getSettingCounts({
  resultPageType,
  searchParams,
}: {
  resultPageType: ResultPageType;
  searchParams: ReadonlyURLSearchParams;
}) {
  let display = 0;
  let filter = 0;
  let isExcludeSet = false;
  let isIncludeSet = false;

  const params = Object.fromEntries(searchParams.entries());

  for (const key of Object.keys(params)) {
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
      resultPageType === "search" &&
      searchFilterSet.has(key as SearchPageFilterUISettingName)
    ) {
      filter += 1;
      continue;
    }

    if (
      resultPageType === "dbFile" &&
      displayUISettingsSet.has(key as DisplayUISettingName)
    ) {
      display += 1;
      continue;
    }

    if (
      resultPageType === "dbFile" &&
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
  const { t } = useTranslation("settings");

  const { isSearchPage, resultPageType } = useResultPageType();

  const searchParams = useSearchParams();

  const count = React.useMemo(
    () =>
      getSettingCounts({
        resultPageType,
        searchParams,
      }),
    [searchParams, resultPageType],
  );

  return (
    <>
      {isSearchPage ? (
        <SearchMatchesChip matches={matches} isSearchPage />
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
