import { useRef } from "react";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { Box, FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import type { QueryParams } from "features/sidebarSuite/common/dbSidebarSettings";
import { StringParam, useQueryParam } from "use-query-params";

const defaultValue = "default";

type SortParam = NonNullable<QueryParams["sort_method"]> | "default";

type Option = {
  [K in SortParam]?: "sortLength" | "sortParallel" | "sortSource";
};

const SORT_OPTIONS: Option[] = [
  { position: "sortSource" },
  { "quoted-text": "sortParallel" },
  { length2: "sortLength" },
];

export default function SortOption() {
  const { t } = useTranslation("settings");
  const hasSelected = useRef(false);

  const { settingEnums } = useDbQueryParams();

  const [sortMethodParam, setSortMethodParam] = useQueryParam(
    settingEnums.QueriedDisplayOptionEnum.SORT_METHOD,
    StringParam
  );

  const handleSelectChange = (value: SortParam) => {
    hasSelected.current = true;
    setSortMethodParam(value === defaultValue ? "position" : value);
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
          value={sortMethodParam ?? defaultValue}
          onChange={(e) => handleSelectChange(e.target.value as SortParam)}
        >
          {!hasSelected.current && (
            <MenuItem value={defaultValue}>
              <em>{t("optionsLabels.sortDefault")}</em>
            </MenuItem>
          )}
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
