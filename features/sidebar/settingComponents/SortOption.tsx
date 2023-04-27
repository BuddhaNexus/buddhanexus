import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { useAtom } from "jotai";
import {
  type QueryValues,
  sortMethodOptionValueAtom,
} from "utils/dbUISettings";

type SortValue = QueryValues["sort_method"];

interface SortOptionDef {
  value: SortValue;
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
  const { setQueryParams } = useDbQueryParams();
  const [sortValue, setSortValue] = useAtom(sortMethodOptionValueAtom);
  const { t } = useTranslation("settings");

  const handleSelectChange = (value: SortValue) => {
    setSortValue(value);
    setQueryParams({ sort_method: value });
  };

  return (
    <Box sx={{ width: 1, mb: 2 }}>
      <FormLabel id="sort-option-selector-label">
        {t("optionsLabels.sorting")}
      </FormLabel>
      <FormControl sx={{ width: 1 }}>
        <Select
          id="sort-option-selector"
          aria-labelledby="sort-option-selector-label"
          defaultValue="position"
          value={sortValue ?? "position"}
          onChange={(e) => handleSelectChange(e.target.value as SortValue)}
        >
          {SORT_OPTIONS.map((method) => {
            return (
              <MenuItem key={method.value} value={method.value}>
                {t(`optionsLabels.${method.labelKey}`)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
