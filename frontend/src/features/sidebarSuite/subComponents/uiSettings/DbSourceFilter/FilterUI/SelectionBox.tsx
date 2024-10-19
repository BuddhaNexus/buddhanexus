import React from "react";
import { useTranslation } from "next-i18next";
import {
  InputOutlineBox,
  MultiSelectionBox,
  SelectionChipsBox,
} from "@features/sidebarSuite/subComponents/uiSettings/DbSourceFilter/styledComponents";
import { removeItemsById } from "@features/sidebarSuite/subComponents/uiSettings/DbSourceFilter/utils";
import type {
  DbSourceFilters,
  DbSourceFilterUISetting,
} from "@features/sidebarSuite/types";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, Chip, IconButton } from "@mui/material";
import { parseAsJson, useQueryState } from "nuqs";

const CHIP_GAP = 6;
const MAX_CHIP_ROW_WIDTH = 253;

type DbSourceFilterInputProps = {
  filterName: DbSourceFilterUISetting;
  popperId: string | undefined;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  open: boolean;
  selectionIds: string[];
};

/* simulates "Autocomplete" style input box */
const DbSourceFilterInput = ({
  filterName,
  popperId,
  handleClick,
  open,
  selectionIds,
}: DbSourceFilterInputProps) => {
  const { t } = useTranslation("common");

  const [, setFilterParam] = useQueryState(
    "filters",
    parseAsJson<DbSourceFilters>(),
  );

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);
  const selectionBoxRef = React.useRef<HTMLElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  // Prevents the selection box from getting too high, but allows full visibility on expanssion.
  const calculateChipVisibility = React.useCallback(() => {
    const selectionBox = selectionBoxRef.current;
    if (selectionBox) {
      let rowWidth = 0;
      let rowCount = 1;

      Array.from(selectionBox.children).forEach((child) => {
        if (child.nodeType === 1 && child instanceof HTMLElement) {
          const width = child.offsetWidth;
          rowWidth += width + CHIP_GAP;

          if (rowWidth > MAX_CHIP_ROW_WIDTH) {
            rowWidth = width;
            rowCount += 1;
          }
        }
      });

      setShowButton(rowCount > 3);
    }
  }, [selectionBoxRef]);

  React.useEffect(() => {
    const currentRef = selectionBoxRef.current;
    const observer = new ResizeObserver(calculateChipVisibility);

    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [calculateChipVisibility]);

  React.useEffect(() => {
    calculateChipVisibility();
  }, [selectionIds, calculateChipVisibility]);

  const handleClearSourcesById = React.useCallback(
    async (id: string, filterSettingName: DbSourceFilterUISetting) => {
      await setFilterParam((filterParam) => {
        return removeItemsById({
          filterParam: filterParam ?? {},
          id,
          filterSettingName,
        });
      });
    },
    [setFilterParam],
  );

  return (
    <InputOutlineBox>
      <MultiSelectionBox role="combobox" onClick={handleClick}>
        <SelectionChipsBox ref={selectionBoxRef} isExpanded={isExpanded}>
          {selectionIds.map((id) => (
            <Chip
              key={id}
              label={id}
              onDelete={() => handleClearSourcesById(id, filterName)}
            />
          ))}
        </SelectionChipsBox>

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
      </MultiSelectionBox>

      {showButton && (
        <Button sx={{ mt: 1 }} onClick={toggleExpand}>
          {isExpanded
            ? t("prompts.showLess")
            : t("prompts.showAll", { count: selectionIds.length })}
        </Button>
      )}
    </InputOutlineBox>
  );
};

export default DbSourceFilterInput;
