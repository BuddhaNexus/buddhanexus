import { useEffect } from "react";
import type { DatabaseFolio } from "@components/db/types";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { FormControl, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "utils/api/db";

export default function FolioOption() {
  const { fileName, queryParams, setQueryParams } = useDbQueryParams();

  useEffect(() => {}, [queryParams]);

  const handleSelectChange = (value: string) => {
    setQueryParams({ folio: value || undefined });
  };

  const { data, isLoading } = useQuery({
    queryKey: DbApi.FolioData.makeQueryKey(fileName),
    queryFn: () => DbApi.FolioData.call(fileName),
  });

  if (isLoading) {
    return null;
  }

  return (
    <Box>
      {data && data.length > 1 ? (
        <>
          {/* TODO: determine if this is a filter */}
          <Typography id="input-slider" gutterBottom>
            Select text sub-section… am I a setting or a filter 🤔?
          </Typography>
          <FormControl sx={{ width: 272 }}>
            <Select
              labelId="db-view-selector-label"
              id="db-view-selector"
              value={queryParams.folio}
              onChange={(e) => handleSelectChange(e.target.value)}
            >
              <MenuItem sx={{ fontStyle: "italic" }} value="">
                Whole text
              </MenuItem>
              {data.map((folio: DatabaseFolio) => {
                if (folio.id === "0") {
                  return null;
                }

                return (
                  <MenuItem key={folio.id} value={folio.id}>
                    {folio.id}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </>
      ) : null}
    </Box>
  );
}
