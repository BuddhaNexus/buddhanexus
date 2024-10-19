import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import ParallelsChip from "@components/db/ParallelsChip";
import SearchMatchesChip from "@components/db/SearchMatchesChip";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { allUIComponentParamNames } from "@features/sidebarSuite/uiSettingsDefinition";
import type {
  DefaultQueryParams,
  QueryParams,
  UIComponentParamName,
} from "@features/sidebarSuite/types";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";

type ParamValues = any;

const displayQueries: UIComponentParamName[] = ["folio", "sort_method"];
const excludedFromFilterCount: UIComponentParamName[] = [
  ...displayQueries,
  "search_string",
];

function getFilterCount(key: string) {
  return excludedFromFilterCount.some((item) => item === key) ? 0 : 1;
}
function getDisplayOptionCount(key: string) {
  return displayQueries.some((item) => item === key) ? 1 : 0;
}

function isDefaultValue({
  defaultQueries,
  queryKey,
  value,
}: {
  defaultQueries: DefaultQueryParams;
  queryKey: keyof typeof defaultQueries;
  value: ParamValues;
}) {
  // `defaultQueries` correspond to params that must be set for API calls. The `defaults` variable here defines the default settings used in API results, but aren't necessarily set on the FE (eg. `multi_lingual`)
  // TODO: handling here is being reviewed for refactoring and this may be removable.
  const defaults = {
    ...defaultQueries,
    [allUIComponentParamNames.sort_method]: "position",
    [allUIComponentParamNames.folio]: null,
  };
  return defaults[queryKey]?.toString() === value;
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
    if (isDefaultValue({ defaultQueries, queryKey, value })) {
      continue;
    }

    display += getDisplayOptionCount(key);
    filter += getFilterCount(key);
  }

  return { display, filter };
}
export default function CurrentResultChips({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  matches = 0,
}: {
  matches?: number;
}) {
  const router = useRouter();
  const { t } = useTranslation("settings");

  const isSearchRoute = router.route.startsWith("/search");
  const { fileName } = useDbRouterParams();
  const { data: multiLangParamData } = useQuery({
    queryKey: DbApi.AvailableLanguagesData.makeQueryKey(fileName),
    queryFn: () => DbApi.AvailableLanguagesData.call({ filename: fileName }),
  });

  const count = {
    display: 0,
    filter: 0,
  };

  // const count = getSettingCounts({
  //   isSearchRoute,
  //   currentQueries: queryParams,
  //   defaultQueries: {
  //     ...defaultQueryParams,
  //     [uallUIComponentParamNames.languages]: multiLangParamData,
  //   },
  // });

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
