import React from "react";
import { useTranslation } from "next-i18next";

import { useClearDbSourceFilterQueryParams } from "@components/hooks/groupedQueryParams";
import type { DbSourceFilterUISetting } from "@features/SidebarSuite/types";
import { SelectionHeadBox } from "@features/SidebarSuite/uiSettings/DbSourceFilter/styledComponents";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { FormLabel, IconButton } from "@mui/material";

type SelectionHeadProps = {
  filterName: DbSourceFilterUISetting;
  selectionIds: string[];
};

const SelectionHead = ({ filterName, selectionIds }: SelectionHeadProps) => {
  const { t } = useTranslation("settings");

  const handleClearDbSourceFilterParams = useClearDbSourceFilterQueryParams();

  return (
    <SelectionHeadBox>
      <FormLabel>{t(`filtersLabels.${filterName}`)}</FormLabel>

      {selectionIds.length > 0 ? (
        <IconButton
          aria-label="clear"
          onClick={() => handleClearDbSourceFilterParams()}
        >
          <CancelOutlinedIcon fontSize="small" />
        </IconButton>
      ) : null}
    </SelectionHeadBox>
  );
};

export default SelectionHead;
