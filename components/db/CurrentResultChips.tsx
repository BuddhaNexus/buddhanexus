import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/dbApi";

function getActiveFilterCount(queries: any) {
  let count = 0;

  Object.entries(queries).map(([key, value]) => {
    if (value === undefined || key === "co_occ" || key === "score") {
      return null;
    }
    if (key === "par_length" && value === 30) {
      return null;
    }
    if (Array.isArray(value) && value.length > 0) {
      count += value.length;
      return null;
    }

    count += 1;
    return null;
  });

  return count;
}

export default function CurrentResultChips() {
  const { fileName, queryParams, serializedParams } = useDbQueryParams();

  const filterCount = getActiveFilterCount(queryParams);

  const { data, isLoading } = useQuery({
    queryKey: [DbApi.ParallelCount.makeQueryKey(fileName), serializedParams],
    queryFn: () =>
      DbApi.ParallelCount.call({
        fileName,
        serializedParams,
      }),
    refetchOnWindowFocus: false,
  });

  return (
    <Box>
      <Chip
        size="small"
        label={
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>Parallels: </Box>
            <Box sx={{ minWidth: "2ch", ml: "3px", textAlign: "center" }}>
              {isLoading ? " " : data?.parallel_count}
            </Box>
          </Box>
        }
        sx={{ mx: 0.5, p: 0.5 }}
      />

      <Chip
        size="small"
        label={`Custom filters: ${filterCount}`}
        sx={{ mx: 0.5, p: 0.5 }}
      />
    </Box>
  );
}
