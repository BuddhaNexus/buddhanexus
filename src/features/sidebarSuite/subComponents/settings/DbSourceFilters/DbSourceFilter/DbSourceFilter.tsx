import React from "react";
import { dbSourceFiltersSelectedIdsAtom } from "@features/atoms";
import { DbSourceFilterType } from "@features/sidebarSuite/config/types";
import { useSetAtom } from "jotai";

import SelectionBox from "./SelectionBox";
import SelectionHead from "./SelectionHead";
import TreePopper from "./TreePopper";

type DbSourceFilterSelectorProps = {
  filterName: DbSourceFilterType;
  selectionIds: string[];
};

const DbSourceFilter = ({
  filterName,
  selectionIds,
}: DbSourceFilterSelectorProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget.parentElement);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? `${filterName}-source-filter-popper` : undefined;
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
        open={open}
      />
      <TreePopper
        popperId={popperId}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClosePopper}
        filterSettingName={filterName}
      />
    </div>
  );
};

export default DbSourceFilter;
