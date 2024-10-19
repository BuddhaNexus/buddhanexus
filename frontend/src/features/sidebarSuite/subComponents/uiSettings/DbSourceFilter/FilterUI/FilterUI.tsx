import React from "react";
import { dbSourceFiltersSelectedIdsAtom } from "@atoms";
import { DbSourceFilterUISetting } from "@features/sidebarSuite/types";
import { useSetAtom } from "jotai";

import SelectionBox from "./SelectionBox";
import SelectionHead from "./SelectionHead";
import TreePopper from "./TreePopper";

type DbSourceFilterSelectorProps = {
  filterName: DbSourceFilterUISetting;
  selectionIds: string[];
};

const FilterUI = ({
  filterName,
  selectionIds,
}: DbSourceFilterSelectorProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget.parentElement);
  };

  const isPopperOpen = Boolean(anchorEl);
  const popperId = isPopperOpen
    ? `${filterName}-source-filter-popper`
    : undefined;
  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const setDbSourceFiltersSelectedIds = useSetAtom(
    dbSourceFiltersSelectedIdsAtom,
  );

  React.useEffect(() => {
    setDbSourceFiltersSelectedIds((prev) => {
      return { ...prev, [filterName]: selectionIds };
    });
  }, [filterName, selectionIds, setDbSourceFiltersSelectedIds]);

  return (
    <div key={filterName}>
      <SelectionHead filterName={filterName} selectionIds={selectionIds} />
      <SelectionBox
        filterName={filterName}
        selectionIds={selectionIds}
        popperId={popperId}
        handleClick={handleClick}
        open={isPopperOpen}
      />
      <TreePopper
        popperId={popperId}
        open={isPopperOpen}
        anchorEl={anchorEl}
        handleClose={handleClosePopper}
        filterSettingName={filterName}
      />
    </div>
  );
};

export default FilterUI;
