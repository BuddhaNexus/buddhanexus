import { useRouter } from "next/router";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  currentView: "graph" | "table";
}

export const DbViewSelector = ({ currentView }: Props) => {
  const { asPath, push } = useRouter();

  return (
    <FormControl variant="filled">
      <InputLabel id="db-view-selector-label">View</InputLabel>
      <Select
        labelId="db-view-selector-label"
        id="db-view-selector"
        value={currentView}
        onChange={(e) => push(asPath.replace(currentView, e.target.value))}
      >
        <MenuItem value="table">Table</MenuItem>
        <MenuItem value="graph">Graph</MenuItem>
      </Select>
    </FormControl>
  );
};
