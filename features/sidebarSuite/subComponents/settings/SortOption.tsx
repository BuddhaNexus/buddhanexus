import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import {
  type SortMethod,
  sortMethods,
} from "features/sidebarSuite/config/types";

export default function SortOption() {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const { uniqueSettings, sortMethodSelectValue } = useDbQueryParams();

  // TODO: review handling!
  const handleSelectChange = async (sortMethod: SortMethod) => {
    await router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        [uniqueSettings.queryParams.sortMethod]: sortMethod,
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
