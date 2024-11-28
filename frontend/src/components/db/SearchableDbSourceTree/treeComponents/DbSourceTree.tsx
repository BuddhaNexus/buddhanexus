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
    // todo: what is this? Can it be removed? I don't see usages in code
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
