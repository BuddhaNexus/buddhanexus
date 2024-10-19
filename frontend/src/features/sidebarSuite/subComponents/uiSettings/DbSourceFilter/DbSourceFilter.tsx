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

const DbSourceFilter = ({
  filterName,
}: {
  filterName: DbSourceFilterUISetting;
}) => {
  /** TODO:
   * - adjust for graph view = include_collection only
   * - add render condition on search page if language is not set
   * */

  const [filterParam] = useQueryState(
    "filters",
    parseAsJson<DbSourceFilters>(),
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
        {} as Record<DbSourceFilterUISetting, string[]>,
      ),
    [filterParam],
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
