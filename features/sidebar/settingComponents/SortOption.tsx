// import { useTranslation } from "react-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
// import { sortMethodOptionValueAtom } from "utils/dbSidebar";

interface SortOptionDef {
  value: string;
  labelKey: "sortLength" | "sortParallel" | "sortSource";
}

const SORT_OPTIONS: SortOptionDef[] = [
  { value: "position", labelKey: "sortSource" },
  { value: "quoted-text", labelKey: "sortParallel" },
  {
    value: "length2",
    labelKey: "sortLength",
  },
];

export default function SortOption() {
  const { queryParams } = useDbQueryParams();
  // const { t } = useTranslation("settings");

  /*  const handleSelectChange = (value: string) => {
   setQueryParams({ sort_method: value });
  }; */

  return (
    <Box sx={{ width: 1, mb: 2 }}>
      <FormLabel id="sort-option-selector-label">
        {/* {t("optionsLabels.sorting")} */}
        Sorting Method
      </FormLabel>
      <FormControl sx={{ width: 1 }}>
        <Select
          id="sort-option-selector"
          aria-labelledby="sort-option-selector-label"
          defaultValue="position"
          value={queryParams.sort_method ?? "position"}
          // onChange={(e) => handleSelectChange(e.target.value)}
        >
          {SORT_OPTIONS.map((method) => {
            return (
              <MenuItem key={method.value} value={method.value}>
                {/* {t(`optionsLabels.${method.labelKey}`)} */}
                {method.labelKey}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
