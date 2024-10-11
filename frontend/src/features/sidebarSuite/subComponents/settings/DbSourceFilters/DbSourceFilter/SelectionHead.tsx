import React from "react";
import { useTranslation } from "next-i18next";
import type {
  DbSourceFilters,
  DbSourceFilterType,
} from "@features/sidebarSuite/config/types";
import { SelectionHeadBox } from "@features/sidebarSuite/subComponents/settings/DbSourceFilters/styledComponents";
import { clearAllFilterParams } from "@features/sidebarSuite/subComponents/settings/DbSourceFilters/utils";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { FormLabel, IconButton } from "@mui/material";
import { parseAsJson, useQueryState } from "nuqs";

type SelectionHeadProps = {
  filterName: DbSourceFilterType;
  selectionIds: string[];
};

const SelectionHead = ({ filterName, selectionIds }: SelectionHeadProps) => {
  const { t } = useTranslation("settings");

  const [, setFilterParam] = useQueryState(
    "filters",
    parseAsJson<DbSourceFilters>(),
  );

  const handleClearSources = React.useCallback(
    async (filterSettingName: DbSourceFilterType) => {
      await setFilterParam((filterParam) => {
        return clearAllFilterParams({
          filterParam: filterParam ?? {},
          filterSettingName,
        });
      });
    },
    [setFilterParam],
  );

  return (
    <SelectionHeadBox>
      <FormLabel>{t(`filtersLabels.source_${filterName}`)}</FormLabel>

      {selectionIds.length > 0 ? (
        <IconButton
          aria-label="clear"
          onClick={() => handleClearSources(filterName)}
        >
          <CancelOutlinedIcon fontSize="small" />
        </IconButton>
      ) : null}
    </SelectionHeadBox>
  );
};

export default SelectionHead;
