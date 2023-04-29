import { useEffect } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_QUERY_PARAMS } from "features/sidebar/common/dbSidebarSettings";
import { StringParam, useQueryParam } from "use-query-params";
import type { DatabaseFolio } from "utils/api/common";
import { DbApi } from "utils/api/dbApi";

const showAll = "Whole text";

// TODO: add handling for functionality change for different views (jump to / only show)
export default function FolioOption() {
  const { fileName } = useDbQueryParams();
  const { data, isLoading } = useQuery({
    queryKey: DbApi.FolioData.makeQueryKey(fileName),
    queryFn: () => DbApi.FolioData.call(fileName),
  });

  const [folioParam, setFolioParam] = useQueryParam("folio", StringParam);

  useEffect(() => {
    setFolioParam(folioParam ?? DEFAULT_QUERY_PARAMS.folio);
  }, [folioParam, setFolioParam]);

  const handleSelectChange = (value: string) => {
    setFolioParam(value === showAll ? null : value);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Box sx={{ width: 1, mb: 2 }}>
      {data && data.length > 1 ? (
        <>
          <FormLabel id="folio-option-selector-label">
            Show matches for text sub-section
          </FormLabel>
          <FormControl sx={{ width: 1 }}>
            <Select
              id="folio-option-selector"
              aria-labelledby="folio-option-selector-label"
              displayEmpty={true}
              value={folioParam ?? showAll}
              onChange={(e) => handleSelectChange(e.target.value)}
            >
              <MenuItem value={showAll}>
                <em>{showAll}</em>
              </MenuItem>
              {data.map((folio: DatabaseFolio) => {
                // TODO: confirm that 0 should always be skipped (as with pli)
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
