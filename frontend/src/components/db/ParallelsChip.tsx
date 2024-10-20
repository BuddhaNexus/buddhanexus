import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryFilters } from "@components/hooks/commonQueryParams";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import { BD_RESULTS_LIMIT } from "@utils/api/constants";
import { DbApi } from "@utils/api/dbApi";

import CappedMatchesChip from "./CappedMatchesChip";

export default function ParallelsChip() {
  const { t } = useTranslation("settings");

  const { fileName } = useDbRouterParams();
  const filters = useDbQueryFilters();

  const { data, isLoading } = useQuery({
    queryKey: DbApi.ParallelCount.makeQueryKey({
      filename: fileName,
      filters,
    }),
    queryFn: () =>
      DbApi.ParallelCount.call({
        filename: fileName,
        filters,
      }),
  });

  const [parallelCount, setParallelCount] = useState(
    isLoading ? 0 : data?.parallel_count,
  );

  useEffect(() => {
    if (data) {
      setParallelCount(data.parallel_count);
    }
  }, [data]);

  const isMatchesCapped = parallelCount && parallelCount >= BD_RESULTS_LIMIT;

  if (isMatchesCapped) {
    return (
      <CappedMatchesChip
        label={t("resultsHead.matches")}
        message={t("resultsHead.cappedMessage", {
          max: BD_RESULTS_LIMIT,
        })}
        matches={parallelCount}
      />
    );
  }

  return (
    <Chip
      size="small"
      label={
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>{t("resultsHead.matches")}</Box>
          <Box sx={{ minWidth: "2ch", ml: "3px", textAlign: "center" }}>
            {parallelCount}
          </Box>
        </Box>
      }
      sx={{ mx: 0.5, p: 0.5 }}
    />
  );
}
