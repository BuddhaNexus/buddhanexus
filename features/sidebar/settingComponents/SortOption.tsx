import { useEffect } from "react";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { FormControl, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
      <Typography id="input-slider" gutterBottom>
        Sort method
      </Typography>
      <FormControl sx={{ width: "100%" }}>
        <Select
          labelId="db-view-selector-label"
          id="db-view-selector"
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
