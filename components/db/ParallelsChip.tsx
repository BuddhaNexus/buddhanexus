import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import { PARALLELS_RESULTS_LIMIT } from "utils/api/constants";
import { DbApi } from "utils/api/dbApi";

import CappedMatchesChip from "./CappedMatchesChip";

export default function ParallelsChip() {
  const { t } = useTranslation("settings");

  const { fileName, queryParams } = useDbQueryParams();

  // ignore some params that shouldn't result in refetching this query
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedSegment, ...restOfQueryParams } = queryParams;

  const { data, isLoading } = useQuery({
    // TODO: - see if the query can return result before main results
    queryKey: DbApi.ParallelCount.makeQueryKey({
      fileName,
      queryParams: restOfQueryParams,
    }),
    queryFn: () =>
      DbApi.ParallelCount.call({
        fileName,
        queryParams,
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

  const isMatchesCapped =
    parallelCount && parallelCount >= PARALLELS_RESULTS_LIMIT;

  return (
    <>
      {isMatchesCapped ? (
        // TODO: i18n
        <CappedMatchesChip
          label={t("resultsHead.matches")}
          message={`More than ${parallelCount} matches found. Results limited to maximum ${PARALLELS_RESULTS_LIMIT} matches.`}
          matches={parallelCount}
        />
      ) : (
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
      )}
    </>
  );
}
