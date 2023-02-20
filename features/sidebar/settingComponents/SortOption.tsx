import { useEffect } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormControl, FormLabel, MenuItem, Select } from "@mui/material";

const SORT_OPTIONS = [
  { value: "position", label: "Match position in source text" },
  { value: "quoted-text", label: "Match position in parallel texts" },
  {
    value: "length2",
    label: "Length of character match (>)",
  },
];

export default function SortOption() {
  const { queryParams, setQueryParams } = useDbQueryParams();

  useEffect(() => {}, [queryParams]);

  const handleSelectChange = (value: string) => {
    setQueryParams({ sort_method: value });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <FormLabel id="sort-option-selector-label">Sort Method</FormLabel>
      <FormControl sx={{ width: "100%" }}>
        <Select
          id="sort-option-selector"
          aria-labelledby="sort-option-selector-label"
          defaultValue="position"
          value={queryParams.sort_method ?? "position"}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          {SORT_OPTIONS.map((method) => {
            return (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
