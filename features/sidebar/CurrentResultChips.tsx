import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import { pickBy } from "lodash";
import { DbApi } from "utils/api/db";

export default function CurrentResultChips() {
  const {
    fileName,
    queryParams,
    serializedParams: params,
  } = useDbQueryParams();
  const definedParams = Object.keys(
    pickBy(queryParams, (v) => v !== undefined)
  );

  // TODO: remove "-2" when legacy filters are removed
  const customFilters =
    queryParams.par_length === 30
      ? definedParams.length - 3
      : definedParams.length - 2;

  const { data, isLoading } = useQuery({
    queryKey: [DbApi.ParallelCount.makeQueryKey(fileName), { queryParams }],
    queryFn: () =>
      DbApi.ParallelCount.call({
        fileName,
        params,
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

      {customFilters ? (
        <Chip
          size="small"
          label={`Custom filters: ${customFilters}`}
          sx={{ mx: 0.5, p: 0.5 }}
        />
      ) : null}
    </Box>
  );
}
