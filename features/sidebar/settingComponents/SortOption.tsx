import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Box, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import {
  DEFAULT_QUERY_PARAMS,
  type QueryParams,
} from "features/sidebar/common/dbSidebarSettings";
import { StringParam, useQueryParam } from "use-query-params";

type SortParam = NonNullable<QueryParams["sort_method"]>;

type Option = {
  [K in SortParam]?: "sortLength" | "sortParallel" | "sortSource";
};
// TODO: add functionality - only basic reframing has been completed
const SORT_OPTIONS: Option[] = [
  { position: "sortSource" },
  { "quoted-text": "sortParallel" },
  { length2: "sortLength" },
];

export default function SortOption() {
  const { t } = useTranslation("settings");

  const [sortMethodParam, setSortMethodParam] = useQueryParam(
    "sort_method",
    StringParam
  );

  useEffect(() => {
    setSortMethodParam(sortMethodParam ?? DEFAULT_QUERY_PARAMS.sort_method);
  }, [sortMethodParam, setSortMethodParam]);

  const handleSelectChange = (value: SortParam) => {
    setSortMethodParam(value);
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
          value={sortMethodParam ?? "position"}
          onChange={(e) => handleSelectChange(e.target.value as SortParam)}
        >
          {SORT_OPTIONS.map((option) => {
            const [keyValue] = Object.entries(option);
            const [key, value] = keyValue;
            return (
              <MenuItem key={key} value={key}>
                {t(`optionsLabels.${value}`)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
