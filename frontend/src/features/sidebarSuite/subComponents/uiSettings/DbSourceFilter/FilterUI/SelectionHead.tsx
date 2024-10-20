import React from "react";
import { useTranslation } from "next-i18next";
import { SelectionHeadBox } from "@features/sidebarSuite/subComponents/uiSettings/DbSourceFilter/styledComponents";
import type { DbSourceFilterUISetting } from "@features/sidebarSuite/types";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { FormLabel, IconButton } from "@mui/material";

import {
  useExcludeCollectionsParam,
  useExcludeCategoriesParam,
  useExcludeFilesParam,
  useIncludeCollectionsParam,
  useIncludeCategoriesParam,
  useIncludeFilesParam,
} from "@components/hooks/params";

type SelectionHeadProps = {
  filterName: DbSourceFilterUISetting;
  selectionIds: string[];
};

const SelectionHead = ({ filterName, selectionIds }: SelectionHeadProps) => {
  const { t } = useTranslation("settings");

  const [, setExcludeCollections] = useExcludeCollectionsParam();
  const [, setExcludeCategories] = useExcludeCategoriesParam();
  const [, setExcludeFiles] = useExcludeFilesParam();
  const [, setIncludeCollections] = useIncludeCollectionsParam();
  const [, setIncludeCategories] = useIncludeCategoriesParam();
  const [, setIncludeFiles] = useIncludeFilesParam();

  const handleClearSources = React.useCallback(async () => {
    await setExcludeCollections(null);
    await setExcludeCategories(null);
    await setExcludeFiles(null);
    await setIncludeCollections(null);
    await setIncludeCategories(null);
    await setIncludeFiles(null);
  }, [
    setExcludeCollections,
    setExcludeCategories,
    setExcludeFiles,
    setIncludeCollections,
    setIncludeCategories,
    setIncludeFiles,
  ]);

  return (
    <SelectionHeadBox>
      <FormLabel>{t(`filtersLabels.${filterName}`)}</FormLabel>

      {selectionIds.length > 0 ? (
        <IconButton aria-label="clear" onClick={handleClearSources}>
          <CancelOutlinedIcon fontSize="small" />
        </IconButton>
      ) : null}
    </SelectionHeadBox>
  );
};

export default SelectionHead;
