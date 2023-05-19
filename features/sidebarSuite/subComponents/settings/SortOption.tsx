import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  Box,
  CircularProgress,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
} from "@mui/material";
import type { QueryParams } from "features/sidebarSuite/common/dbSidebarSettings";
import { StringParam, useQueryParam } from "use-query-params";

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
  const { isReady } = useRouter();

  const [sortMethodParam, setSortMethodParam] = useQueryParam(
    "sort_method",
    StringParam
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isReady) {
      setSortMethodParam(sortMethodParam ?? "position");
    }
    if (sortMethodParam) {
      setIsLoading(false);
    }
  }, [isReady, sortMethodParam, setSortMethodParam]);

  const handleSelectChange = (value: SortParam) => {
    setSortMethodParam(value);
  };

  return (
    <Box sx={{ width: 1, mb: 2 }}>
      <FormLabel id="sort-option-selector-label">
        {t("optionsLabels.sorting")}
      </FormLabel>
      <FormControl sx={{ width: 1 }}>
        {isLoading ? (
          <Select
            id="sort-option-selector"
            aria-labelledby="sort-option-selector-label"
            value={sortMethodParam ?? "position"}
          >
            <MenuItem value={sortMethodParam ?? "position"}>
              <CircularProgress color="inherit" size={20} />
            </MenuItem>
          </Select>
        ) : (
          <Select
            id="sort-option-selector"
            aria-labelledby="sort-option-selector-label"
            value={sortMethodParam}
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
        )}
      </FormControl>
    </Box>
  );
}
