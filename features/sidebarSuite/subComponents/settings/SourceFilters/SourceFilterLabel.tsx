import React from "react";
import { useTranslation } from "next-i18next";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Box, FormLabel, IconButton } from "@mui/material";
import { type SourceFilter } from "features/sidebarSuite/config/types";
type SourceFilterLabelProps = {
  filterName: SourceFilter;
  selectedSourceFilter: any[];
  onClear: () => void;
};

const SourceFilterLabel = ({
  filterName,
  selectedSourceFilter,
  onClear,
}: SourceFilterLabelProps) => {
  const { t } = useTranslation("settings");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <FormLabel>{t(`filtersLabels.source_${filterName}`)}</FormLabel>

      {selectedSourceFilter.length > 0 ? (
        <IconButton aria-label="clear" onClick={onClear}>
          <CancelOutlinedIcon fontSize="small" />
        </IconButton>
      ) : null}
    </Box>
  );
};

export default SourceFilterLabel;
