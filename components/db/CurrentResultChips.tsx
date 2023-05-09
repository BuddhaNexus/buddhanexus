import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";

function getActiveFilterCount(queries: any, defaults: any) {
  let count = 0;

  for (const [key, value] of Object.entries(queries)) {
    const queryKey = key as keyof typeof defaults;

    if (queryKey === "par_length" && defaults.par_length === value) {
      continue;
    }

    if (defaults[queryKey] === value || value === undefined) {
      continue;
    }

    count += 1;
  }

  return count;
}

export default function CurrentResultChips() {
  const { t } = useTranslation("settings");
  const { query } = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { language, file, ...queryParams } = query;

  const { fileName, serializedParams, defaultQueryParams } = useDbQueryParams();

  const filtersCount = getActiveFilterCount(queryParams, defaultQueryParams);

  const { data, isLoading } = useQuery({
    queryKey: [DbApi.ParallelCount.makeQueryKey(fileName), serializedParams],
    queryFn: () =>
      DbApi.ParallelCount.call({
        fileName,
        serializedParams,
      }),
    // TODO: pass the same defaults to all instances of QueryClient
    refetchOnWindowFocus: false,
  });

  const [parallelCount, setParallelCount] = useState(
    isLoading ? 0 : data?.parallel_count
  );

  useEffect(() => {
    if (data) {
      setParallelCount(data.parallel_count);
    }
  }, [data]);

  return (
    <Box>
      <Chip
        size="small"
        label={
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>{t("resultsHead.parallels")}</Box>
            <Box sx={{ minWidth: "2ch", ml: "3px", textAlign: "center" }}>
              {parallelCount}
            </Box>
          </Box>
        }
        sx={{ mx: 0.5, p: 0.5 }}
      />

      <Chip
        size="small"
        label={t("resultsHead.filters", { value: filtersCount })}
        sx={{ mx: 0.5, p: 0.5 }}
      />
    </Box>
  );
}
