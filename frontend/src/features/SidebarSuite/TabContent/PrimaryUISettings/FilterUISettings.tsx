import React, { memo } from "react";
import { RequestFilterUISettingName } from "@features/SidebarSuite/types";
import { filterComponents } from "@features/SidebarSuite/uiSettings";

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
