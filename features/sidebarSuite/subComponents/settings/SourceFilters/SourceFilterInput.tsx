import React from "react";
import { useTranslation } from "next-i18next";
import { SourceTextTreeNode } from "@components/db/SourceTextTree/types";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Button, Chip, IconButton } from "@mui/material";

type SourceFilterInputProps = {
  isExpanded: boolean;
  showButton: boolean;
  selectedSourceFilter: SourceTextTreeNode[];
  selectionBoxRef: React.RefObject<HTMLElement>;
  popperId: string | undefined;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleDelete: (item: SourceTextTreeNode) => void;
  toggleExpand: () => void;
  open: boolean;
};

/* simulates "Autocomplete" style input box */
const SourceFilterInput = ({
  isExpanded,
  showButton,
  selectedSourceFilter,
  selectionBoxRef,
  popperId,
  handleClick,
  handleDelete,
  toggleExpand,
  open,
}: SourceFilterInputProps) => {
  const { t } = useTranslation("common");
  return (
    <Box
      sx={{
        borderRadius: 1,
        border: "1px solid",
        borderColor: "grey.400",
        minHeight: "4rem",
        p: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
        role="combobox"
        onClick={handleClick}
      >
        <Box
          ref={selectionBoxRef}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            maxHeight: isExpanded ? "none" : "6.9rem", // 3 rows
            overflow: "clip",
          }}
        >
          {selectedSourceFilter.map((item) => (
            <Chip
              key={item.id}
              label={item.id}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </Box>

        <IconButton
          aria-describedby={popperId}
          type="button"
          onClick={handleClick}
        >
          <ArrowDropDownIcon
            sx={{
              transform: open ? "rotate(180deg)" : undefined,
              transition: "transform 200ms",
            }}
          />
        </IconButton>
      </Box>
      {showButton && (
        <Button sx={{ mt: 1 }} onClick={toggleExpand}>
          {isExpanded
            ? t("prompts.showLess")
            : t("prompts.showAll", { count: selectedSourceFilter.length })}
        </Button>
      )}
    </Box>
  );
};

export default SourceFilterInput;
