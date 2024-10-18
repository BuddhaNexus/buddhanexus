import React, { memo } from "react";
import { filterComponents } from "@features/sidebarSuite/subComponents/uiSettings";

import { RequestFilterUISettingName } from "@features/sidebarSuite/types";

type Props = {
  filterSettingNames: RequestFilterUISettingName[];
};

function FilterUISettings({ filterSettingNames }: Props) {
  return filterSettingNames.map((filter) => {
    const Component = filterComponents[filter];
    const key = `filter-setting-${filter}`;

    if (!Component) return null;
    return React.cloneElement(Component, { key });
  });
}

export default memo(FilterUISettings);
