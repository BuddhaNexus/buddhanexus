import {
  DbSourceTreeProps,
  DbSourceTreeType,
} from "@components/db/SearchableDbSourceTree/types";
import { DbSourceFilterSelectorTree } from "@features/SidebarSuite/uiSettings/DbSourceFilter/tree/DbSourceFilterTree";

import DbSourceBrowserTree from "./DbSourceBrowserTree";

export function DbSourceTree({
  type,
  data,
  height,
  width,
  searchTerm,
}: DbSourceTreeProps) {
  if (type === DbSourceTreeType.FILTER_SELECTOR) {
    return (
      <DbSourceFilterSelectorTree
        data={data}
        height={height}
        width={width}
        searchTerm={searchTerm}
        filterSettingName={props.filterSettingName}
      />
    );
  }

  return (
    <DbSourceBrowserTree
      data={data}
      height={height}
      width={width}
      searchTerm={searchTerm}
    />
  );
}
