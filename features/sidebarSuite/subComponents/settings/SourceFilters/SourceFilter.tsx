import React from "react";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "next-i18next";
import { SourceTextTree } from "@components/db/SourceTextTree";
import { TreeViewSelectProps } from "@components/db/SourceTextTree/TreeBaseComponents";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Chip, FormLabel, IconButton, Popper } from "@mui/material";
import { type SourceFilter as SourceFilterType } from "features/sidebarSuite/config/types";
import { useAtom } from "jotai";

type SourceFilterSelectorProps = {
  filterName: SourceFilterType;
} & TreeViewSelectProps;

const SourceFilter = ({
  selectedItemsAtom,
  filterName,
}: SourceFilterSelectorProps) => {
  const { t } = useTranslation("settings");

  const [selectedSourceFilter, setSelectedSourceFilter] =
    useAtom(selectedItemsAtom);

  const { observe, height, width } = useDimensions();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget.parentElement);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? `${filterName}-source-filter-popper` : undefined;

  return (
    <div>
      <FormLabel>{t(`filtersLabels.source_${filterName}`)}</FormLabel>

      {/* simulates "Autocomplete" style input box */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "grey.400",
          minHeight: "4rem",
          p: 1,
        }}
      >
        <Box display="flex" flexWrap="wrap" gap={1}>
          {selectedSourceFilter.map((item) => (
            <Chip
              key={item.id}
              label={item.id}
              onDelete={() => {
                setSelectedSourceFilter(
                  selectedSourceFilter.filter(
                    (excludeItem) => excludeItem.id !== item.id,
                  ),
                );
              }}
            />
          ))}
        </Box>

        <IconButton
          aria-describedby={popperId}
          type="button"
          onClick={handleClick}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Box>

      <Popper
        id={popperId}
        open={open}
        anchorEl={anchorEl}
        sx={{
          zIndex: 1200,
          maxHeight: "424px",
          width: "100%",
          maxWidth: "340px",
          overflow: "clip",
          boxShadow: 3,
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
        placement="top"
      >
        <Box
          ref={observe}
          sx={{
            p: 1,
            minHeight: 400,
            width: "100%",
          }}
        >
          <SourceTextTree
            type="select"
            selectedItemsAtom={selectedItemsAtom}
            parentHeight={height}
            parentWidth={width}
            hasHeading={false}
            px={0}
          />
        </Box>
      </Popper>
    </div>
  );
};

export default SourceFilter;
