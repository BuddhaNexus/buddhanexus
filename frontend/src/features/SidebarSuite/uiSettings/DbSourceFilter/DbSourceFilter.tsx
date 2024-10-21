import React, { memo } from "react";
import { useDbQueryFilters } from "@components/hooks/groupedQueryParams";
import {
  // FilterUISettings,
  DbSourceFilterUISetting,
} from "@features/SidebarSuite/types";
import { Box } from "@mui/material";

import FilterUI from "./FilterUI";
import { dbSourceFilterSelectors, getFilterIds } from "./utils";

const DbSourceFilter = ({
  filterName,
}: {
  filterName: DbSourceFilterUISetting;
}) => {
  /** TODO:
   * - adjust for graph view = include_collection only
   * - add render condition on search page if language is not set
   * */

  const filtersParam = useDbQueryFilters();

  const selectedSourceFilterIds = React.useMemo(
    () =>
      dbSourceFilterSelectors.reduce(
        (selectedIds, filterSettingName) => {
          return {
            ...selectedIds,
            [filterSettingName]: getFilterIds({
              filtersParam,
              filterSettingName,
            }),
          };
        },
        {} as Record<DbSourceFilterUISetting, string[]>,
      ),
    [filtersParam],
  );

  return (
    <Box sx={{ mb: 2 }}>
      <FilterUI
        filterName={filterName}
        selectionIds={selectedSourceFilterIds[filterName]}
      />
    </Box>
  );
};

export default memo(DbSourceFilter);
