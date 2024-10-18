import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { type SortMethod } from "@features/sidebarSuite/types";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import {
  allUIComponentParamNames,
  sortMethods,
} from "@features/sidebarSuite/uiSettingsLists";

export default function SortOption() {
  const { t } = useTranslation("settings");
  const router = useRouter();

  const sortMethodSelectValue = "position";

  const handleSelectChange = async (sortMethod: SortMethod) => {
    await router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        [allUIComponentParamNames.sort_method]: sortMethod,
      },
    });
  };

  return (
    <Box sx={{ width: 1, my: 3 }}>
      <FormControl sx={{ width: 1 }}>
        <InputLabel id="sort-option-selector-label">
          {t("optionsLabels.sort.selector")}
        </InputLabel>
        <Select
          value={sortMethodSelectValue}
          labelId="sort-option-selector-label"
          inputProps={{
            id: "sort-option-selector",
          }}
          input={<OutlinedInput label={t("optionsLabels.sort.selector")} />}
          onChange={(e) => handleSelectChange(e.target.value as SortMethod)}
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
