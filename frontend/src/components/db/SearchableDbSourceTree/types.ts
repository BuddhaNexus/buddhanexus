import { DbSourceFilterUISetting } from "@features/SidebarSuite/types";

export enum DbSourceTreeNodeDataType {
  Category = "category",
  Collection = "collection",
  Text = "text",
}

export type DbSourceTreeNode = {
  id: string;
  name: string;
  dataType: DbSourceTreeNodeDataType;
  children?: DbSourceTreeNode[];
  fileName?: string;
  searchField: string;
};

export enum DbSourceTreeType {
  Browser = "browser",
  FilterSelector = "filter-selector",
}

export type DbSourceTreeBaseProps = {
  data: DbSourceTreeNode[];
  height: number;
  width: number;
  searchTerm?: string;
};

export type BrowserTreeProps = {
  type: DbSourceTreeType.Browser;
};

export type DbSourceFilterSelectorTreeProps = {
  type: DbSourceTreeType.FilterSelector;
  filterSettingName: DbSourceFilterUISetting;
};

export type DbSourceTreeProps = DbSourceTreeBaseProps &
  (
    | ({ type: DbSourceTreeType.Browser } & BrowserTreeProps)
    | ({
        type: DbSourceTreeType.FilterSelector;
      } & DbSourceFilterSelectorTreeProps)
  );
