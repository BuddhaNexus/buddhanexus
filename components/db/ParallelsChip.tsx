import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";

export default function ParallelsChip() {
  const { t } = useTranslation("settings");

  const { fileName, queryParams } = useDbQueryParams();

  const { data, isLoading } = useQuery({
    // TODO: - see if the query can return result before main results
    queryKey: DbApi.ParallelCount.makeQueryKey({ fileName, queryParams }),
    queryFn: () =>
      DbApi.ParallelCount.call({
        fileName,
        queryParams,
      }),
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
  );
}
