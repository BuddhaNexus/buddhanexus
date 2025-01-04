import { useTranslation } from "next-i18next";
import { useDbQueryFilters } from "@components/hooks/groupedQueryParams";
import { useDbRouterParams } from "@components/hooks/useDbRouterParams";
import { Skeleton } from "@mui/material";
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

  const parallelCount = isLoading || !data ? 0 : data.parallel_count;

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
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: 0.25 }}
        >
          <Box>{t("resultsHead.matches")}</Box>
          {isLoading ? (
            <Skeleton sx={{ minWidth: "5ch" }} animation="wave" />
          ) : (
            <Box sx={{ minWidth: "5ch", textAlign: "center" }}>
              {parallelCount}
            </Box>
          )}
        </Box>
      }
      sx={{ mx: 0.5, p: 0.5 }}
    />
  );
}
