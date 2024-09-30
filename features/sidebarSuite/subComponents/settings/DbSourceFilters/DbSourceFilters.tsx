import React, { memo } from "react";
import { Box } from "@mui/material";
import {
  DbSourceFilters as DbSourceFiltersType,
  DbSourceFilterType,
} from "features/sidebarSuite/config/types";
import { parseAsJson, useQueryState } from "nuqs";

import DbSourceFilter from "./DbSourceFilter";
import { dbSourceFilterSelectors, getFilterIds } from "./utils";

const DbSourceFilters = () => {
  const [filterParam] = useQueryState(
    "filters",
    parseAsJson<DbSourceFiltersType>(),
  );

  const selectedSourceFilterIds = React.useMemo(
    () =>
      dbSourceFilterSelectors.reduce(
        (selectedIds, filterSettingName) => {
          return {
            ...selectedIds,
            [filterSettingName]: getFilterIds({
              filterParam,
              filterSettingName,
            }),
          };
        },
        {} as Record<DbSourceFilterType, string[]>,
      ),
    [filterParam],
  );

  return (
    <>
      {dbSourceFilterSelectors.map((filter) => {
        return (
          <Box key={`source-filter-${filter}`} sx={{ mb: 2 }}>
            <DbSourceFilter
              filterName={filter}
              selectionIds={selectedSourceFilterIds[filter]}
            />
          </Box>
        );
      })}
    </>
  );
};

export default memo(DbSourceFilters);
