import { useTranslation } from "next-i18next";
import { getValidSortMethod } from "@utils/validators";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { sortMethods } from "@features/sidebarSuite/uiSettingsDefinition";

import { useSortMethodParam } from "@components/hooks/params";
import React from "react";

export default function SortOption() {
  const { t } = useTranslation("settings");

  const [sortMethod, setSortMethod] = useSortMethodParam();

  const handleSelectChange = React.useCallback(
    (event: SelectChangeEvent) => {
      setSortMethod(getValidSortMethod(event.target.value));
    },
    [setSortMethod]
  );

  return (
    <Box sx={{ width: 1, my: 3 }}>
      <FormControl sx={{ width: 1 }}>
        <InputLabel id="sort-option-selector-label">
          {t("optionsLabels.sort.selector")}
        </InputLabel>
        <Select
          value={sortMethod}
          labelId="sort-option-selector-label"
          inputProps={{
            id: "sort-option-selector",
          }}
          input={<OutlinedInput label={t("optionsLabels.sort.selector")} />}
          onChange={handleSelectChange}
        >
          {sortMethods.map((option) => {
            return (
              <MenuItem key={option} value={option}>
                {t(`optionsLabels.sort.${option}`)}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
