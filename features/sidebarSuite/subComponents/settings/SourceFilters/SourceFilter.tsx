import React from "react";
import { useRouter } from "next/router";
import { TreeViewSelectProps } from "@components/db/SourceTextTree/TreeBaseComponents";
import { SourceTextTreeNode } from "@components/db/SourceTextTree/types";
import { SourceFilter as SourceFilterType } from "features/sidebarSuite/config/types";
import { useAtom } from "jotai";

import SourceFilterInput from "./SourceFilterInput";
import SourceFilterLabel from "./SourceFilterLabel";
import SourceFilterTreePopper from "./SourceFilterTreePopper";

type SourceFilterSelectorProps = {
  filterName: SourceFilterType;
} & TreeViewSelectProps;

const CHIP_GAP = 6;
const MAX_CHIP_ROW_WIDTH = 253;

const SourceFilter = ({
  selectedItemsAtom,
  filterName,
}: SourceFilterSelectorProps) => {
  const [selectedSourceFilter, setSelectedSourceFilter] =
    useAtom(selectedItemsAtom);

  /**
   * Selection box setup
   */
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);
  const selectionBoxRef = React.useRef<HTMLElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

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
    const observer = new ResizeObserver(calculateChipVisibility);
    if (selectionBoxRef.current) {
      observer.observe(selectionBoxRef.current);
    }
    return () => {
      if (selectionBoxRef.current) {
        observer.unobserve(selectionBoxRef.current);
      }
    };
  }, [calculateChipVisibility]);

  React.useEffect(() => {
    calculateChipVisibility();
  }, [selectedSourceFilter, calculateChipVisibility]);

  const handleDelete = (item: SourceTextTreeNode) => {
    setSelectedSourceFilter(
      selectedSourceFilter.filter((excludeItem) => excludeItem.id !== item.id),
    );
  };

  /**
   * Tree popper setup
   */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget.parentElement);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? `${filterName}-source-filter-popper` : undefined;
  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const onClear = () => setSelectedSourceFilter([]);

  /**
   * Route change handling
   */
  const router = useRouter();

  React.useEffect(() => {
    const handleRouteChange = () => {
      setSelectedSourceFilter([]);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, setSelectedSourceFilter]);

  return (
    <div key={filterName}>
      <SourceFilterLabel
        filterName={filterName}
        selectedSourceFilter={selectedSourceFilter}
        onClear={onClear}
      />
      <SourceFilterInput
        isExpanded={isExpanded}
        showButton={showButton}
        selectedSourceFilter={selectedSourceFilter}
        selectionBoxRef={selectionBoxRef}
        popperId={popperId}
        handleClick={handleClick}
        handleDelete={handleDelete}
        toggleExpand={toggleExpand}
        open={open}
      />
      <SourceFilterTreePopper
        popperId={popperId}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClosePopper}
        selectedItemsAtom={selectedItemsAtom}
      />
    </div>
  );
};

export default SourceFilter;
