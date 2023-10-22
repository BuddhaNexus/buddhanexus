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
import type { QueryParams } from "features/sidebarSuite/config/types";

type SortParam = NonNullable<QueryParams["sort_method"]>;

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
  const router = useRouter();
  const { uniqueSettings, sortMethodSelectConfig } = useDbQueryParams();

  const handleSelectChange = async (sortMethod: SortParam) => {
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
          {t("optionsLabels.sorting")}
        </InputLabel>
        <Select
          id="sort-option-selector"
          aria-labelledby="sort-option-selector-label"
          value={sortMethodSelectConfig}
          input={<OutlinedInput label={t("optionsLabels.sorting")} />}
          onChange={(e) => handleSelectChange(e.target.value as SortParam)}
        >
          {SORT_OPTIONS.map((option) => {
            const key = Object.keys(option)[0] as keyof typeof option;
            const value = option[key]!;
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
