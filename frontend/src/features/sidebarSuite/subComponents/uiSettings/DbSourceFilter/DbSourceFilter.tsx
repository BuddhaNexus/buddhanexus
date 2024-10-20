import React, { memo } from "react";
import {
  DbSourceFilters,
  // FilterUISettings,
  DbSourceFilterUISetting,
} from "@features/sidebarSuite/types";
import { Box } from "@mui/material";
import { parseAsJson, useQueryState } from "nuqs";

import FilterUI from "./FilterUI";
import { dbSourceFilterSelectors, getFilterIds } from "./utils";
import { useDbQueryFilters } from "@components/hooks/commonQueryParams";

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
        {} as Record<DbSourceFilterUISetting, string[]>
      ),
    [filtersParam]
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
