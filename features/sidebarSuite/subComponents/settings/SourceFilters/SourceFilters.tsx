import React, { memo } from "react";
import { SourceTextTreeNode } from "@components/db/SourceTextTree/types";
import { Box } from "@mui/material";
import {
  selectedExcludeSourceFilterAtom,
  selectedIncludeSourceFilterAtom,
} from "features/atoms";
import { type SourceFilter as SourceFilterType } from "features/sidebarSuite/config/types";
import { PrimitiveAtom } from "jotai";
import { exhaustiveStringTuple } from "utils/validators";

import SourceFilter from "./SourceFilter";

const selectors = exhaustiveStringTuple<SourceFilterType>()(
  "exclude",
  "include",
);

const sourceFiltersAtoms: Record<
  SourceFilterType,
  PrimitiveAtom<SourceTextTreeNode[]>
> = {
  exclude: selectedExcludeSourceFilterAtom,
  include: selectedIncludeSourceFilterAtom,
};

const SourceFilters = () => {
  return (
    <>
      {selectors.map((filter) => {
        return (
          <Box key={`source-filter-${filter}`} sx={{ mb: 2 }}>
            <SourceFilter
              filterName={filter}
              selectedItemsAtom={sourceFiltersAtoms[filter]}
            />
          </Box>
        );
      })}
    </>
  );
};

export default memo(SourceFilters);
