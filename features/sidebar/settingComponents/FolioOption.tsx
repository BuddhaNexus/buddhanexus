import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import type { DatabaseFolio } from "utils/api/common";
import { DbApi } from "utils/api/dbApi";
import { folioOptionValueAtom } from "utils/dbUISettings";

const showAll = "Whole text";

// TODO: add handling for functionality change for different views (jump to / only show)
export default function FolioOption() {
  const { fileName, setQueryParams } = useDbQueryParams();
  const [folioValue, setFolioValue] = useAtom(folioOptionValueAtom);

  const { data, isLoading } = useQuery({
    queryKey: DbApi.FolioData.makeQueryKey(fileName),
    queryFn: () => DbApi.FolioData.call(fileName),
  });

  const handleSelectChange = (value: string) => {
    setFolioValue(value);
    setQueryParams({ folio: value === showAll ? undefined : value });
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
              value={folioValue ?? showAll}
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
